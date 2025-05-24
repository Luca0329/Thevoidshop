const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createShopifyOrder } = require('../services/shopify');
const router = express.Router();

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // Parse cart items from session metadata
      const items = JSON.parse(session.metadata.items);
      
      // Create order in Shopify
      await createShopifyOrder({
        session,
        items,
        customerEmail: session.customer_details.email,
        amount: session.amount_total / 100 // Convert from cents
      });

      console.log('Order created successfully in Shopify');
    } catch (error) {
      console.error('Failed to create Shopify order:', error);
      // Note: Payment succeeded but order creation failed
      // You should handle this case (e.g., retry, manual processing)
    }
  }

  res.json({ received: true });
});

module.exports = router;
