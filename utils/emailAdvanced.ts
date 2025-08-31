// Sistema de Email Avançado para PIX
// Integração com Resend e templates HTML profissionais

interface EmailConfig {
  apiKey: string
  fromEmail: string
  fromName: string
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailData {
  customer: {
    name: string
    email: string
    phone: string
  }
  transaction: {
    id: string
    amount: number
    status: string
    orderId: string
    pixCode?: string
    qrCodeBase64?: string
  }
  products?: Array<{
    name: string
    quantity: number
    price: number
  }>
  pickupCode?: string
  eventInfo?: {
    name: string
    date: string
    location: string
  }
}

class EmailAdvancedSystem {
  private config: EmailConfig
  private resendApiUrl = 'https://api.resend.com/emails'

  constructor(config: EmailConfig) {
    this.config = config
  }

  // Template de confirmação de reserva
  private getReservationTemplate(data: EmailData): EmailTemplate {
    const { customer, transaction, products, pickupCode, eventInfo } = data
    
    const productsHtml = products?.map(p => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${p.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${p.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">R$ ${p.price.toFixed(2)}</td>
      </tr>
    `).join('') || ''

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reserva Confirmada - Cookite JEPP</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🍪 Cookite JEPP</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sua reserva foi confirmada!</p>
      </div>

      <!-- Main Content -->
      <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
        
        <!-- Greeting -->
        <h2 style="color: #1f2937; margin-bottom: 20px;">Olá ${customer.name}! 👋</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Recebemos sua reserva com sucesso! Seus doces deliciosos da Cookite estarão prontos para retirada no evento.
        </p>

        <!-- Transaction Info -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0; margin-bottom: 15px;">📋 Detalhes da Reserva</h3>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>ID da Reserva:</span>
            <strong style="font-family: monospace;">${transaction.orderId}</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Valor Total:</span>
            <strong style="color: #059669; font-size: 18px;">R$ ${transaction.amount.toFixed(2)}</strong>
          </div>
          
          ${pickupCode ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Código de Retirada:</span>
            <strong style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 16px;">${pickupCode}</strong>
          </div>
          ` : ''}
        </div>

        <!-- Products -->
        ${products && products.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; margin-bottom: 15px;">🛒 Seus Produtos</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Produto</th>
                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">Qtd</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Preço</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
        </div>
        ` : ''}

        <!-- Event Info -->
        ${eventInfo ? `
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">📅 Informações do Evento</h3>
          <p style="margin: 5px 0;"><strong>Evento:</strong> ${eventInfo.name}</p>
          <p style="margin: 5px 0;"><strong>Data:</strong> ${eventInfo.date}</p>
          <p style="margin: 5px 0;"><strong>Local:</strong> ${eventInfo.location}</p>
        </div>
        ` : ''}

        <!-- Status do Pagamento -->
        <div style="background: ${transaction.status === 'paid' ? '#f0fdf4' : '#fef3c7'}; border: 1px solid ${transaction.status === 'paid' ? '#bbf7d0' : '#fde68a'}; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: ${transaction.status === 'paid' ? '#166534' : '#92400e'}; margin-top: 0; margin-bottom: 10px;">
            ${transaction.status === 'paid' ? '✅ Pagamento Confirmado' : '⏳ Aguardando Pagamento'}
          </h3>
          <p style="margin: 0; color: ${transaction.status === 'paid' ? '#166534' : '#92400e'};">
            ${transaction.status === 'paid' 
              ? 'Seu pagamento foi confirmado! Sua reserva está garantida.'
              : 'Estamos aguardando a confirmação do seu pagamento PIX.'
            }
          </p>
        </div>

        <!-- Instructions -->
        <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">📝 Instruções Importantes</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px;">Guarde este email como comprovante</li>
            ${pickupCode ? `<li style="margin-bottom: 8px;">Apresente o <strong>código de retirada</strong> no dia do evento</li>` : ''}
            <li style="margin-bottom: 8px;">Chegue no horário indicado para garantir a qualidade dos produtos</li>
            <li style="margin-bottom: 8px;">Em caso de dúvidas, entre em contato conosco</li>
          </ul>
        </div>

        <!-- Contact -->
        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Dúvidas ou problemas?</p>
          <p style="margin: 0; color: #3b82f6;">
            <a href="mailto:contato@cookite.com" style="color: #3b82f6; text-decoration: none;">contato@cookite.com</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #1f2937; color: #9ca3af; text-align: center; padding: 30px; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 10px 0; font-size: 14px;">
          © 2025 Cookite JEPP - Feito com 💙 para o seu evento
        </p>
        <p style="margin: 0; font-size: 12px; opacity: 0.7;">
          Este é um email automático, não responda esta mensagem.
        </p>
      </div>

    </body>
    </html>
    `

    const text = `
    Olá ${customer.name}!

    Sua reserva foi confirmada com sucesso!

    Detalhes da Reserva:
    - ID: ${transaction.orderId}
    - Valor: R$ ${transaction.amount.toFixed(2)}
    ${pickupCode ? `- Código de Retirada: ${pickupCode}` : ''}

    ${eventInfo ? `
    Informações do Evento:
    - ${eventInfo.name}
    - ${eventInfo.date}
    - ${eventInfo.location}
    ` : ''}

    Status do Pagamento: ${transaction.status === 'paid' ? 'Confirmado' : 'Aguardando'}

    Instruções:
    - Guarde este email como comprovante
    ${pickupCode ? '- Apresente o código de retirada no dia do evento' : ''}
    - Chegue no horário indicado

    Dúvidas? Entre em contato: contato@cookite.com

    Cookite JEPP 2025
    `

    return {
      subject: `🍪 Reserva Confirmada - Cookite JEPP ${transaction.orderId}`,
      html,
      text
    }
  }

  // Template de pagamento confirmado
  private getPaymentConfirmedTemplate(data: EmailData): EmailTemplate {
    const { customer, transaction, pickupCode } = data

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pagamento Confirmado - Cookite JEPP</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header Success -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Pagamento Confirmado!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sua reserva está garantida</p>
      </div>

      <!-- Main Content -->
      <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
        
        <h2 style="color: #1f2937; margin-bottom: 20px;">Oba, ${customer.name}! ✅</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Seu pagamento PIX foi confirmado com sucesso! Agora é só aguardar o dia do evento para retirar seus deliciosos doces da Cookite.
        </p>

        <!-- Success Info -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin-bottom: 25px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 15px;">✅</div>
          <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 20px;">Pagamento Confirmado</h3>
          <p style="color: #166534; margin: 0; font-size: 18px; font-weight: bold;">
            R$ ${transaction.amount.toFixed(2)}
          </p>
          <p style="color: #059669; margin: 10px 0 0 0; font-size: 14px;">
            Transação: ${transaction.id}
          </p>
        </div>

        ${pickupCode ? `
        <!-- Pickup Code -->
        <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 25px; margin-bottom: 25px; text-align: center;">
          <h3 style="color: #92400e; margin: 0 0 15px 0;">🎫 Código de Retirada</h3>
          <div style="background: white; border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; margin: 15px 0;">
            <div style="font-family: monospace; font-size: 32px; font-weight: bold; color: #92400e; letter-spacing: 4px;">
              ${pickupCode}
            </div>
          </div>
          <p style="color: #92400e; margin: 15px 0 0 0; font-size: 14px;">
            <strong>Importante:</strong> Apresente este código no dia do evento
          </p>
        </div>
        ` : ''}

        <!-- Next Steps -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">📋 Próximos Passos</h3>
          <ol style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 10px;">Salve este email como comprovante</li>
            ${pickupCode ? `<li style="margin-bottom: 10px;">Anote ou tire uma foto do seu <strong>código de retirada</strong></li>` : ''}
            <li style="margin-bottom: 10px;">Compareça no horário indicado do evento</li>
            <li style="margin-bottom: 10px;">Apresente o código e retire seus doces</li>
            <li style="margin-bottom: 10px;">Aproveite os deliciosos produtos da Cookite! 🍪</li>
          </ol>
        </div>

        <!-- Contact -->
        <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280;">Alguma dúvida sobre seu pedido?</p>
          <p style="margin: 0; color: #3b82f6;">
            <a href="mailto:contato@cookite.com" style="color: #3b82f6; text-decoration: none;">contato@cookite.com</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #1f2937; color: #9ca3af; text-align: center; padding: 30px; border-radius: 0 0 12px 12px;">
        <p style="margin: 0 0 10px 0; font-size: 14px;">
          🍪 Obrigado por escolher a Cookite JEPP!
        </p>
        <p style="margin: 0; font-size: 12px; opacity: 0.7;">
          © 2025 Cookite JEPP - Feito com 💙
        </p>
      </div>

    </body>
    </html>
    `

    const text = `
    🎉 PAGAMENTO CONFIRMADO!

    Olá ${customer.name}!

    Seu pagamento PIX foi confirmado com sucesso!

    Valor: R$ ${transaction.amount.toFixed(2)}
    Transação: ${transaction.id}

    ${pickupCode ? `
    🎫 CÓDIGO DE RETIRADA: ${pickupCode}
    IMPORTANTE: Apresente este código no dia do evento!
    ` : ''}

    Próximos Passos:
    1. Salve este email como comprovante
    ${pickupCode ? '2. Anote seu código de retirada' : ''}
    3. Compareça no horário do evento
    4. Retire seus doces e aproveite!

    Dúvidas? contato@cookite.com

    Obrigado por escolher a Cookite JEPP! 🍪
    `

    return {
      subject: `✅ Pagamento Confirmado - Cookite JEPP ${transaction.orderId}`,
      html,
      text
    }
  }

  // Enviar email
  async sendEmail(to: string, template: EmailTemplate): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.apiKey || this.config.apiKey.startsWith('re_123456789')) {
      console.warn('🔶 Resend não configurado - simulando envio de email')
      console.log('📧 Email que seria enviado:')
      console.log('Para:', to)
      console.log('Assunto:', template.subject)
      console.log('Conteúdo:', template.text.substring(0, 200) + '...')
      
      return {
        success: true,
        messageId: `mock_${Date.now()}`
      }
    }

    try {
      const response = await fetch(this.resendApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${this.config.fromName} <${this.config.fromEmail}>`,
          to: [to],
          subject: template.subject,
          html: template.html,
          text: template.text
        })
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          messageId: data.id
        }
      } else {
        const error = await response.text()
        return {
          success: false,
          error: `Erro HTTP ${response.status}: ${error}`
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Erro de rede: ${error}`
      }
    }
  }

  // Enviar email de confirmação de reserva
  async sendReservationConfirmation(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = this.getReservationTemplate(data)
    return this.sendEmail(data.customer.email, template)
  }

  // Enviar email de pagamento confirmado
  async sendPaymentConfirmation(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = this.getPaymentConfirmedTemplate(data)
    return this.sendEmail(data.customer.email, template)
  }
}

// Configuração do sistema de email
const emailConfig: EmailConfig = {
  apiKey: import.meta.env.VITE_RESEND_API_KEY || 're_123456789...sua_chave_api_resend_aqui',
  fromEmail: 'noreply@cookite.com',
  fromName: 'Cookite JEPP'
}

// Instância global do sistema de email
export const emailSystem = new EmailAdvancedSystem(emailConfig)

// Tipos exportados
export type { EmailData, EmailTemplate }
