import { Request, Response } from 'express';
import { voidShopifyService } from '../services/shopify';
import { TheVoidShopProduct } from '../types/shopify';

export class VoidShopProductsController {

  // Get all mystical products with optional filtering
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      const filters = {
        ritualUse: req.query.ritualUse as string,
        limitedEdition: req.query.limitedEdition === 'true',
        mysticCategory: req.query.mysticCategory as string
      };

      const products = await voidShopifyService.getProducts(session, filters);
      
      res.json({
        success: true,
        count: products.length,
        products,
        filters: filters,
        retrievedAt: new Date().toISOString(),
        mysticalEnergy: 'high'
      });

    } catch (error) {
      console.error('❌ Failed to retrieve mystical products:', error);
      res.status(500).json({
        error: 'Product retrieval failed',
        message: 'The mystical inventory is temporarily obscured'
      });
    }
  }

  // Get specific product by mystical ID
  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      const productId = parseInt(req.params.id);

      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      if (isNaN(productId)) {
        res.status(400).json({
          error: 'Invalid product ID',
          message: 'The mystical identifier must be a number'
        });
        return;
      }

      const product = await voidShopifyService.getProductById(session, productId);

      if (!product) {
        res.status(404).json({
          error: 'Product not found',
          message: 'This mystical item has vanished into the void'
        });
        return;
      }

      res.json({
        success: true,
        product,
        retrievedAt: new Date().toISOString(),
        mysticalResonance: product.rarityLevel
      });

    } catch (error) {
      console.error('❌ Failed to retrieve product:', error);
      res.status(500).json({
        error: 'Product retrieval failed',
        message: 'The mystical item remains hidden'
      });
    }
  }

  // Create new mystical product
  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      const productData: Partial<TheVoidShopProduct> = {
        title: req.body.title,
        body_html: req.body.body_html,
        vendor: req.body.vendor || 'TheVoidShop',
        product_type: req.body.product_type,
        
        // TheVoidShop mystical properties
        ritualUse: req.body.ritualUse || 'general',
        limitedEdition: req.body.limitedEdition || false,
        mysticCategory: req.body.mysticCategory || 'accessories',
        rarityLevel: req.body.rarityLevel || 'common',
        energyAlignment: req.body.energyAlignment || [],
        isDigitalItem: req.body.isDigitalItem || false,
        variants: req.body.variants || []
      };

      // Validate required mystical fields
      if (!productData.title || !productData.ritualUse) {
        res.status(400).json({
          error: 'Missing required mystical properties',
          message: 'Title and ritual use are required for mystical manifestation',
          required: ['title', 'ritualUse']
        });
        return;
      }

      const newProduct = await voidShopifyService.createMysticProduct(session, productData);

      console.log(`✨ New mystical product created: ${newProduct.title}`);

      res.status(201).json({
        success: true,
        product: newProduct,
        message: 'Mystical product successfully manifested',
        createdAt: new Date().toISOString(),
        mysticalEnergy: 'surging'
      });

    } catch (error) {
      console.error('❌ Failed to create mystical product:', error);
      res.status(500).json({
        error: 'Product creation failed',
        message: 'The mystical manifestation was disrupted'
      });
    }
  }

  // Get products by mystical category
  public async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      const category = req.params.category;

      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      const validCategories = ['apparel', 'digital-tools', 'accessories'];
      if (!validCategories.includes(category)) {
        res.status(400).json({
          error: 'Invalid mystical category',
          message: 'Valid categories are: apparel, digital-tools, accessories',
          provided: category
        });
        return;
      }

      const products = await voidShopifyService.getProducts(session, { 
        mysticCategory: category 
      });

      res.json({
        success: true,
        category: category,
        count: products.length,
        products,
        mysticalResonance: products.length > 0 ? 'strong' : 'faint',
        retrievedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Failed to retrieve products by category:', error);
      res.status(500).json({
        error: 'Category retrieval failed',
        message: 'The mystical category is temporarily obscured'
      });
    }
  }

  // Get limited edition mystical items
  public async getLimitedEditions(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      const products = await voidShopifyService.getProducts(session, { 
        limitedEdition: true 
      });

      res.json({
        success: true,
        message: 'Limited edition mystical treasures',
        count: products.length,
        products,
        rarity: 'exclusive',
        retrievedAt: new Date().toISOString(),
        warning: 'These items may vanish at any moment'
      });

    } catch (error) {
      console.error('❌ Failed to retrieve limited editions:', error);
      res.status(500).json({
        error: 'Limited edition retrieval failed',
        message: 'The exclusive mystical items remain hidden'
      });
    }
  }
}

export const voidShopProductsController = new VoidShopProductsController();
