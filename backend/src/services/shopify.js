const fetch = require('node-fetch');

const SHOPIFY_ADMIN_URL = `https://${process.env.VITE_SHOPIFY_DOMAIN}/admin/api/2023-10`;

async function createShopifyOrder({ session, items, customerEmail, amount }) {
  const lineItems = items.map(item => ({
    variant_id: item.id.replace('gid://shopify/ProductVariant/', ''),
    quantity: item.quantity,
    price: item.price
  }));

  const orderData = {
    order: {
      email: customerEmail,
      line_items: lineItems,
      financial_status: 'paid',
      fulfillment_status: 'unfulfilled',
      note: `Stripe Payment ID: ${session.payment_intent}`,
      tags: 'stripe-checkout',
      total_price: amount,
      currency: 'USD',
      billing_address: session.customer_details.address,
      shipping_address: session.customer_details.address,
      customer: {
        email: customerEmail,
        first_name: session.customer_details.name?.split(' ')[0] || '',
        last_name: session.customer_details.name?.split(' ').slice(1).join(' ') || ''
      }
    }
  };

  const response = await fetch(`${SHOPIFY_ADMIN_URL}/orders.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shopify order creation failed: ${error}`);
  }

  return await response.json();
}

module.exports = { createShopifyOrder };
