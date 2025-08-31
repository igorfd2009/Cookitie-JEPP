// Configuração do sistema de emails
export const EMAIL_CONFIG = {
  // Configurações do Resend
  RESEND: {
    API_URL: 'https://deeichvgibhpbrowhaiq.supabase.co/functions/v1/resend-proxy',
    FROM_EMAIL: 'Cookite JEPP <noreply@resend.dev>',
    SUBJECTS: {
      THANK_YOU: '🍪 Obrigado pela sua reserva! - Cookite JEPP 2025',
      PAYMENT_CONFIRMED: '✅ Pagamento Confirmado - Cookite JEPP 2025',
      REMINDER: '⏰ Lembrete: Retire seus doces hoje! - Cookite JEPP 2025'
    }
  },
  
  // Configurações do evento
  EVENT: {
    NAME: 'JEPP 2025',
    DATE: '12/09/2025',
    TIME: '09:00 às 16:00',
    LOCATION: 'Escola Estadual Exemplo - Ginásio / Stand B',
    ORGANIZATION: 'Stand da Cookite no evento JEPP Sebrae'
  },
  
  // Configurações de contato
  CONTACT: {
    INSTAGRAM: 'https://instagram.com/cookite_oficial',
    WHATSAPP: 'https://wa.me/5511999999999',
    PHONE: '(11) 99999-9999'
  },
  
  // Configurações de desconto
  DISCOUNT: {
    PERCENTAGE: 20,
    DESCRIPTION: 'Desconto automático de 20% para reservas antecipadas'
  },
  
  // Configurações de pagamento
  PAYMENT: {
    EXPIRES_IN_MINUTES: 30,
    METHOD: 'PIX',
    INSTRUCTIONS: 'Complete o pagamento PIX em até 30 minutos para confirmar sua reserva'
  }
}

// Templates de email
export const EMAIL_TEMPLATES = {
  // Cores do tema Cookite
  COLORS: {
    PRIMARY: '#A8D0E6',
    SECONDARY: '#FFE9A8',
    SUCCESS: '#22C55E',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
    TEXT_PRIMARY: '#374151',
    TEXT_SECONDARY: '#374151',
    TEXT_LIGHT: '#1F2937'
  },
  
  // Estilos CSS inline
  STYLES: {
    CONTAINER: 'font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;',
    HEADER: 'background: linear-gradient(135deg, #A8D0E6 0%, #FFE9A8 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;',
    CONTENT: 'background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);',
    BUTTON: 'background: linear-gradient(135deg, #A8D0E6 0%, #FFE9A8 100%); color: #374151; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 500; display: inline-block;'
  }
}

// Função para gerar código de retirada
export function generatePickupCode(_reservationId: string, customerName: string): string {
  const timestamp = Date.now().toString(36)
  const nameHash = customerName.replace(/[^A-Z]/gi, '').substring(0, 3).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  
  return `${nameHash}-${timestamp}-${random}`
}

// Função para formatar valor monetário
export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}

// Função para formatar data
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

