import express from 'express';
import { voidShopifyService } from '../services/shopify';
import { VoidShopAuthMiddleware } from '../middleware/auth';

const router = express.Router();

// Get products with mystical enhancement
router.get('/products', async (req, res) => {
  try {
    // Check if we have real Shopify credentials
    const hasRealCredentials = process.env.SHOPIFY_API_KEY && 
                              process.env.SHOPIFY_API_SECRET && 
                              process.env.SHOPIFY_ACCESS_TOKEN &&
                              process.env.SHOPIFY_SHOP_DOMAIN;

    if (!hasRealCredentials) {
      // Return empty products array so frontend uses static fallback
      return res.json({
        success: true,
        products: [],
        message: 'Using static product catalog',
        moonPhase: 'new-moon',
        mysticalEnergy: 'flowing'
      });
    }

    // Production session with real credentials
    const productionSession = {
      id: `offline_${process.env.SHOPIFY_SHOP_DOMAIN}`,
      shop: process.env.SHOPIFY_SHOP_DOMAIN,
      accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
      isOnline: false
    };

    const filters = {
      mysticCategory: req.query.mysticCategory as string,
      limitedEdition: req.query.limitedEdition === 'true',
      ritualUse: req.query.ritualUse as string
    };

    // Map frontend categories to Shopify mystical categories
    const categoryMap: { [key: string]: string } = {
      'music': 'digital-tools',
      'apparel': 'apparel',
      'accessories': 'accessories'
    };

    if (filters.mysticCategory && categoryMap[filters.mysticCategory]) {
      filters.mysticCategory = categoryMap[filters.mysticCategory];
    }

    const products = await voidShopifyService.getProducts(productionSession, filters);
    
    res.json({
      success: true,
      products,
      moonPhase: 'new-moon',
      mysticalEnergy: 'flowing'
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Always return empty array so frontend gracefully falls back to static
    res.json({
      success: true,
      products: [],
      error: 'Shopify temporarily unavailable',
      moonPhase: 'new-moon',
      mysticalEnergy: 'flowing'
    });
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const mockSession = {
      id: 'dev_session',
      shop: 'thevoidshop-dev.myshopify.com',
      accessToken: 'dev_token',
      isOnline: false
    };

    const productId = parseInt(req.params.id);
    const product = await voidShopifyService.getProductById(mockSession, productId);
    
    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, error: 'Product not found' });
    }
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

export default router;
