import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { shopifyConfig } from '../../config/shopify';

export class VoidShopAuthController {
  
  // Initiate Shopify OAuth flow for TheVoidShop
  public async initiateShopifyAuth(req: Request, res: Response): Promise<void> {
    try {
      const { shop } = req.query;
      
      if (!shop || typeof shop !== 'string') {
        res.status(400).json({ 
          error: 'Missing shop parameter',
          message: 'TheVoidShop requires a valid shop domain'
        });
        return;
      }

      // Validate shop domain format
      const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;
      
      const redirectUri = `${process.env.SHOPIFY_HOST_NAME}/auth/callback`;
      const authUrl = shopifyConfig.getAuthUrl(shopDomain, redirectUri);
      
      console.log(`🌙 Initiating mystical auth flow for shop: ${shopDomain}`);
      
      res.redirect(authUrl);
    } catch (error) {
      console.error('❌ Auth initiation failed:', error);
      res.status(500).json({ 
        error: 'Failed to initiate mystical authentication',
        message: 'The cosmic forces are misaligned'
      });
    }
  }

  // Handle Shopify OAuth callback
  public async handleShopifyCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, shop, state } = req.query;
      
      if (!code || !shop) {
        res.status(400).json({ 
          error: 'Missing authorization code or shop',
          message: 'TheVoidShop auth ritual incomplete'
        });
        return;
      }

      const shopifyApi = shopifyConfig.getShopifyApi();
      const shopDomain = typeof shop === 'string' ? shop : '';
      
      // Exchange code for access token
      const tokenResponse = await shopifyApi.auth.callback({
        rawRequest: req,
        rawResponse: res
      });

      const { session } = tokenResponse;
      
      if (!session) {
        throw new Error('No session received from Shopify');
      }

      // Generate JWT for TheVoidShop internal auth
      const voidShopToken = this.generateVoidShopToken({
        shop: session.shop,
        accessToken: session.accessToken,
        scope: session.scope
      });

      console.log(`✨ Mystical connection established with ${session.shop}`);
      
      res.json({
        success: true,
        message: 'TheVoidShop mystical authentication complete',
        shop: session.shop,
        token: voidShopToken,
        scopes: session.scope,
        connectedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Auth callback failed:', error);
      res.status(500).json({ 
        error: 'Authentication ritual failed',
        message: 'The mystical energies could not align'
      });
    }
  }

  // Generate internal JWT token for TheVoidShop
  public async generateToken(req: Request, res: Response): Promise<void> {
    try {
      const { shop, accessToken } = req.body;
      
      if (!shop || !accessToken) {
        res.status(400).json({ 
          error: 'Missing shop or access token',
          message: 'TheVoidShop requires complete mystical credentials'
        });
        return;
      }

      const token = this.generateVoidShopToken({ shop, accessToken });
      
      res.json({
        success: true,
        token,
        expiresIn: '24h',
        generatedAt: new Date().toISOString(),
        shop
      });
      
    } catch (error) {
      console.error('❌ Token generation failed:', error);
      res.status(500).json({ 
        error: 'Token generation failed',
        message: 'The mystical token could not be forged'
      });
    }
  }

  // Verify TheVoidShop JWT token
  public async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(401).json({ 
          error: 'No token provided',
          message: 'TheVoidShop requires mystical authentication'
        });
        return;
      }

      const decoded = this.verifyVoidShopToken(token);
      
      res.json({
        valid: true,
        shop: decoded.shop,
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      });
      
    } catch (error) {
      res.status(401).json({ 
        valid: false,
        error: 'Invalid token',
        message: 'The mystical token has lost its power'
      });
    }
  }

  // Logout and invalidate session
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        success: true,
        message: 'Mystical connection severed',
        loggedOutAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      res.status(500).json({ 
        error: 'Logout failed',
        message: 'The mystical bond persists'
      });
    }
  }

  // Private helper methods
  private generateVoidShopToken(payload: { shop: string; accessToken?: string; scope?: string }): string {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const tokenPayload = {
      shop: payload.shop,
      scope: payload.scope,
      iss: 'thevoidshop',
      aud: 'thevoidshop-api',
      mysticLevel: 'cosmic'
    };

    return jwt.sign(tokenPayload, jwtSecret, { 
      expiresIn: '24h',
      algorithm: 'HS256'
    });
  }

  private verifyVoidShopToken(token: string): any {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.verify(token, jwtSecret);
  }
}

export const voidShopAuthController = new VoidShopAuthController();
