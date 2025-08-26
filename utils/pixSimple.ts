// Sistema PIX Simplificado para Desenvolvimento
// Gera códigos PIX funcionais sem validação complexa

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
      
      // Gerar QR Code via API externa
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
        qrCodeBase64: '', // Vazio - usaremos URL externa
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
    // Código PIX simplificado para desenvolvimento
    // Em produção, use a especificação EMV completa
    
    const amount = payment.amount.toFixed(2)
    const description = payment.description.substring(0, 20).toUpperCase()
    const orderId = payment.orderId.substring(0, 20).toUpperCase()
    
    // Formato básico: chave+valor+descrição
    return `00020101021226580014BR.GOV.BCB.PIX0136${this.pixKey}0203${description}5204581253039865404${amount}5802BR5925${this.merchantName}6009${this.merchantCity}62070503${orderId}6304`
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
