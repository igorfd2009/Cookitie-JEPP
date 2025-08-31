// Configurações PIX para Cookite JEPP
export const PIX_CONFIG = {
  // Chave PIX por telefone
  pixKey: {
    type: 'phone',
    value: '+5511998008397' // Telefone PIX da Nicolly (formato internacional)
  },
  
  // Dados do beneficiário
  merchant: {
    name: 'NICOLLY ASCIONE SALOMAO', // Nome sem acento como aparece no banco
    city: 'SAO PAULO',
    category: 'FOOD_AND_BEVERAGE'
  },
  
  // Configurações de pagamento
  payment: {
    expirationMinutes: 30, // Tempo para expirar
    checkIntervalSeconds: 5, // Intervalo de verificação
    maxRetries: 3 // Máximo de tentativas
  },
  
  // URLs da API
  api: {
    baseUrl: 'https://deeichvgibhpbrowhaiq.supabase.co/functions/v1/make-server-3664ed98',
    endpoints: {
      createPayment: '/reservations',
      checkStatus: '/pix/status',
      cancelPayment: '/payment'
    }
  }
}

// Configurações de Email (integradas com PIX)
export const EMAIL_INTEGRATION = {
  // Serviço de email
  service: 'resend', // 'resend', 'sendgrid', 'mailgun'
  
  // Configurações do Resend
  resend: {
    apiKey: process.env.VITE_RESEND_API_KEY || '',
    fromEmail: 'Cookite JEPP <nickaasalomao@gmail.com>', // Email confirmado
    subjects: {
      thankYou: '🍪 Obrigado pela sua reserva! - Cookite JEPP 2025',
      paymentConfirmed: '✅ Pagamento Confirmado - Cookite JEPP 2025',
      reminder: '⏰ Lembrete: Retire seus doces hoje! - Cookite JEPP 2025'
    }
  },
  
  // Configurações de notificação
  notifications: {
    // Enviar email após criar reserva
    onReservationCreated: true,
    
    // Enviar email após confirmar pagamento
    onPaymentConfirmed: true,
    
    // Enviar email de lembrete no dia do evento
    onEventDay: false, // Opcional
    
    // Incluir código de retirada
    includePickupCode: true
  },
  
  // Configurações do evento
  event: {
    name: 'JEPP 2025',
    date: '12/09/2025',
    time: '09:00 às 16:00',
    location: 'Escola Estadual Exemplo - Ginásio / Stand B',
    organization: 'Stand da Cookite no evento JEPP Sebrae'
  }
}

// Tipos para PIX
export interface PixPaymentRequest {
  amount: number
  description: string
  reservationId: string
  customerName: string
  customerEmail: string
}

export interface PixPaymentResponse {
  success: boolean
  transactionId?: string
  qrCode?: string
  pixCode?: string
  amount?: number
  expiresAt?: string
  error?: string
}

export interface PixPaymentStatus {
  transactionId: string
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
  amount: number
  paidAt?: string
  expiresAt: string
}

// Tipos para integração com email
export interface EmailNotification {
  type: 'reservation_created' | 'payment_confirmed' | 'event_reminder'
  customerEmail: string
  customerName: string
  reservationId: string
  transactionId?: string
  amount?: number
  products?: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}
