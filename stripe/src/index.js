require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// Endpoint para criar pagamento Pix
app.post('/create-pix-payment', async (req, res) => {
  try {
    const { amount, customer } = req.body;
    if (!amount || !customer || !customer.name || !customer.email) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // valor em centavos
      currency: 'brl',
      payment_method_types: ['pix'],
      receipt_email: customer.email,
      description: `Reserva Cookite - ${customer.name}`,
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email
      }
    });

    // O QR Code Pix fica em paymentIntent.next_action.pix_display_qr_code
    res.json({
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      pix_qr_code_url: paymentIntent.next_action?.pix_display_qr_code?.url || null,
      pix_emv: paymentIntent.next_action?.pix_display_qr_code?.emv || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pagamento Pix.' });
  }
});

// Webhook para eventos do Stripe
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lógica para eventos de pagamento
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Atualize o status da reserva no seu banco de dados aqui
    console.log('Pagamento Pix confirmado:', paymentIntent.id);
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Stripe Pix backend rodando na porta ${PORT}`);
});
