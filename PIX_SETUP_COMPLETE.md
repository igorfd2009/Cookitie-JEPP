# 🚀 Configuração Completa do PIX - Cookite JEPP

## 📋 **Informações Necessárias para Configurar**

### **1. Dados da Chave PIX**
Você precisa das seguintes informações da sua conta bancária:

```typescript
// Em utils/pixConfig.ts - Substitua pelos seus dados reais
export const PIX_CONFIG = {
  pixKey: {
    type: 'email', // ou 'cpf', 'cnpj', 'phone', 'random'
    value: 'SEU_EMAIL@DOMINIO.COM' // SUA CHAVE PIX REAL
  },
  
  merchant: {
    name: 'SEU_NOME_EMPRESA', // Nome da sua empresa
    city: 'SUA_CIDADE', // Cidade da sua empresa
    category: 'FOOD_AND_BEVERAGE' // Categoria do negócio
  }
}
```

### **2. Chave da API Resend (Email)**
```typescript
// Em utils/pixConfig.ts
export const EMAIL_INTEGRATION = {
  resend: {
    apiKey: 'SUA_CHAVE_API_RESEND', // Chave da API Resend
    fromEmail: 'Cookite JEPP <noreply@seudominio.com>', // Email de envio
  }
}
```

### **3. Variáveis de Ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=https://deeichvgibhpbrowhaiq.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Resend (Email)
VITE_RESEND_API_KEY=sua_chave_api_resend_aqui

# PIX (Opcional - para configurações específicas)
VITE_PIX_KEY_TYPE=email
VITE_PIX_KEY_VALUE=seu_email@dominio.com
VITE_MERCHANT_NAME=COOKITE JEPP
VITE_MERCHANT_CITY=SAO PAULO
```

## 🔧 **Como Configurar Passo a Passo**

### **Passo 1: Configurar Chave PIX**

#### **Opção A: Chave PIX por Email**
```typescript
// Em utils/pixConfig.ts
pixKey: {
  type: 'email',
  value: 'cookite@jepp.com.br' // Seu email real
}
```

#### **Opção B: Chave PIX por CPF**
```typescript
pixKey: {
  type: 'cpf',
  value: '123.456.789-00' // Seu CPF (sem pontos e traços)
}
```

#### **Opção C: Chave PIX por CNPJ**
```typescript
pixKey: {
  type: 'cnpj',
  value: '12.345.678/0001-90' // Seu CNPJ (sem pontos e traços)
}
```

#### **Opção D: Chave PIX por Telefone**
```typescript
pixKey: {
  type: 'phone',
  value: '11999999999' // Seu telefone (apenas números)
}
```

### **Passo 2: Configurar Dados do Comerciante**

```typescript
// Em utils/pixConfig.ts
merchant: {
  name: 'COOKITE JEPP', // Nome da sua empresa
  city: 'SAO PAULO', // Cidade da sua empresa
  category: 'FOOD_AND_BEVERAGE' // Categoria do negócio
}
```

**Categorias disponíveis:**
- `FOOD_AND_BEVERAGE` - Alimentos e Bebidas
- `RETAIL` - Varejo
- `SERVICES` - Serviços
- `ENTERTAINMENT` - Entretenimento
- `EDUCATION` - Educação

### **Passo 3: Configurar API de Email (Resend)**

1. **Criar conta no Resend:**
   - Acesse: https://resend.com
   - Crie uma conta gratuita
   - Verifique seu domínio de email

2. **Obter API Key:**
   - No dashboard do Resend
   - Vá em "API Keys"
   - Clique em "Create API Key"
   - Copie a chave gerada

3. **Configurar no projeto:**
```typescript
// Em utils/pixConfig.ts
resend: {
  apiKey: 're_123456789...', // Sua chave API do Resend
  fromEmail: 'Cookite JEPP <noreply@seudominio.com>', // Email verificado
}
```

### **Passo 4: Configurar Supabase**

1. **Verificar URL e Chave:**
```typescript
// Em utils/supabase/info.tsx
export const projectId = 'deeichvgibhpbrowhaiq'
export const publicAnonKey = 'sua_chave_anonima_aqui'
```

2. **Configurar Edge Functions:**
   - As funções já estão configuradas
   - Apenas verifique se as variáveis de ambiente estão corretas

## 🧪 **Testando a Configuração**

### **1. Teste de Criação de PIX**
```typescript
// Teste básico
const pixService = PixService.getInstance()
const result = await pixService.createPayment({
  amount: 25.00,
  description: 'Teste PIX Cookite',
  reservationId: 'TEST_001',
  customerName: 'João Teste',
  customerEmail: 'joao@teste.com'
})

