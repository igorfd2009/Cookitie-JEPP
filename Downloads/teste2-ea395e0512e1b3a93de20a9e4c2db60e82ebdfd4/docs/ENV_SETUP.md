# Configuração de Variáveis de Ambiente

## 📧 Configuração do Sistema de Email

### 1. Criar arquivo `.env.local`

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Configuração do Resend (Email)
VITE_RESEND_API_KEY=sua_chave_api_aqui

# Configuração do Supabase (opcional)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# Configuração do PIX (opcional)
VITE_PIX_MERCHANT_ID=seu_merchant_id
VITE_PIX_MERCHANT_NAME=seu_nome_merchant
```

### 2. Obter chave da API do Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta ou faça login
3. Vá para a seção "API Keys"
4. Crie uma nova chave de API
5. Copie a chave e cole no arquivo `.env.local`

### 3. Configurar domínio de email

1. No painel do Resend, vá para "Domains"
2. Adicione seu domínio ou use o domínio de teste
3. Atualize `EMAIL_CONFIG.RESEND.FROM_EMAIL` em `utils/emailConfig.ts`

## 🚀 Como Usar

### Envio Individual de Email

```tsx
import { useEmailConfirmation } from '../hooks/useEmailConfirmation'

function MyComponent() {
  const { sendThankYouEmail, isSending } = useEmailConfirmation()
  
  const handleSendEmail = async () => {
    const success = await sendThankYouEmail(reservation)
    if (success) {
      console.log('Email enviado com sucesso!')
    }
  }
  
  return (
    <Button onClick={handleSendEmail} disabled={isSending}>
      {isSending ? 'Enviando...' : 'Enviar Email'}
    </Button>
  )
}
```

### Dashboard de Emails em Massa

```tsx
import { EmailDashboard } from '../components/EmailDashboard'

function AdminPage() {
  const reservations = [...] // Suas reservas
  
  return (
    <EmailDashboard 
      reservations={reservations}
      onRefresh={() => {
        // Função para atualizar lista de reservas
      }}
    />
  )
}
```

## 📋 Funcionalidades Disponíveis

### 1. Email de Agradecimento
- Enviado após criação da reserva
- Inclui código de retirada único
- Instruções de pagamento PIX
- Detalhes do evento

### 2. Confirmação de Pagamento
- Enviado após confirmação do PIX
- Confirma que a reserva está garantida
- Lembrete do evento

### 3. Email de Lembrete
- Enviado no dia do evento
- Lembra o cliente de retirar os doces
- Informações de local e horário

### 4. Dashboard Administrativo
- Visualização de todas as reservas
- Status de envio de emails
- Ações em massa
- Estatísticas de envio

## 🔧 Personalização

### Templates de Email

Os templates estão em `utils/emailService.ts` e podem ser personalizados:

- Cores e estilos
- Conteúdo das mensagens
- Logos e branding
- Informações do evento

### Configurações

Edite `utils/emailConfig.ts` para personalizar:

- Nome e data do evento
- Local e horário
- Informações de contato
- Configurações de desconto

## 🚨 Solução de Problemas

### Email não está sendo enviado

1. Verifique se `VITE_RESEND_API_KEY` está configurada
2. Confirme se o domínio está verificado no Resend
3. Verifique os logs no console do navegador
4. Teste com o domínio de teste do Resend

### Erro de autenticação

1. Verifique se a chave da API está correta
2. Confirme se a conta do Resend está ativa
3. Verifique se há limite de envios disponível

### Problemas de template

1. Verifique se o HTML está válido
2. Teste em diferentes clientes de email
3. Use ferramentas de validação de email
