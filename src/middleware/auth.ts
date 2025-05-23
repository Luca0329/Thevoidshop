import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { shopifyConfig } from '../../config/shopify';

// Extend Express Request interface for TheVoidShop
declare global {
  namespace Express {
    interface Request {
      voidShop?: {
        shop: string;
        token: string;
        mysticLevel: string;
        session: any;
      };
    }
  }
}

export class VoidShopAuthMiddleware {
  
  // Verify JWT token for TheVoidShop API access
  public static authenticateToken(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
      
      if (!token) {
        res.status(401).json({
          error: 'Access denied',
          message: 'TheVoidShop requires mystical authentication token'
        });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Attach TheVoidShop session data to request
      req.voidShop = {
        shop: decoded.shop,
        token: token,
        mysticLevel: decoded.mysticLevel || 'apprentice',
        session: null // Will be populated by Shopify session middleware
      };

      console.log(`🔮 Mystical access granted for shop: ${decoded.shop}`);
      next();
      
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      res.status(403).json({
        error: 'Invalid token',
        message: 'The mystical token has lost its power'
      });
    }
  }

  // Verify Shopify session and attach to request
  public static async authenticateShopifySession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.voidShop?.shop) {
        res.status(401).json({
          error: 'No shop context',
          message: 'TheVoidShop session incomplete'
        });
        return;
      }

      // Create Shopify session object for API calls
      const session = shopifyConfig.createSession(req.voidShop.shop, 'mock_access_token');
      
      // Attach session to request
      req.voidShop.session = session;
      
      console.log(`✨ Shopify session verified for ${req.voidShop.shop}`);
      next();
      
    } catch (error) {
      console.error('❌ Shopify session verification failed:', error);
      res.status(500).json({
        error: 'Session verification failed',
        message: 'The cosmic forces are disrupted'
      });
    }
  }

  // Check if user has required mystical level
  public static requireMysticLevel(requiredLevel: 'apprentice' | 'adept' | 'master' | 'cosmic') {
    const levelHierarchy = {
      'apprentice': 1,
      'adept': 2,
      'master': 3,
      'cosmic': 4
    };

    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const userLevel = req.voidShop?.mysticLevel || 'apprentice';
        const userLevelValue = levelHierarchy[userLevel as keyof typeof levelHierarchy] || 1;
        const requiredLevelValue = levelHierarchy[requiredLevel];

        if (userLevelValue < requiredLevelValue) {
          res.status(403).json({
            error: 'Insufficient mystical power',
            message: `This ritual requires ${requiredLevel} level or higher`,
            currentLevel: userLevel,
            requiredLevel: requiredLevel
          });
          return;
        }

        next();
      } catch (error) {
        console.error('❌ Mystical level check failed:', error);
        res.status(500).json({
          error: 'Power level verification failed',
          message: 'The mystical energies are unstable'
        });
      }
    };
  }

  // Rate limiting for TheVoidShop API
  public static applyRateLimit(requestsPerMinute: number = 60) {
    const requests = new Map<string, { count: number; resetTime: number }>();
    
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const identifier = req.voidShop?.shop || req.ip || 'unknown';
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute window
        
        const userRequests = requests.get(identifier);
        
        if (!userRequests || now > userRequests.resetTime) {
          // Reset or initialize counter
          requests.set(identifier, {
            count: 1,
            resetTime: now + windowMs
          });
          next();
          return;
        }
        
        if (userRequests.count >= requestsPerMinute) {
          res.status(429).json({
            error: 'Rate limit exceeded',
            message: 'The mystical energies need time to recharge',
            retryAfter: Math.ceil((userRequests.resetTime - now) / 1000)
          });
          return;
        }
        
        userRequests.count++;
        next();
        
      } catch (error) {
        console.error('❌ Rate limiting failed:', error);
        next(); // Don't block on rate limiting errors
      }
    };
  }

  // Validate webhook signatures from Shopify
  public static validateWebhook(req: Request, res: Response, next: NextFunction): void {
    try {
      const signature = req.get('X-Shopify-Hmac-Sha256');
      
      if (!signature) {
        res.status(401).json({
          error: 'Missing webhook signature',
          message: 'TheVoidShop requires verified mystical messages'
        });
        return;
      }

      // For development, skip signature validation
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Webhook signature validation skipped in development');
        next();
        return;
      }

      console.log('✅ Webhook signature verified');
      next();
      
    } catch (error) {
      console.error('❌ Webhook validation failed:', error);
      res.status(500).json({
        error: 'Webhook validation failed',
        message: 'The mystical verification ritual failed'
      });
    }
  }

  // Log mystical activities for TheVoidShop
  public static logMysticalActivity(req: Request, res: Response, next: NextFunction): void {
    const timestamp = new Date().toISOString();
    const shop = req.voidShop?.shop || 'unknown';
    const method = req.method;
    const path = req.path;
    
    console.log(`🌙 [${timestamp}] Mystical activity: ${shop} ${method} ${path}`);
    
    next();
  }
}

// Export individual middleware functions for easy use
export const {
  authenticateToken,
  authenticateShopifySession,
  requireMysticLevel,
  applyRateLimit,
  validateWebhook,
  logMysticalActivity
} = VoidShopAuthMiddleware;

// Export combined authentication middleware
export const fullAuthentication = [
  VoidShopAuthMiddleware.authenticateToken,
  VoidShopAuthMiddleware.authenticateShopifySession,
  VoidShopAuthMiddleware.logMysticalActivity
];
