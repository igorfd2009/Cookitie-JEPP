// Arquivo de teste para demonstrar o sistema de emails
// Este arquivo pode ser executado para testar os templates de email

import { emailService, type Reservation } from './emailService'
import { EMAIL_CONFIG } from './emailConfig'

// Dados de teste para reserva
const testReservation: Reservation = {
  id: 'TEST-123456',
  name: 'João Silva',
  email: 'joao.silva@exemplo.com',
  phone: '(11) 99999-9999',
  products: [
    {
      id: 'palha-italiana',
      name: 'Palha Italiana',
      quantity: 2,
      price: 6.00
    },
    {
      id: 'cookie',
      name: 'Cookie',
      quantity: 3,
      price: 7.00
    },
    {
      id: 'cake-pop',
      name: 'Cake Pop',
      quantity: 1,
      price: 4.50
    }
  ],
  totalAmount: 33.00, // Com desconto de 20%
  discountApplied: true,
  notes: 'Doces para o evento da escola',
  createdAt: new Date().toISOString()
}

// Dados de teste para pagamento
const testPayment = {
  transactionId: 'PIX_TEST_123456',
  amount: 33.00,
  status: 'paid' as const
}

// Função para testar envio de emails
export async function testEmailSystem() {
  console.log('🧪 Testando sistema de emails...')
  
  // Verificar se o serviço está configurado
  if (!emailService.isConfigured()) {
    console.log('⚠️ EmailService não configurado')
    console.log('💡 Configure VITE_RESEND_API_KEY para testar')
    return
  }
  
  try {
    // Testar email de agradecimento
    console.log('📧 Testando email de agradecimento...')
    const thankYouResult = await emailService.sendThankYouEmail(testReservation)
    console.log(thankYouResult ? '✅ Email de agradecimento enviado' : '❌ Falha no email de agradecimento')
    
    // Aguardar um pouco antes do próximo teste
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Testar email de confirmação de pagamento
    console.log('📧 Testando email de confirmação...')
    const confirmationResult = await emailService.sendPaymentConfirmationEmail(testReservation, testPayment)
    console.log(confirmationResult ? '✅ Email de confirmação enviado' : '❌ Falha no email de confirmação')
    
    // Aguardar um pouco antes do próximo teste
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Testar email de lembrete
    console.log('📧 Testando email de lembrete...')
    const reminderResult = await emailService.sendReminderEmail(testReservation)
    console.log(reminderResult ? '✅ Email de lembrete enviado' : '❌ Falha no email de lembrete')
    
    console.log('🎉 Teste do sistema de emails concluído!')
    
  } catch (error) {
    console.error('❌ Erro durante teste:', error)
  }
}

// Função para visualizar templates HTML (sem enviar)
export function previewEmailTemplates() {
  console.log('👀 Visualizando templates de email...')
  
  // Gerar HTML dos templates
  const thankYouHTML = emailService['generateThankYouEmailHTML'](
    testReservation, 
    'TEST-123', 
    41.25, // Subtotal sem desconto
    8.25   // Valor do desconto
  )
  
  const confirmationHTML = emailService['generatePaymentConfirmationEmailHTML'](
    testReservation, 
    testPayment
  )
  
  const reminderHTML = emailService['generateReminderEmailHTML'](testReservation)
  
  // Salvar em arquivos para visualização (se estiver no browser)
  if (typeof window !== 'undefined') {
    const downloadHTML = (html: string, filename: string) => {
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
    
    downloadHTML(thankYouHTML, 'email-agradecimento.html')
    downloadHTML(confirmationHTML, 'email-confirmacao.html')
    downloadHTML(reminderHTML, 'email-lembrete.html')
    
    console.log('📁 Templates salvos como arquivos HTML')
  } else {
    console.log('📄 Templates gerados (execute no browser para download)')
  }
}

// Função para testar configurações
export function testEmailConfig() {
  console.log('⚙️ Configurações do sistema de emails:')
  console.log('Evento:', EMAIL_CONFIG.EVENT.NAME)
  console.log('Data:', EMAIL_CONFIG.EVENT.DATE)
  console.log('Horário:', EMAIL_CONFIG.EVENT.TIME)
  console.log('Local:', EMAIL_CONFIG.EVENT.LOCATION)
  console.log('Organização:', EMAIL_CONFIG.EVENT.ORGANIZATION)
  console.log('Desconto:', EMAIL_CONFIG.DISCOUNT.PERCENTAGE + '%')
  console.log('Método de pagamento:', EMAIL_CONFIG.PAYMENT.METHOD)
  console.log('Expira em:', EMAIL_CONFIG.PAYMENT.EXPIRES_IN_MINUTES + ' minutos')
}

// Função para simular fluxo completo
export async function simulateCompleteFlow() {
  console.log('🔄 Simulando fluxo completo de reserva...')
  
  // 1. Criar reserva
  console.log('1️⃣ Criando reserva...')
  console.log('   Cliente:', testReservation.name)
  console.log('   Email:', testReservation.email)
  console.log('   Produtos:', testReservation.products.length)
  console.log('   Total:', `R$ ${testReservation.totalAmount.toFixed(2)}`)
  
  // 2. Enviar email de agradecimento
  console.log('2️⃣ Enviando email de agradecimento...')
  if (emailService.isConfigured()) {
    const thankYouResult = await emailService.sendThankYouEmail(testReservation)
    console.log('   Resultado:', thankYouResult ? '✅ Enviado' : '❌ Falhou')
  } else {
    console.log('   ⚠️ Serviço não configurado')
  }
  
  // 3. Simular pagamento confirmado
  console.log('3️⃣ Simulando confirmação de pagamento...')
  console.log('   ID da transação:', testPayment.transactionId)
  console.log('   Status:', testPayment.status)
  
  // 4. Enviar email de confirmação
  console.log('4️⃣ Enviando email de confirmação...')
  if (emailService.isConfigured()) {
    const confirmationResult = await emailService.sendPaymentConfirmationEmail(testReservation, testPayment)
    console.log('   Resultado:', confirmationResult ? '✅ Enviado' : '❌ Falhou')
  } else {
    console.log('   ⚠️ Serviço não configurado')
  }
  
  // 5. Resumo final
  console.log('5️⃣ Resumo do fluxo:')
  console.log('   ✅ Reserva criada com sucesso')
  console.log('   ✅ Pagamento confirmado')
  console.log('   ✅ Emails enviados (se configurado)')
  console.log('   🎯 Cliente pronto para retirar no evento!')
  
  console.log('🎉 Simulação concluída!')
}

// Exportar funções para uso externo
export default {
  testEmailSystem,
  previewEmailTemplates,
  testEmailConfig,
  simulateCompleteFlow,
  testReservation,
  testPayment
}

