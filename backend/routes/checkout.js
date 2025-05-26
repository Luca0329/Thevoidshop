const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-checkout', async (req, res) => {
  try {
    console.log('💳 Creating Stripe checkout session...');
    console.log('Line items:', req.body.items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items,
      mode: 'payment',
      success_url: `https://thevoidshop.netlify.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://thevoidshop.netlify.app/`,
      shipping_address_collection: {
        allowed_countries: ['DK', 'NO', 'SE', 'DE', 'NL', 'BE'],
      },
      metadata: {
        cart_items: JSON.stringify(req.body.items),
      },
    });

    console.log('💳 Checkout session created:', session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('💳 Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
