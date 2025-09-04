# 📧 Configuração do Sistema de Emails - Cookite JEPP 2025

## 🎯 Visão Geral

O sistema de emails da Cookite envia automaticamente:
1. **Email de Agradecimento** - Após criar a reserva (com código de retirada)
2. **Email de Confirmação** - Após confirmar o pagamento PIX
3. **Email de Lembrete** - No dia do evento (opcional)

## 🚀 Configuração Rápida

### 1. Criar conta no Resend
- Acesse [resend.com](https://resend.com)
- Crie uma conta gratuita
- Obtenha sua API Key

### 2. Configurar variáveis de ambiente
```bash
# .env.local
VITE_RESEND_API_KEY=re_1234567890abcdef...
```

### 3. Configurar domínio de envio
- No painel do Resend, adicione seu domínio
- Ou use o domínio padrão: `noreply@resend.dev`

## 📋 Configurações Detalhadas

### Resend API
```typescript
// utils/emailService.ts
export const emailService = new EmailService()

// Configurar API Key
configureEmailService('sua_api_key_aqui')
```

### Templates de Email
Os templates estão em `utils/emailService.ts` e incluem:
- Cores personalizadas da Cookite
- Layout responsivo
- Informações do evento JEPP 2025
- Código de retirada único
- Links para redes sociais

### Configurações do Evento
```typescript
// utils/emailConfig.ts
export const EMAIL_CONFIG = {
  EVENT: {
    NAME: 'JEPP 2025',
    DATE: '12/09/2025',
    TIME: '09:00 às 16:00',
    LOCATION: 'Escola Estadual Exemplo - Ginásio / Stand B',
    ORGANIZATION: 'Stand da Cookite no evento JEPP Sebrae'
  }
}
```

## 🔧 Personalização

### Alterar Cores
```typescript
// utils/emailConfig.ts
export const EMAIL_TEMPLATES = {
  COLORS: {
    PRIMARY: '#A8D0E6',      // Azul Cookite
    SECONDARY: '#FFE9A8',    // Amarelo Cookite
    SUCCESS: '#22C55E',      // Verde
    WARNING: '#F59E0B',      // Laranja
    ERROR: '#EF4444',        // Vermelho
    INFO: '#3B82F6'          // Azul info
  }
}
```

### Alterar Textos
```typescript
// utils/emailConfig.ts
export const EMAIL_CONFIG = {
  RESEND: {
    SUBJECTS: {
      THANK_YOU: '🍪 Obrigado pela sua reserva! - Cookite JEPP 2025',
      PAYMENT_CONFIRMED: '✅ Pagamento Confirmado - Cookite JEPP 2025',
      REMINDER: '⏰ Lembrete: Retire seus doces hoje! - Cookite JEPP 2025'
    }
  }
}
```

## 📱 Teste dos Emails

### 1. Teste Local
```bash
npm run dev
# Fazer uma reserva de teste
# Verificar console para logs de email
```

### 2. Teste de Produção
- Configurar API Key real
- Fazer reserva com email válido
- Verificar recebimento dos emails

## 🚨 Solução de Problemas

### Email não está sendo enviado
1. Verificar se `VITE_RESEND_API_KEY` está configurada
2. Verificar console para erros
3. Verificar se o domínio está configurado no Resend

### Erro de autenticação
- Verificar se a API Key está correta
- Verificar se a conta do Resend está ativa

### Email não chega na caixa de entrada
- Verificar pasta de spam
- Verificar se o domínio está verificado no Resend
- Verificar logs do Resend

## 📊 Monitoramento

### Logs de Email
```typescript
// Os emails são logados no console
console.log(`✅ Email de agradecimento enviado para ${email}`)
console.log(`✅ Email de confirmação enviado para ${email}`)
```

### Status de Envio
```typescript
// emailService retorna boolean indicando sucesso
const success = await emailService.sendThankYouEmail(reservation)
if (success) {
  console.log('Email enviado com sucesso')
} else {
  console.log('Falha ao enviar email')
}
```

## 🔒 Segurança

### API Key
- Nunca commitar API Key no Git
- Usar variáveis de ambiente
- Rotacionar chaves regularmente

### Validação de Email
- Emails são validados antes do envio
- Fallback gracioso se email falhar
- Não bloqueia o fluxo principal

## 📈 Próximos Passos

### Funcionalidades Futuras
- [ ] Email de lembrete automático no dia do evento
- [ ] Templates personalizáveis via admin
- [ ] Relatórios de entrega de email
- [ ] Integração com WhatsApp Business API

### Melhorias
- [ ] A/B testing de templates
- [ ] Segmentação de clientes
- [ ] Automação de follow-ups
- [ ] Analytics de engajamento

## 📞 Suporte

Para dúvidas sobre o sistema de emails:
- Verificar logs do console
- Consultar documentação do Resend
- Abrir issue no repositório

---

**Cookite JEPP 2025** 🍪✨
*Doces que adoçam o evento!*

