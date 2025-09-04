import { PIX_CONFIG, PixPaymentRequest, PixPaymentResponse, PixPaymentStatus } from './pixConfig'
import { projectId, publicAnonKey } from './supabase/info'
import { logger } from './logger'

// Serviço PIX para Cookite
export class PixService {
  private static instance: PixService
  private baseUrl: string

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3664ed98`
  }

  static getInstance(): PixService {
    if (!PixService.instance) {
      PixService.instance = new PixService()
    }
    return PixService.instance
  }

  // Criar pagamento PIX
  async createPayment(request: PixPaymentRequest): Promise<PixPaymentResponse> {
    try {
      logger.log('Criando pagamento PIX:', request)

      const response = await fetch(`${this.baseUrl}/pix/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          amount: request.amount,
          description: request.description,
          reservationId: request.reservationId,
          customerName: request.customerName,
          customerEmail: request.customerEmail,
          pixKey: PIX_CONFIG.pixKey,
          merchant: PIX_CONFIG.merchant
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        logger.error('Erro ao criar pagamento PIX:', errorData)
        return {
          success: false,
          error: errorData.error || 'Erro ao criar pagamento'
        }
      }

      const data = await response.json()
      logger.log('Pagamento PIX criado com sucesso:', data)

      return {
        success: true,
        transactionId: data.transactionId,
        qrCode: data.qrCode,
        pixCode: data.pixCode,
        amount: data.amount,
        expiresAt: data.expiresAt
      }

    } catch (error) {
      logger.error('Erro ao criar pagamento PIX:', error)
      return {
        success: false,
        error: 'Erro de conexão ao criar pagamento'
      }
    }
  }

  // Verificar status do pagamento
  async checkPaymentStatus(transactionId: string): Promise<PixPaymentStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/pix/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      })

      if (!response.ok) {
        logger.error('Erro ao verificar status do pagamento:', response.status)
        return null
      }

      const data = await response.json()
      return data

    } catch (error) {
      logger.error('Erro ao verificar status do pagamento:', error)
      return null
    }
  }

  // Cancelar pagamento
  async cancelPayment(transactionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/${transactionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      })

      return response.ok

    } catch (error) {
      logger.error('Erro ao cancelar pagamento:', error)
      return false
    }
  }

  // Gerar QR Code PIX (usando API externa)
  async generateQRCode(pixCode: string): Promise<string> {
    try {
      // Usar API gratuita para gerar QR Code
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`
      return qrApiUrl
    } catch (error) {
      logger.error('Erro ao gerar QR Code:', error)
      // Fallback para QR Code simples
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <text x="100" y="100" text-anchor="middle" font-size="16" fill="black">PIX</text>
          <text x="100" y="120" text-anchor="middle" font-size="12" fill="gray">${pixCode.slice(0, 20)}...</text>
        </svg>
      `)}`
    }
  }

  // Validar chave PIX
  validatePixKey(key: string, type: string): boolean {
    const validators = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      cpf: /^\d{11}$/,
      cnpj: /^\d{14}$/,
      phone: /^\d{10,11}$/,
      random: /^[a-zA-Z0-9]{32}$/
    }

    const validator = validators[type as keyof typeof validators]
    return validator ? validator.test(key) : false
  }
}

// Instância singleton
export const pixService = PixService.getInstance()

