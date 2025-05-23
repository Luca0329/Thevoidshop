import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { shopifyConfig } from '../config/shopify';
import { setupRoutes } from './routes';
import productRoutes from './routes/products';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and parsing middleware
app.use(helmet({
  contentSecurityPolicy: false // Shopify embeds require this
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [`https://${process.env.SHOPIFY_HOST_NAME}`]
    : true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Add static file serving for frontend
app.use(express.static('public'));

// Initialize TheVoidShop Shopify configuration
try {
  shopifyConfig.initialize();
  console.log('🌙 TheVoidShop Shopify integration initialized');
} catch (error) {
  console.error('❌ Failed to initialize Shopify config:', error);
  process.exit(1);
}

// Setup all routes
setupRoutes(app);

// API Routes
app.use('/api', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'TheVoidShop Shopify API is running',
    timestamp: new Date().toISOString(),
    mysticMode: process.env.VOID_SHOP_MYSTIC_MODE === 'true'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'TheVoidShop Shopify Integration',
    version: '1.0.0',
    description: 'Mystical commerce meets modern technology'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Error in TheVoidShop API:', err.stack);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: 'Something mystical went wrong',
    message: isDevelopment ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Path not found in the void',
    message: `The mystical path ${req.originalUrl} does not exist`
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 TheVoidShop API running on port ${PORT}`);
  console.log(`🌟 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔮 Ready to channel mystical commerce energy`);
});

export default app;
