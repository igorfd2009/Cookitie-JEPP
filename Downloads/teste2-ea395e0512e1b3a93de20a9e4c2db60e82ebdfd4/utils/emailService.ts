import { EMAIL_CONFIG, EMAIL_TEMPLATES, generatePickupCode, formatCurrency } from './emailConfig'

// Vite environment variables are handled by vite-env.d.ts

// Interface para dados da reserva
export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  products: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  discountApplied: boolean
  notes?: string
  createdAt: string
}

// Interface para dados do pagamento
export interface Payment {
  transactionId: string
  amount: number
  status: 'pending' | 'paid' | 'expired' | 'cancelled'
}

// Classe para gerenciar envio de emails
export class EmailService {
  private apiKey: string | null = null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
  }

  // Verificar se o serviço está configurado
  isConfigured(): boolean {
    return !!this.apiKey
  }

  // Enviar email de agradecimento com código de retirada
  async sendThankYouEmail(reservation: Reservation): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailService não configurado - email não será enviado')
      return false
    }

    try {
      const pickupCode = generatePickupCode(reservation.id, reservation.name)
      const subtotal = reservation.discountApplied ? reservation.totalAmount / 0.8 : reservation.totalAmount
      const discount = reservation.discountApplied ? subtotal * 0.2 : 0

      const response = await fetch(EMAIL_CONFIG.RESEND.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_CONFIG.RESEND.FROM_EMAIL,
          to: [reservation.email],
          subject: EMAIL_CONFIG.RESEND.SUBJECTS.THANK_YOU,
          html: this.generateThankYouEmailHTML(reservation, pickupCode, subtotal, discount)
        })
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        if (errorBody) {
          console.error('Corpo do erro da API Resend:', errorBody)
        } else {
          const rawErrorText = await response.text().catch(() => 'N/A')
          console.error('Corpo do erro da API Resend (Texto Puro):', rawErrorText)
        }
        throw new Error(`Erro ao enviar email: ${response.statusText}`)
      }

      console.log(`✅ Email de agradecimento enviado para ${reservation.email}`)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar email de agradecimento:', error)
      return false
    }
  }

  // Enviar email de confirmação de pagamento
  async sendPaymentConfirmationEmail(reservation: Reservation, payment: Payment): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailService não configurado - email não será enviado')
      return false
    }

    try {
      const response = await fetch(EMAIL_CONFIG.RESEND.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_CONFIG.RESEND.FROM_EMAIL,
          to: [reservation.email],
          subject: EMAIL_CONFIG.RESEND.SUBJECTS.PAYMENT_CONFIRMED,
          html: this.generatePaymentConfirmationEmailHTML(reservation, payment)
        })
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        if (errorBody) {
          console.error('Corpo do erro da API Resend:', errorBody)
        } else {
          const rawErrorText = await response.text().catch(() => 'N/A')
          console.error('Corpo do erro da API Resend (Texto Puro):', rawErrorText)
        }
        throw new Error(`Erro ao enviar email: ${response.statusText}`)
      }

      console.log(`✅ Email de confirmação enviado para ${reservation.email}`)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar email de confirmação:', error)
      return false
    }
  }

  // Enviar email de lembrete (para o dia do evento)
  async sendReminderEmail(reservation: Reservation): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailService não configurado - email não será enviado')
      return false
    }

    try {
      const response = await fetch(EMAIL_CONFIG.RESEND.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_CONFIG.RESEND.FROM_EMAIL,
          to: [reservation.email],
          subject: EMAIL_CONFIG.RESEND.SUBJECTS.REMINDER,
          html: this.generateReminderEmailHTML(reservation)
        })
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        if (errorBody) {
          console.error('Corpo do erro da API Resend:', errorBody)
        } else {
          const rawErrorText = await response.text().catch(() => 'N/A')
          console.error('Corpo do erro da API Resend (Texto Puro):', rawErrorText)
        }
        throw new Error(`Erro ao enviar email: ${response.statusText}`)
      }

      console.log(`✅ Email de lembrete enviado para ${reservation.email}`)
      return true
    } catch (error) {
      console.error('❌ Erro ao enviar email de lembrete:', error)
      return false
    }
  }

  // Gerar HTML do email de agradecimento
  private generateThankYouEmailHTML(reservation: Reservation, pickupCode: string, subtotal: number, discount: number): string {
    return `
      <div style="${EMAIL_TEMPLATES.STYLES.CONTAINER}">
        <div style="${EMAIL_TEMPLATES.STYLES.HEADER}">
          <h1 style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 0; font-size: 28px;">🍪 Obrigado pela sua reserva!</h1>
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 10px 0 0 0; font-size: 16px;">${EMAIL_CONFIG.EVENT.NAME}</p>
        </div>
        
        <div style="${EMAIL_TEMPLATES.STYLES.CONTENT}">
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; font-size: 18px; margin-bottom: 25px;">
            Olá <strong>${reservation.name}</strong>,
          </p>
          
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY}; line-height: 1.6;">
            Muito obrigado por escolher a <strong style="color: ${EMAIL_TEMPLATES.COLORS.PRIMARY};">Cookite</strong>! 
            Sua reserva foi criada com sucesso e está aguardando confirmação do pagamento PIX.
          </p>
          
          <div style="background: #FEF3C7; border: 2px solid ${EMAIL_TEMPLATES.COLORS.WARNING}; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h3 style="color: #92400E; margin: 0 0 15px 0; font-size: 20px;">🎯 Código de Retirada</h3>
            <div style="background: white; padding: 15px; border-radius: 8px; border: 2px dashed ${EMAIL_TEMPLATES.COLORS.WARNING}; margin: 15px 0;">
              <p style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: ${EMAIL_TEMPLATES.COLORS.PRIMARY}; margin: 0; letter-spacing: 2px;">
                ${pickupCode}
              </p>
            </div>
            <p style="color: #92400E; font-size: 14px; margin: 10px 0 0 0;">
              Guarde este código! Você precisará dele para retirar seus doces.
            </p>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 0 0 15px 0;">📋 Detalhes da Reserva:</h3>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>ID da Reserva:</strong> ${reservation.id}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>Produtos:</strong> ${reservation.products.map(p => `${p.name} (${p.quantity}x)`).join(', ')}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
            ${reservation.discountApplied ? `<p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.SUCCESS};"><strong>Desconto (${EMAIL_CONFIG.DISCOUNT.PERCENTAGE}%):</strong> -${formatCurrency(discount)}</p>` : ''}
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; font-weight: bold;"><strong>Total a Pagar:</strong> ${formatCurrency(reservation.totalAmount)}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>Data de Retirada:</strong> ${EMAIL_CONFIG.EVENT.DATE} (${EMAIL_CONFIG.EVENT.NAME})</p>
          </div>
          
          <div style="background: #EFF6FF; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.INFO}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #1E40AF; margin: 0 0 10px 0;">📍 Local de Retirada:</h4>
            <p style="margin: 0; color: #1E40AF; font-weight: 500;">
              <strong>${EMAIL_CONFIG.EVENT.ORGANIZATION}</strong><br>
              <strong>${EMAIL_CONFIG.EVENT.LOCATION}</strong>
            </p>
          </div>
          
          <div style="background: #F0FDF4; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.SUCCESS}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #166534; margin: 0 0 10px 0;">⏰ Horário de Retirada:</h4>
            <p style="margin: 0; color: #166534; font-weight: 500;">
              <strong>${EMAIL_CONFIG.EVENT.DATE}</strong> das <strong>${EMAIL_CONFIG.EVENT.TIME}</strong>
            </p>
          </div>
          
          <div style="background: #FEF2F2; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.ERROR}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #991B1B; margin: 0 0 10px 0;">⚠️ Importante:</h4>
            <p style="margin: 0; color: #991B1B; font-size: 14px;">
              • Complete o pagamento PIX em até ${EMAIL_CONFIG.PAYMENT.EXPIRES_IN_MINUTES} minutos<br>
              • Apresente este email ou o código de retirada no dia do evento<br>
              • Em caso de dúvidas, entre em contato via WhatsApp
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${EMAIL_CONFIG.CONTACT.INSTAGRAM}" 
               style="${EMAIL_TEMPLATES.STYLES.BUTTON}">
              Seguir @cookite_oficial
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 25px; padding-top: 25px; border-top: 1px solid #E5E7EB;">
            <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_LIGHT}; font-size: 14px; margin: 0;">
              Cookite - Doces que adoçam o ${EMAIL_CONFIG.EVENT.NAME} 🍪<br>
              <small>Este email foi enviado automaticamente. Não responda.</small>
            </p>
          </div>
        </div>
      </div>
    `
  }

  // Gerar HTML do email de confirmação de pagamento
  private generatePaymentConfirmationEmailHTML(reservation: Reservation, payment: Payment): string {
    return `
      <div style="${EMAIL_TEMPLATES.STYLES.CONTAINER}">
        <div style="${EMAIL_TEMPLATES.STYLES.HEADER}">
          <h1 style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 0; font-size: 28px;">🍪 Pagamento Confirmado!</h1>
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 10px 0 0 0; font-size: 16px;">${EMAIL_CONFIG.EVENT.NAME}</p>
        </div>
        
        <div style="${EMAIL_TEMPLATES.STYLES.CONTENT}">
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; font-size: 18px; margin-bottom: 25px;">
            Olá <strong>${reservation.name}</strong>,
          </p>
          
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY}; line-height: 1.6;">
            Seu pagamento foi <strong style="color: ${EMAIL_TEMPLATES.COLORS.SUCCESS};">confirmado com sucesso</strong>! 
            Sua reserva está garantida para o evento ${EMAIL_CONFIG.EVENT.NAME}.
          </p>
          
          <div style="background: #F0FDF4; border: 2px solid ${EMAIL_TEMPLATES.COLORS.SUCCESS}; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 20px;">🎉 Reserva Confirmada!</h3>
            <p style="color: #166534; font-size: 16px; margin: 0;">
              Seus doces estão garantidos para o evento!
            </p>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 0 0 15px 0;">📋 Detalhes da Reserva:</h3>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>ID da Transação:</strong> ${payment.transactionId}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>Produtos:</strong> ${reservation.products.map(p => `${p.name} (${p.quantity}x)`).join(', ')}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; font-weight: bold;"><strong>Total Pago:</strong> ${formatCurrency(payment.amount)}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>Data de Retirada:</strong> ${EMAIL_CONFIG.EVENT.DATE} (${EMAIL_CONFIG.EVENT.NAME})</p>
          </div>
          
          <div style="background: #EFF6FF; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.INFO}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #1E40AF; margin: 0 0 10px 0;">📍 Local de Retirada:</h4>
            <p style="margin: 0; color: #1E40AF; font-weight: 500;">
              <strong>${EMAIL_CONFIG.EVENT.ORGANIZATION}</strong><br>
              <strong>${EMAIL_CONFIG.EVENT.LOCATION}</strong>
            </p>
          </div>
          
          <div style="background: #F0FDF4; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.SUCCESS}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #166534; margin: 0 0 10px 0;">⏰ Horário de Retirada:</h4>
            <p style="margin: 0; color: #166534; font-weight: 500;">
              <strong>${EMAIL_CONFIG.EVENT.DATE}</strong> das <strong>${EMAIL_CONFIG.EVENT.TIME}</strong>
            </p>
          </div>
          
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY}; line-height: 1.6;">
            Guarde este email como comprovante. No dia do evento, apresente este email 
            ou informe seu nome para retirar seus produtos.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${EMAIL_CONFIG.CONTACT.INSTAGRAM}" 
               style="${EMAIL_TEMPLATES.STYLES.BUTTON}">
              Seguir @cookite_oficial
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 25px; padding-top: 25px; border-top: 1px solid #E5E7EB;">
            <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_LIGHT}; font-size: 14px; margin: 0;">
              Cookite - Doces que adoçam o ${EMAIL_CONFIG.EVENT.NAME} 🍪<br>
              <small>Este email foi enviado automaticamente. Não responda.</small>
            </p>
          </div>
        </div>
      </div>
    `
  }

  // Gerar HTML do email de lembrete
  private generateReminderEmailHTML(reservation: Reservation): string {
    return `
      <div style="${EMAIL_TEMPLATES.STYLES.CONTAINER}">
        <div style="${EMAIL_TEMPLATES.STYLES.HEADER}">
          <h1 style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 0; font-size: 28px;">⏰ Lembrete: Retire seus doces hoje!</h1>
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 10px 0 0 0; font-size: 16px;">${EMAIL_CONFIG.EVENT.NAME}</p>
        </div>
        
        <div style="${EMAIL_TEMPLATES.STYLES.CONTENT}">
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; font-size: 18px; margin-bottom: 25px;">
            Olá <strong>${reservation.name}</strong>,
          </p>
          
          <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY}; line-height: 1.6;">
            Hoje é o grande dia! 🎉 Não se esqueça de retirar seus deliciosos doces da <strong style="color: ${EMAIL_TEMPLATES.COLORS.PRIMARY};">Cookite</strong> no evento ${EMAIL_CONFIG.EVENT.NAME}.
          </p>
          
          <div style="background: #FEF3C7; border: 2px solid ${EMAIL_TEMPLATES.COLORS.WARNING}; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h3 style="color: #92400E; margin: 0 0 15px 0; font-size: 20px;">🎯 Hoje é o dia!</h3>
            <p style="color: #92400E; font-size: 16px; margin: 0;">
              Não perca a oportunidade de saborear seus doces favoritos!
            </p>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; margin: 0 0 15px 0;">📋 Sua Reserva:</h3>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>ID da Reserva:</strong> ${reservation.id}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_SECONDARY};"><strong>Produtos:</strong> ${reservation.products.map(p => `${p.name} (${p.quantity}x)`).join(', ')}</p>
            <p style="margin: 5px 0; color: ${EMAIL_TEMPLATES.COLORS.TEXT_PRIMARY}; font-weight: bold;"><strong>Total Pago:</strong> ${formatCurrency(reservation.totalAmount)}</p>
          </div>
          
          <div style="background: #EFF6FF; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.INFO}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #1E40AF; margin: 0 0 10px 0;">📍 Local de Retirada:</h4>
            <p style="margin: 0; color: #1E40AF; font-weight: 500;">
              <strong>${EMAIL_CONFIG.EVENT.ORGANIZATION}</strong><br>
              <strong>${EMAIL_CONFIG.EVENT.LOCATION}</strong>
            </p>
          </div>
          
          <div style="background: #F0FDF4; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.SUCCESS}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #166534; margin: 0 0 10px 0;">⏰ Horário de Retirada:</h4>
            <p style="margin: 0; color: #166534; font-weight: 500;">
              <strong>${EMAIL_CONFIG.EVENT.DATE}</strong> das <strong>${EMAIL_CONFIG.EVENT.TIME}</strong>
            </p>
          </div>
          
          <div style="background: #FEF2F2; border-left: 4px solid ${EMAIL_TEMPLATES.COLORS.ERROR}; padding: 15px; margin: 25px 0;">
            <h4 style="color: #991B1B; margin: 0 0 10px 0;">⚠️ Não se esqueça:</h4>
            <p style="margin: 0; color: #991B1B; font-size: 14px;">
              • Apresente este email ou informe seu nome no stand<br>
              • Chegue com antecedência para evitar filas<br>
              • Em caso de dúvidas, entre em contato via WhatsApp
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${EMAIL_CONFIG.CONTACT.WHATSAPP}" 
               style="background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 500; display: inline-block;">
              📱 Contato WhatsApp
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 25px; padding-top: 25px; border-top: 1px solid #E5E7EB;">
            <p style="color: ${EMAIL_TEMPLATES.COLORS.TEXT_LIGHT}; font-size: 14px; margin: 0;">
              Cookite - Doces que adoçam o ${EMAIL_CONFIG.EVENT.NAME} 🍪<br>
              <small>Este email foi enviado automaticamente. Não responda.</small>
            </p>
          </div>
        </div>
      </div>
    `
  }
}

// Instância global do serviço de email
export const emailService = new EmailService(import.meta.env.VITE_RESEND_API_KEY)
