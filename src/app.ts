import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

console.log('🌙 Starting TheVoidShop backend...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Shopify embeds require this
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [`https://${process.env.SHOPIFY_HOST_NAME}`]
    : true,
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
  res.json({ 
    status: 'healthy', 
    service: 'TheVoidShop Backend',
    timestamp: new Date().toISOString(),
    shopify: process.env.SHOPIFY_API_KEY ? 'configured' : 'not configured'
  });
});

// Mystical status endpoint
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

// Basic API routes (without Shopify for now)
app.get('/api/products', (req, res) => {
  try {
    // Return empty array so frontend falls back to static products
    res.json({
      success: true,
      products: [],
      message: 'Using static product catalog - Shopify not configured',
      moonPhase: 'new-moon',
      mysticalEnergy: 'flowing'
    });
  } catch (error) {
    console.error('Error in /api/products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
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
