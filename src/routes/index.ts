import { Express, Router } from 'express';
import { voidShopAuthController } from '../controllers/auth';
import { voidShopProductsController } from '../controllers/products';
import { voidShopOrdersController } from '../controllers/orders';
import { voidShopWebhookService } from '../services/webhook';
import { 
  authenticateToken, 
  authenticateShopifySession, 
  requireMysticLevel, 
  applyRateLimit, 
  validateWebhook,
  logMysticalActivity 
} from '../middleware/auth';

export function setupRoutes(app: Express): void {
  // Authentication routes (no auth required)
  const authRouter = Router();
  authRouter.get('/shopify', voidShopAuthController.initiateShopifyAuth.bind(voidShopAuthController));
  authRouter.get('/callback', voidShopAuthController.handleShopifyCallback.bind(voidShopAuthController));
  authRouter.post('/token', voidShopAuthController.generateToken.bind(voidShopAuthController));
  authRouter.post('/verify', voidShopAuthController.verifyToken.bind(voidShopAuthController));
  authRouter.post('/logout', voidShopAuthController.logout.bind(voidShopAuthController));
  
  app.use('/auth', authRouter);

  // Protected API routes (require authentication)
  const apiRouter = Router();
  
  // Apply authentication middleware to all API routes
  apiRouter.use(authenticateToken);
  apiRouter.use(authenticateShopifySession);
  apiRouter.use(logMysticalActivity);
  apiRouter.use(applyRateLimit(100)); // 100 requests per minute

  // Products routes
  apiRouter.get('/products', voidShopProductsController.getAllProducts.bind(voidShopProductsController));
  apiRouter.get('/products/:id', voidShopProductsController.getProductById.bind(voidShopProductsController));
  apiRouter.post('/products', requireMysticLevel('adept'), voidShopProductsController.createProduct.bind(voidShopProductsController));
  apiRouter.get('/products/category/:category', voidShopProductsController.getProductsByCategory.bind(voidShopProductsController));
  apiRouter.get('/products/limited-editions', voidShopProductsController.getLimitedEditions.bind(voidShopProductsController));

  // Orders routes
  apiRouter.get('/orders', voidShopOrdersController.getAllOrders.bind(voidShopOrdersController));
  apiRouter.put('/orders/:id/ritual-status', requireMysticLevel('adept'), voidShopOrdersController.updateRitualStatus.bind(voidShopOrdersController));
  apiRouter.get('/orders/moon-phase/:phase', voidShopOrdersController.getOrdersByMoonPhase.bind(voidShopOrdersController));
  apiRouter.get('/orders/blessed', voidShopOrdersController.getBlessedOrders.bind(voidShopOrdersController));
  apiRouter.get('/orders/stats', voidShopOrdersController.getOrderStats.bind(voidShopOrdersController));

  app.use('/api', apiRouter);

  // Webhook routes (special authentication)
  const webhookRouter = Router();
  webhookRouter.use(validateWebhook); // Shopify webhook signature validation
  
  webhookRouter.post('/orders/create', voidShopWebhookService.handleOrderCreate.bind(voidShopWebhookService));
  webhookRouter.post('/orders/update', voidShopWebhookService.handleOrderUpdate.bind(voidShopWebhookService));
  webhookRouter.post('/products/create', voidShopWebhookService.handleProductCreate.bind(voidShopWebhookService));

  app.use('/webhooks', webhookRouter);

  // Mystical status endpoint (public)
  app.get('/mystical-status', (req, res) => {
    const moonData = getCurrentMoonPhase();
    res.json({
      app: 'TheVoidShop Shopify Integration',
      status: 'channeling cosmic energies',
      currentMoonPhase: moonData.phase,
      moonPhasePercentage: moonData.percentage,
      mysticalEnergy: 'flowing',
      timestamp: new Date().toISOString()
    });
  });
}

// Helper function for moon phase with percentage
function getCurrentMoonPhase(): { phase: string; percentage: number } {
  const lunarCycle = 29.53058867;
  const knownNewMoon = new Date('2024-01-11');
  const now = new Date();
  const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const currentPhase = (daysSinceNewMoon % lunarCycle) / lunarCycle;
  
  let phase: string;
  let percentage: number;
  
  if (currentPhase < 0.125) {
    phase = 'new-moon';
    percentage = Math.round((currentPhase / 0.125) * 100);
  } else if (currentPhase < 0.375) {
    phase = 'waxing-crescent';
    percentage = Math.round(((currentPhase - 0.125) / 0.25) * 100);
  } else if (currentPhase < 0.625) {
    phase = 'full-moon';
    percentage = Math.round(((currentPhase - 0.375) / 0.25) * 100);
  } else if (currentPhase < 0.875) {
    phase = 'waning-crescent';
    percentage = Math.round(((currentPhase - 0.625) / 0.25) * 100);
  } else {
    phase = 'new-moon';
    percentage = Math.round(((currentPhase - 0.875) / 0.125) * 100);
  }
  
  return { phase, percentage };
}
