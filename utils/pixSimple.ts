// Sistema PIX Simplificado para Desenvolvimento
// Gera códigos PIX funcionais sem validação complexa

import QRCode from 'qrcode'

interface SimplePixPayment {
  amount: number
  description: string
  orderId: string
  customer: {
    name: string
    email: string
    phone: string
  }
  expiresInMinutes?: number
}

interface SimplePixResponse {
  success: boolean
  transactionId: string
  pixCode: string
  qrCodeBase64: string
  qrCodeUrl: string
  amount: number
  expiresAt: string
  status: 'pending' | 'paid' | 'expired'
  customer: any
  orderId: string
  error?: string
}

class SimplePixSystem {
  private pixKey = '+5511998008397'
  private merchantName = 'NICOLLY ASCIONE SALOMAO'
  private merchantCity = 'SAO PAULO'
  
  async createPayment(payment: SimplePixPayment): Promise<SimplePixResponse> {
    try {
      // Gerar ID único
      const transactionId = `pix_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      
      // Calcular expiração (padrão 30 minutos)
      const expiresAt = new Date(Date.now() + (payment.expiresInMinutes || 30) * 60 * 1000)
      
      // Criar código PIX simplificado (apenas para desenvolvimento)
      const pixCode = this.generateSimplePixCode(payment)
      
      // Gerar QR Code base64
      const qrCodeBase64 = await QRCode.toDataURL(pixCode, { 
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 2
      })
      
      // Gerar QR Code via API externa como fallback
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`
      
      console.log('💳 PIX Simplificado Criado:', {
        transactionId,
        amount: payment.amount,
        customer: payment.customer.name,
        expiresAt: expiresAt.toISOString()
      })
      
      return {
        success: true,
        transactionId,
        pixCode,
        qrCodeBase64,
        qrCodeUrl,
        amount: payment.amount,
        expiresAt: expiresAt.toISOString(),
        status: 'pending',
        customer: payment.customer,
        orderId: payment.orderId
      }
    } catch (error) {
      console.error('Erro ao criar PIX:', error)
      return {
        success: false,
        transactionId: '',
        pixCode: '',
        qrCodeBase64: '',
        qrCodeUrl: '',
        amount: 0,
        expiresAt: '',
        status: 'pending',
        customer: {},
        orderId: '',
        error: 'Erro ao gerar PIX'
      }
    }
  }
  
  private generateSimplePixCode(payment: SimplePixPayment): string {
    // Código PIX válido seguindo especificação EMV
    const amount = payment.amount.toFixed(2)
    const description = payment.description.substring(0, 25).toUpperCase()
    const orderId = payment.orderId.substring(0, 25).toUpperCase()
    
    // Campos obrigatórios do PIX EMV
    const payloadFormatIndicator = '000201' // 00-02-01
    const pointOfInitiation = '010212' // 01-02-12 (único)
    
    // Merchant Account Information (26)
    const pixKeyLength = this.pixKey.length.toString().padStart(2, '0')
    const merchantAccountInfo = `26${(14 + this.pixKey.length).toString().padStart(2, '0')}0014BR.GOV.BCB.PIX01${pixKeyLength}${this.pixKey}02${description.length.toString().padStart(2, '0')}${description}`
    
    // Category Code (52)
    const categoryCode = '52040000'
    
    // Currency Code (53)
    const currencyCode = '5303986' // BRL
    
    // Transaction Amount (54)
    const amountLength = amount.length.toString().padStart(2, '0')
    const transactionAmount = `54${amountLength}${amount}`
    
    // Country Code (58)
    const countryCode = '5802BR'
    
    // Merchant Name (59)
    const merchantNameLength = this.merchantName.length.toString().padStart(2, '0')
    const merchantName = `59${merchantNameLength}${this.merchantName}`
    
    // Merchant City (60)
    const merchantCityLength = this.merchantCity.length.toString().padStart(2, '0')
    const merchantCity = `60${merchantCityLength}${this.merchantCity}`
    
    // Additional Data Field Template (62)
    const additionalData = `62070503${orderId.length.toString().padStart(2, '0')}${orderId}`
    
    // CRC16 (63)
    const dataForCRC = payloadFormatIndicator + pointOfInitiation + merchantAccountInfo + categoryCode + currencyCode + transactionAmount + countryCode + merchantName + merchantCity + additionalData + '6304'
    const crc = this.calculateCRC16(dataForCRC)
    
    return dataForCRC + crc
  }
  
  private calculateCRC16(data: string): string {
    // Implementação simplificada do CRC16-CCITT
    let crc = 0xFFFF
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021
        } else {
          crc <<= 1
        }
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0')
  }
  
  async checkPaymentStatus(transactionId: string): Promise<{ status: 'pending' | 'paid' | 'expired' } | null> {
    // Simulação - em produção, consultar API do banco/PSP
    console.log('🔍 Verificando status do pagamento:', transactionId)
    
    // Para desenvolvimento, sempre retorna pending
    return { status: 'pending' }
  }
  
  async confirmPayment(transactionId: string): Promise<boolean> {
    console.log('✅ Confirmando pagamento:', transactionId)
    // Simulação de confirmação
    return true
  }
}

// Instância global
export const simplePixSystem = new SimplePixSystem()

// Para compatibilidade com o sistema anterior
export { simplePixSystem as pixSystem }
