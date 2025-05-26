const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-checkout', async (req, res) => {
  try {
    console.log('💳 Checkout request received');
    console.log('💳 Request body:', JSON.stringify(req.body, null, 2));
    console.log('💳 Stripe key present:', !!process.env.STRIPE_SECRET_KEY);

    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    console.log('💳 Creating Stripe session with items:', items.length);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `https://thevoidshop.netlify.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://thevoidshop.netlify.app/`,
      shipping_address_collection: {
        allowed_countries: ['DK', 'NO', 'SE', 'DE', 'NL', 'BE'],
      },
      metadata: {
        cart_items: JSON.stringify(items),
      },
    });

    console.log('✅ Stripe session created:', session.id);
    console.log('🔗 Checkout URL:', session.url);
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('💥 Checkout creation error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack 
    });
  }
});

module.exports = router;
