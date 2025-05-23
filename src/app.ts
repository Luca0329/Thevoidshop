import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('🌙 Starting TheVoidShop backend v2.0...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('Allowed Origins:', process.env.ALLOWED_ORIGINS);
console.log('🔥 Force rebuild - all endpoints should work now!');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS configuration - fix the Railway/Netlify connection
app.use(cors({
  origin: [
    'https://thevoidshop.netlify.app',
    'https://railway.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Add explicit preflight handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://thevoidshop.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TheVoidShop Backend v3.0 - Force Rebuild Complete!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/health',
      '/mystical-status', 
      '/test-shopify',
      '/api/products'
    ],
    status: 'All endpoints should be working now!'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'TheVoidShop Backend',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    message: 'Force rebuild successful!'
  });
});

// Mystical status endpoint
app.get('/mystical-status', (req, res) => {
  console.log('🔮 Mystical status endpoint hit - v3.0');
  res.json({
    app: 'TheVoidShop Shopify Integration',
    status: 'channeling cosmic energies',
    currentMoonPhase: 'new-moon',
    mysticalEnergy: 'flowing',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    message: 'Mystical endpoint working in v3.0!'
  });
});

// Test Shopify connection endpoint
app.get('/test-shopify', async (req, res) => {
  console.log('🧪 Test Shopify endpoint hit - v3.0');
  
  if (!process.env.SHOPIFY_ACCESS_TOKEN || !process.env.SHOPIFY_SHOP_DOMAIN) {
    return res.status(400).json({
      error: 'Shopify not configured',
      version: '3.0.0',
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
  console.log('🛍️ Products endpoint hit - v3.0');
  
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

// Debug endpoint to check environment variables
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint',
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    hasShopifyToken: !!process.env.SHOPIFY_ACCESS_TOKEN,
    hasShopDomain: !!process.env.SHOPIFY_SHOP_DOMAIN,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    actualAllowedOrigins: process.env.NODE_ENV === 'production' 
      ? ['https://thevoidshop.netlify.app', 'https://railway.com']
      : ['http://localhost:5173', 'http://localhost:3000'],
    timestamp: new Date().toISOString()
  });
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
  console.log(`🌙 TheVoidShop backend v3.0 running on port ${PORT}`);
  console.log(`✨ All endpoints active and mystical!`);
  console.log(`🔥 This is a force rebuild - endpoints should work now!`);
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
