const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-checkout', async (req, res) => {
  try {
    console.log('💳 Creating Stripe checkout session...');
    console.log('Items:', req.body.items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });

    console.log('💳 Checkout session created:', session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('💳 Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
