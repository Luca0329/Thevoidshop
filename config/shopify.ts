import { shopifyApi, LATEST_API_VERSION, Session } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-07';
import '@shopify/shopify-api/adapters/node';

export interface ShopifyConfig {
  apiKey: string;
  apiSecretKey: string;
  scopes: string[];
  hostName: string;
  apiVersion: string;
  isEmbeddedApp: boolean;
}

class ShopifyConfigManager {
  private shopify: any;
  private initialized = false;

  public initialize(): void {
    if (this.initialized) {
      console.log('Shopify API already initialized');
      return;
    }

    const config: ShopifyConfig = {
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
      scopes: (process.env.SHOPIFY_SCOPES || '').split(','),
      hostName: process.env.SHOPIFY_HOST_NAME || 'localhost:3000',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false // TheVoidShop uses standalone app
    };

    this.validateConfig(config);

    this.shopify = shopifyApi({
      apiKey: config.apiKey,
      apiSecretKey: config.apiSecretKey,
      scopes: config.scopes,
      hostName: config.hostName,
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: config.isEmbeddedApp,
      restResources
    });

    this.initialized = true;
    console.log('TheVoidShop Shopify API initialized successfully');
  }

  private validateConfig(config: ShopifyConfig): void {
    const missingFields: string[] = [];

    if (!config.apiKey) missingFields.push('SHOPIFY_API_KEY');
    if (!config.apiSecretKey) missingFields.push('SHOPIFY_API_SECRET');
    if (config.scopes.length === 0) missingFields.push('SHOPIFY_SCOPES');
    if (!config.hostName) missingFields.push('SHOPIFY_HOST_NAME');

    if (missingFields.length > 0) {
      throw new Error(`Missing required Shopify configuration: ${missingFields.join(', ')}`);
    }
  }

  public getShopifyApi(): any {
    if (!this.initialized) {
      throw new Error('Shopify API not initialized. Call initialize() first.');
    }
    return this.shopify;
  }

  public createSession(shop: string, accessToken: string): Session {
    return new Session({
      id: `offline_${shop}`,
      shop,
      state: 'offline_state', // Add required state field
      accessToken,
      isOnline: false
    });
  }

  public getAuthUrl(shop: string, redirectUri: string): string {
    if (!this.initialized) {
      throw new Error('Shopify API not initialized');
    }
    
    return this.shopify.auth.buildAuthURL({
      shop,
      redirectUri,
      isOnline: false // TheVoidShop needs offline access for background operations
    });
  }
}

export const shopifyConfig = new ShopifyConfigManager();
