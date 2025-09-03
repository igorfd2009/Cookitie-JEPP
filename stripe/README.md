# Backend Stripe Pix

Backend Node.js/Express para pagamentos Pix com Stripe.

## Endpoints

- `POST /create-pix-payment` — Cria um pagamento Pix via Stripe e retorna o QR Code.
- `POST /webhook` — Recebe notificações de pagamento do Stripe.

## Como usar

1. Copie `.env.example` para `.env` e preencha com suas chaves do Stripe.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Variáveis de ambiente

- `STRIPE_SECRET_KEY`: Chave secreta da sua conta Stripe.
- `STRIPE_WEBHOOK_SECRET`: Chave do webhook Stripe.
- `PORT`: Porta do servidor (padrão: 4242).
