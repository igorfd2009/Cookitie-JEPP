// 📋 EXEMPLO DE CONFIGURAÇÃO PIX - COOKITE JEPP
// 
// 1. Copie este arquivo para pixConfig.ts
// 2. Substitua os valores pelos seus dados reais
// 3. Nunca commite este arquivo no Git

export const PIX_CONFIG = {
  // 🔑 CHAVE PIX - ESCOLHA UMA OPÇÃO:
  
  // Opção 1: PIX por Email (Recomendado para eventos)
  pixKey: {
    type: 'email',
    value: 'cookite@jepp.com.br' // ⚠️ SUBSTITUA pelo seu email real
  },
  
  // Opção 2: PIX por CPF
  // pixKey: {
  //   type: 'cpf',
  //   value: '12345678900' // ⚠️ SUBSTITUA pelo seu CPF (sem pontos)
  // },
  
  // Opção 3: PIX por CNPJ
  // pixKey: {
  //   type: 'cnpj',
  //   value: '12345678000190' // ⚠️ SUBSTITUA pelo seu CNPJ (sem pontos)
  // },
  
  // Opção 4: PIX por Telefone
  // pixKey: {
  //   type: 'phone',
  //   value: '11999999999' // ⚠️ SUBSTITUA pelo seu telefone (apenas números)
  // },
  
  // 🏢 DADOS DO COMERCIANTE
  merchant: {
    name: 'COOKITE JEPP', // ⚠️ SUBSTITUA pelo nome da sua empresa
    city: 'SAO PAULO', // ⚠️ SUBSTITUA pela sua cidade
    category: 'FOOD_AND_BEVERAGE' // Categoria: FOOD_AND_BEVERAGE, RETAIL, SERVICES, etc.
  },
  
  // ⏰ CONFIGURAÇÕES DE PAGAMENTO
  payment: {
    expirationMinutes: 30, // Tempo para o PIX expirar
    checkIntervalSeconds: 5, // Intervalo para verificar status
    maxRetries: 3 // Máximo de tentativas
  },
  
  // 🌐 URLs DA API
  api: {
    baseUrl: 'https://deeichvgibhpbrowhaiq.supabase.co/functions/v1/make-server-3664ed98',
    endpoints: {
      createPayment: '/pix/create',
      checkStatus: '/pix/status',
      cancelPayment: '/pix/cancel'
    }
  }
}

// 📧 CONFIGURAÇÃO DE EMAIL
export const EMAIL_INTEGRATION = {
  service: 'resend', // Serviço de email
  
  // 🔑 RESEND API - OBTER EM: https://resend.com
  resend: {
    apiKey: 're_123456789...', // ⚠️ SUBSTITUA pela sua chave API do Resend
    fromEmail: 'Cookite JEPP <noreply@seudominio.com>', // ⚠️ SUBSTITUA pelo seu email verificado
    subjects: {
      thankYou: '🍪 Obrigado pela sua reserva! - Cookite JEPP 2025',
      paymentConfirmed: '✅ Pagamento Confirmado - Cookite JEPP 2025',
      reminder: '⏰ Lembrete: Retire seus doces hoje! - Cookite JEPP 2025'
    }
  },
  
  // 🔔 CONFIGURAÇÕES DE NOTIFICAÇÃO
  notifications: {
    onReservationCreated: true, // Email após criar reserva
    onPaymentConfirmed: true, // Email após confirmar pagamento
    onEventDay: false, // Email de lembrete no dia do evento (opcional)
    includePickupCode: true // Incluir código de retirada
  },
  
  // 🎉 CONFIGURAÇÕES DO EVENTO
  event: {
    name: 'JEPP 2025',
    date: '12/09/2025',
    time: '09:00 às 16:00',
    location: 'Escola Estadual Exemplo - Ginásio / Stand B', // ⚠️ SUBSTITUA pela localização real
    organization: 'Stand da Cookite no evento JEPP Sebrae'
  }
}

// 📝 TIPOS PARA PIX
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

// 📧 TIPOS PARA INTEGRAÇÃO COM EMAIL
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

// 🚀 COMO USAR:
//
// 1. Copie este arquivo para utils/pixConfig.ts
// 2. Substitua os valores marcados com ⚠️ pelos seus dados reais
// 3. Configure sua chave PIX no banco
// 4. Configure sua conta no Resend
// 5. Teste o sistema com valores pequenos
// 6. Verifique se os emails estão sendo enviados
// 7. Teste o QR Code com diferentes apps bancários
//
// ✅ PRONTO! Seu sistema PIX funcionará perfeitamente!
