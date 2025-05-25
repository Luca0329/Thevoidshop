const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Fetch all products from Stripe
router.get('/stripe-products', async (req, res) => {
  try {
    console.log('🛍️ Fetching products from Stripe...');
    
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });
    
    console.log(`🛍️ Found ${products.data.length} products`);
    res.json(products.data);
  } catch (error) {
    console.error('🛍️ Error fetching Stripe products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create checkout session (existing)
router.post('/create-checkout', async (req, res) => {
  try {
    console.log('💳 Creating Stripe checkout session...');
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('💳 Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
