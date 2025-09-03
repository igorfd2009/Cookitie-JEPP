# 🔑 Configuração do Stripe

## 📋 **Arquivo .env**

Crie um arquivo chamado `.env` na pasta `stripe/` com o seguinte conteúdo:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_sua_chave_webhook_aqui

# Server Configuration
PORT=4242
NODE_ENV=development
```

## 🔑 **Como Obter as Chaves:**

### **1. Stripe Secret Key:**
- Acesse: https://stripe.com
- Dashboard → Developers → API Keys
- Copie a **Secret key** (começa com `sk_test_` para teste)

### **2. Stripe Webhook Secret:**
- Dashboard → Developers → Webhooks
- Add endpoint → `http://localhost:4242/webhook`
- Copie o **Signing secret** (começa com `whsec_`)

## 🚀 **Para Testar:**

1. **Configure as chaves** no arquivo .env
2. **Instale dependências**: `npm install`
3. **Inicie o servidor**: `npm run dev`
4. **Teste o endpoint**: `http://localhost:4242/create-pix-payment`

## 📱 **Teste com Postman/Insomnia:**

```json
POST http://localhost:4242/create-pix-payment
Content-Type: application/json

{
  "amount": 25.00,
  "customer": {
    "name": "João Teste",
    "email": "joao@teste.com"
  }
}
```
