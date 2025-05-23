import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('🌙 Starting TheVoidShop backend...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Debug Shopify configuration
console.log('🛍️ Shopify Configuration Check:');
console.log('- API Key:', process.env.SHOPIFY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('- API Secret:', process.env.SHOPIFY_API_SECRET ? '✅ Set' : '❌ Missing');
console.log('- Shop Domain:', process.env.SHOPIFY_SHOP_DOMAIN ? '✅ Set' : '❌ Missing');
console.log('- Access Token:', process.env.SHOPIFY_ACCESS_TOKEN ? '✅ Set' : '❌ Missing');
console.log('- Storefront Token:', process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? '✅ Set' : '❌ Missing');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Shopify embeds require this
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

// Add static file serving for frontend
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  const shopifyStatus = {
    apiKey: !!process.env.SHOPIFY_API_KEY,
    apiSecret: !!process.env.SHOPIFY_API_SECRET,
    shopDomain: !!process.env.SHOPIFY_SHOP_DOMAIN,
    accessToken: !!process.env.SHOPIFY_ACCESS_TOKEN,
    storefrontToken: !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  };

  const allConfigured = Object.values(shopifyStatus).every(Boolean);

  res.json({ 
    status: 'healthy', 
    service: 'TheVoidShop Backend',
    timestamp: new Date().toISOString(),
    shopify: allConfigured ? 'fully configured' : 'partially configured',
    shopifyDetails: shopifyStatus,
    environment: process.env.NODE_ENV
  });
});

// Mystical status endpoint
app.get('/mystical-status', (req, res) => {
  try {
    console.log('🔮 Mystical status endpoint called');
    res.json({
      app: 'TheVoidShop Shopify Integration',
      status: 'channeling cosmic energies',
      currentMoonPhase: 'new-moon',
      mysticalEnergy: 'flowing',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in mystical-status:', error);
    res.status(500).json({ error: 'Mystical energies disrupted' });
  }
});

// Test Shopify connection endpoint
app.get('/test-shopify', async (req, res) => {
  try {
    console.log('🧪 Test Shopify endpoint called');
    
    if (!process.env.SHOPIFY_ACCESS_TOKEN || !process.env.SHOPIFY_SHOP_DOMAIN) {
      return res.status(400).json({
        error: 'Shopify not configured',
        missing: {
          accessToken: !process.env.SHOPIFY_ACCESS_TOKEN,
          shopDomain: !process.env.SHOPIFY_SHOP_DOMAIN
        }
      });
    }

    // Simple test call to Shopify
    const shopifyUrl = `https://${process.env.SHOPIFY_SHOP_DOMAIN}/admin/api/2023-10/shop.json`;
    console.log('Testing Shopify connection to:', shopifyUrl);
    
    const response = await fetch(shopifyUrl, {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const shopData = await response.json();
      res.json({
        success: true,
        message: 'Shopify connection successful!',
        shop: shopData.shop?.name || 'Connected',
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
    console.error('Shopify test error:', error);
    res.status(500).json({
      error: 'Shopify test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Products endpoint
app.get('/api/products', async (req, res) => {
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

    // Try to fetch from Shopify
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

// Root endpoint - test if server is responding at all
app.get('/', (req, res) => {
  res.json({
    message: 'TheVoidShop Backend is alive!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/health',
      '/mystical-status', 
      '/test-shopify',
      '/api/products'
    ]
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('💀 Application Error:', error);
  res.status(500).json({
    error: 'Internal mystical disruption',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found in the void',
    path: req.path
  });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🌙 TheVoidShop backend running on port ${PORT}`);
  console.log(`✨ Health check available`);
  console.log(`🔮 Mystical status available`);
  console.log(`🛍️ Products API available`);
  
  if (process.env.SHOPIFY_API_KEY) {
    console.log(`🛍️ Shopify integration: READY`);
  } else {
    console.log(`📦 Running in static mode (Shopify not configured)`);
  }
}).on('error', (error: any) => {
  console.error('💀 Server failed to start:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🌙 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✨ Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('💀 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
