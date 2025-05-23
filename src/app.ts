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

// Import the product routes at the top with other imports
import productRoutes from './routes/products';

// Mystical status endpoint (move this BEFORE the product routes)
app.get('/mystical-status', (req, res) => {
  try {
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
    res.status(500).json({
      error: 'Shopify test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes - Now with Shopify integration!
try {
  app.use('/api', productRoutes);
  console.log('✅ Product routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load product routes:', error);
}

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
  console.log(`✨ Health check: http://localhost:${PORT}/health`);
  console.log(`🔮 Mystical status: http://localhost:${PORT}/mystical-status`);
  
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
