# 🍪 Sistema de Email - Cookite JEPP 2025

## 📋 Visão Geral

Sistema completo de confirmação e agradecimento por email para o evento JEPP 2025, desenvolvido com React, TypeScript e integração com Resend para envio de emails transacionais.

## ✨ Funcionalidades Principais

### 1. 📧 Emails Automáticos
- **Email de Agradecimento**: Enviado após criação da reserva
- **Confirmação de Pagamento**: Enviado após confirmação do PIX
- **Email de Lembrete**: Enviado no dia do evento

### 2. 🎯 Códigos de Retirada
- Geração automática de códigos únicos
- Formato: `NOME-TIMESTAMP-RANDOM`
- Incluído em todos os emails de agradecimento

### 3. 📊 Dashboard Administrativo
- Visualização de todas as reservas
- Status de envio de emails
- Ações em massa (seleção múltipla)
- Estatísticas em tempo real

### 4. 🔧 Sistema de Testes
- Painel de teste integrado
- Dados simulados para desenvolvimento
- Validação de templates e funcionalidades

## 🏗️ Arquitetura do Sistema

```
📁 Sistema de Email
├── 📁 hooks/
│   └── useEmailConfirmation.ts     # Hook principal para gerenciar emails
├── 📁 components/
│   ├── EmailConfirmation.tsx       # Componente de confirmação individual
│   ├── EmailDashboard.tsx          # Dashboard administrativo
│   └── EmailTestPanel.tsx          # Painel de testes
├── 📁 utils/
│   ├── emailService.ts             # Serviço principal de email
│   └── emailConfig.ts              # Configurações e templates
└── 📁 docs/
    ├── ENV_SETUP.md                # Configuração de ambiente
    └── EMAIL_SYSTEM_README.md      # Esta documentação
```

## 🚀 Como Usar

### 1. Configuração Inicial

```bash
# 1. Criar arquivo .env.local
VITE_RESEND_API_KEY=sua_chave_api_aqui

# 2. Instalar dependências
npm install

# 3. Executar em desenvolvimento
npm run dev
```

### 2. Uso Básico

```tsx
import { useEmailConfirmation } from '../hooks/useEmailConfirmation'

function MyComponent() {
  const { sendThankYouEmail, isSending } = useEmailConfirmation()
  
  const handleSendEmail = async () => {
    const success = await sendThankYouEmail(reservation)
    if (success) {
      console.log('Email enviado!')
    }
  }
  
  return (
    <Button onClick={handleSendEmail} disabled={isSending}>
      Enviar Email
    </Button>
  )
}
```

### 3. Dashboard Administrativo

```tsx
import { EmailDashboard } from '../components/EmailDashboard'

function AdminPage() {
  const reservations = [...] // Suas reservas
  
  return (
    <EmailDashboard 
      reservations={reservations}
      onRefresh={() => {
        // Função para atualizar lista
      }}
    />
  )
}
```

## 📧 Templates de Email

### Email de Agradecimento
- ✅ Cabeçalho personalizado com cores do tema
- 🎯 Código de retirada destacado
- 📋 Detalhes completos da reserva
- 💰 Informações de pagamento e desconto
- 📍 Local e horário do evento
- ⚠️ Instruções importantes
- 🔗 Links para redes sociais

### Confirmação de Pagamento
- ✅ Confirmação de pagamento recebido
- 🎉 Reserva garantida
- 📋 Resumo da compra
- 📅 Lembrete do evento
- 🔗 Links de contato

### Email de Lembrete
- ⏰ Lembrete do dia do evento
- 📍 Local e horário
- 📋 Detalhes da reserva
- 📱 Contato WhatsApp
- ⚠️ Instruções finais

## 🎨 Personalização

### Cores e Estilo
```typescript
// utils/emailConfig.ts
export const EMAIL_TEMPLATES = {
  COLORS: {
    PRIMARY: '#A8D0E6',        // Azul Cookite
    SECONDARY: '#FFE9A8',      // Amarelo Cookite
    SUCCESS: '#22C55E',        // Verde
    WARNING: '#F59E0B',        // Amarelo
    ERROR: '#EF4444',          // Vermelho
    // ... mais cores
  }
}
```

### Configurações do Evento
```typescript
export const EMAIL_CONFIG = {
  EVENT: {
    NAME: 'JEPP 2025',
    DATE: '12/09/2025',
    TIME: '09:00 às 16:00',
    LOCATION: 'Escola Estadual Exemplo - Ginásio / Stand B',
    // ... mais configurações
  }
}
```

## 🔌 Integração com APIs

### Resend (Email)
- API REST para envio de emails
- Suporte a HTML personalizado
- Rastreamento de entrega
- Templates responsivos

### Supabase (Opcional)
- Banco de dados para reservas
- Autenticação de usuários
- Funções serverless
- Storage para arquivos

## 📱 Responsividade

- ✅ Templates otimizados para mobile
- ✅ CSS inline para compatibilidade
- ✅ Testado em principais clientes de email
- ✅ Suporte a dark mode

## 🧪 Sistema de Testes

### Painel de Teste Integrado
- Dados simulados configuráveis
- Teste de todos os tipos de email
- Validação de templates
- Simulação de cenários reais

### Como Testar
1. Acesse o painel de teste
2. Configure dados de exemplo
3. Execute testes individuais ou em massa
4. Verifique resultados e logs

## 📊 Monitoramento e Logs

### Logs de Sistema
```typescript
// Console logs para desenvolvimento
console.log('✅ Email de agradecimento enviado para', email)
console.error('❌ Erro ao enviar email:', error)
```

### Status de Envio
- `pending`: Aguardando envio
- `sent`: Email enviado com sucesso
- `confirmed`: Pagamento confirmado
- `error`: Falha no envio

## 🚨 Solução de Problemas

### Email não envia
1. ✅ Verificar `VITE_RESEND_API_KEY`
2. ✅ Confirmar domínio verificado
3. ✅ Verificar logs no console
4. ✅ Testar com domínio de teste

### Erro de autenticação
1. ✅ Verificar chave da API
2. ✅ Confirmar conta ativa
3. ✅ Verificar limite de envios

### Problemas de template
1. ✅ Validar HTML
2. ✅ Testar em diferentes clientes
3. ✅ Verificar compatibilidade

## 🔒 Segurança

- ✅ Chaves de API em variáveis de ambiente
- ✅ Validação de dados de entrada
- ✅ Rate limiting entre envios
- ✅ Logs de auditoria
- ✅ Tratamento de erros seguro

## 📈 Performance

- ✅ Envio assíncrono
- ✅ Delay entre envios em massa
- ✅ Cache de status
- ✅ Otimização de templates
- ✅ Lazy loading de componentes

## 🚀 Deploy

### Produção
```bash
# Build otimizado
npm run build

# Preview
npm run preview

# Deploy para Vercel/Netlify
vercel --prod
```

### Variáveis de Ambiente
```bash
# .env.production
VITE_RESEND_API_KEY=chave_producao
VITE_SUPABASE_URL=url_producao
```

## 📚 Recursos Adicionais

- [Documentação do Resend](https://resend.com/docs)
- [Guia de Templates de Email](https://www.emailjs.com/)
- [Teste de Compatibilidade](https://www.emailonacid.com/)
- [Validador de HTML](https://validator.w3.org/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ para o evento JEPP 2025**

*Cookite - Doces que adoçam o evento! 🍪*
