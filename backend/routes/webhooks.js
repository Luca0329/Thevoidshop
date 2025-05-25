const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Store products in JSON file
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Stripe webhook endpoint
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const event = req.body;
  
  try {
    switch (event.type) {
      case 'product.created':
      case 'product.updated':
        await updateProductFile(event.data.object);
        console.log('🛍️ Product updated via webhook');
        break;
      case 'product.deleted':
        await removeProductFromFile(event.data.object.id);
        console.log('🛍️ Product deleted via webhook');
        break;
    }
    
    res.json({received: true});
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

async function updateProductFile(stripeProduct) {
  try {
    // Read existing products
    let products = [];
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
      products = JSON.parse(data);
    } catch (err) {
      // File doesn't exist yet
    }
    
    // Convert Stripe product to our format
    const product = {
      id: stripeProduct.id,
      title: stripeProduct.name,
      handle: stripeProduct.metadata.handle || stripeProduct.name.toLowerCase().replace(/\s+/g, '-'),
      description: stripeProduct.description || '',
      price: stripeProduct.default_price?.unit_amount / 100 || 0,
      image: stripeProduct.images[0] || '/images/placeholder.jpg',
      available: stripeProduct.active,
      category: stripeProduct.metadata.category || 'accessories',
      stripeBuyButtonId: stripeProduct.metadata.buy_button_id || '',
      tags: stripeProduct.metadata.tags ? stripeProduct.metadata.tags.split(',') : []
    };
    
    // Update or add product
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    
    // Write back to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    
    // Also update frontend products.ts file automatically
    await updateFrontendProducts(products);
  } catch (error) {
    console.error('Error updating product file:', error);
  }
}

async function updateFrontendProducts(products) {
  const frontendFile = path.join(__dirname, '../../frontend/src/data/products.ts');
  
  const content = `// Auto-generated from Stripe webhooks
export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category: 'apparel' | 'music' | 'accessories';
  stripeBuyButtonId: string;
  tags: string[];
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

  await fs.writeFile(frontendFile, content);
}

module.exports = router;
