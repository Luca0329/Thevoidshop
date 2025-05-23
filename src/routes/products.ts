import express from 'express';

const router = express.Router();

console.log('🛍️ Products router loaded');

// Products endpoint - this will be accessible at /api/products
router.get('/products', async (req, res) => {
  try {
    console.log('🛍️ Products endpoint called');
    
    // Check if we have Shopify credentials
    const hasShopifyConfig = process.env.SHOPIFY_ACCESS_TOKEN && 
                            process.env.SHOPIFY_SHOP_DOMAIN;

    console.log('Shopify config check:', {
      hasAccessToken: !!process.env.SHOPIFY_ACCESS_TOKEN,
      hasShopDomain: !!process.env.SHOPIFY_SHOP_DOMAIN
    });

    if (!hasShopifyConfig) {
      console.log('📦 No Shopify config - returning static products');
      return res.json({
        success: true,
        products: [],
        message: 'Using static product catalog - Shopify not fully configured',
        moonPhase: 'new-moon',
        mysticalEnergy: 'flowing',
        shopifyConfigured: false
      });
    }

    // Try to fetch from Shopify (simplified)
    const shopifyUrl = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2023-10/products.json?limit=10`;
    
    console.log('Fetching from Shopify:', shopifyUrl);
    
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Shopify products fetched successfully:', data.products?.length || 0);
      
      res.json({
        success: true,
        products: data.products || [],
        message: 'Live products from Shopify',
        moonPhase: 'new-moon',
        mysticalEnergy: 'flowing',
        shopifyConfigured: true
      });
    } else {
      console.error('❌ Shopify API error:', response.status, response.statusText);
      res.json({
        success: true,
        products: [],
        message: `Shopify API error: ${response.status}`,
        moonPhase: 'new-moon',
        mysticalEnergy: 'disrupted',
        shopifyConfigured: true
      });
    }

  } catch (error) {
    console.error('💀 Products endpoint error:', error);
    res.json({
      success: true,
      products: [],
      error: 'Products temporarily unavailable',
      message: 'Fallback to static catalog',
      moonPhase: 'new-moon',
      mysticalEnergy: 'flowing'
    });
  }
});

export default router;
