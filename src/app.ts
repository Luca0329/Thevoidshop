import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('🌙 Starting TheVoidShop backend v2.0...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS configuration  
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS || 'https://thevoidshop.netlify.app').split(',')
    : ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TheVoidShop Backend v2.0 - Mystical Powers Activated!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/health',
      '/mystical-status', 
      '/test-shopify',
      '/api/products'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'TheVoidShop Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Mystical status endpoint
app.get('/mystical-status', (req, res) => {
  res.json({
    app: 'TheVoidShop Shopify Integration',
    status: 'channeling cosmic energies',
    currentMoonPhase: 'new-moon',
    mysticalEnergy: 'flowing',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// Test Shopify connection endpoint
app.get('/test-shopify', async (req, res) => {
  if (!process.env.SHOPIFY_ACCESS_TOKEN || !process.env.SHOPIFY_SHOP_DOMAIN) {
    return res.status(400).json({
      error: 'Shopify not configured',
      missing: {
        accessToken: !process.env.SHOPIFY_ACCESS_TOKEN,
        shopDomain: !process.env.SHOPIFY_SHOP_DOMAIN
      }
    });
  }

  try {
    const shopifyUrl = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2023-10/shop.json`;
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const shopData = await response.json() as any;
      res.json({
        success: true,
        message: 'Shopify connection successful!',
        shop: shopData?.shop?.name || 'Connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(response.status).json({
        error: 'Shopify connection failed',
        status: response.status,
        statusText: response.statusText
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Shopify test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Products endpoint
app.get('/api/products', async (req, res) => {
  const hasShopifyConfig = process.env.SHOPIFY_ACCESS_TOKEN && process.env.SHOPIFY_SHOP_DOMAIN;

  if (!hasShopifyConfig) {
    return res.json({
      success: true,
      products: [],
      message: 'Using static product catalog - Shopify not configured',
      moonPhase: 'new-moon',
      mysticalEnergy: 'flowing',
      shopifyConfigured: false
    });
  }

  try {
    const shopifyUrl = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2023-10/products.json?limit=10`;
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json() as any;
      res.json({
        success: true,
        products: data?.products || [],
        message: 'Live products from Shopify',
        moonPhase: 'new-moon',
        mysticalEnergy: 'flowing',
        shopifyConfigured: true
      });
    } else {
      res.json({
        success: false,
        products: [],
        message: `Shopify API error: ${response.status}`,
        moonPhase: 'new-moon',
        mysticalEnergy: 'disrupted'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      products: [],
      error: 'Products temporarily unavailable',
      message: 'Fallback to static catalog'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found in the void',
    path: req.path,
    availableEndpoints: ['/', '/health', '/mystical-status', '/test-shopify', '/api/products']
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🌙 TheVoidShop backend v2.0 running on port ${PORT}`);
  console.log(`✨ All endpoints active and mystical!`);
}).on('error', (error: any) => {
  console.error('💀 Server failed to start:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🌙 Shutting down gracefully...');
  server.close(() => {
    console.log('✨ Server closed');
    process.exit(0);
  });
});

export default app;