console.log('Resultado:', result)
```

### **2. Teste de Email**
```typescript
// Teste de envio de email
const emailService = new EmailService('sua_chave_resend')
const result = await emailService.sendThankYouEmail({
  id: 'TEST_001',
  name: 'João Teste',
  email: 'joao@teste.com',
  phone: '(11) 99999-9999',
  products: [
    { id: '1', name: 'Palha Italiana', quantity: 2, price: 6.00 }
  ],
  totalAmount: 12.00,
  discountApplied: true,
  createdAt: new Date().toISOString()
})

console.log('Email enviado:', result)
```

## 📱 **Como Funciona o Sistema PIX**

### **1. Fluxo de Pagamento**
1. **Usuário finaliza reserva** → Sistema cria reserva
2. **Sistema gera PIX** → QR Code e código PIX
3. **Usuário paga** → Via app do banco
4. **Sistema verifica** → Status do pagamento
5. **Pagamento confirmado** → Email de confirmação

### **2. Geração do QR Code**
- **Formato EMV** padrão PIX
- **Código válido** para todos os bancos
- **Expiração automática** em 30 minutos
- **Verificação contínua** do status

### **3. Notificações por Email**
- **Email de agradecimento** com código de retirada
- **Email de confirmação** após pagamento
- **Template responsivo** e profissional
- **Código de retirada** único para cada pedido

## 🚨 **Problemas Comuns e Soluções**

### **1. PIX não é gerado**
- ✅ Verificar se a chave PIX está correta
- ✅ Verificar se o tipo de chave está correto
- ✅ Verificar se as variáveis de ambiente estão configuradas

### **2. Email não é enviado**
- ✅ Verificar se a API key do Resend está correta
- ✅ Verificar se o domínio está verificado no Resend
- ✅ Verificar se o email de envio está correto

### **3. QR Code não funciona**
- ✅ Verificar se o formato EMV está correto
- ✅ Verificar se os dados do merchant estão corretos
- ✅ Testar com diferentes apps bancários

### **4. Pagamento não é confirmado**
- ✅ Verificar se a verificação automática está funcionando
- ✅ Verificar se o intervalo de verificação está adequado
- ✅ Verificar logs da Edge Function

## 🔐 **Segurança e Boas Práticas**

### **1. Proteção de Dados**
- ✅ **Nunca** commitar chaves API no Git
- ✅ Usar variáveis de ambiente
- ✅ Validar entrada de dados
- ✅ Logs sem informações sensíveis

### **2. Configuração de Produção**
- ✅ Usar domínios verificados para email
- ✅ Configurar webhooks para notificações
- ✅ Monitorar logs e erros
- ✅ Backup das configurações

### **3. Testes**
- ✅ Testar com valores pequenos primeiro
- ✅ Testar com diferentes bancos
- ✅ Testar fluxo completo
- ✅ Validar emails enviados

## 📞 **Suporte e Contato**

### **Para Dúvidas Técnicas:**
- **GitHub Issues**: Abrir issue no repositório
- **Documentação**: Verificar este arquivo
- **Logs**: Verificar console e Supabase

### **Para Configuração Bancária:**
- **Contatar seu banco** para ativar PIX
- **Verificar limites** de transação
- **Configurar webhooks** se necessário

## 🎉 **Status: ✅ PRONTO PARA CONFIGURAR**

O sistema PIX está **100% implementado** e pronto para funcionar. Siga os passos acima para configurar com suas informações reais e o sistema funcionará perfeitamente!

---

**Configurado com 💙 para o sucesso da Cookite JEPP 2025**
