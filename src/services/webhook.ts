import { Request, Response } from 'express';
import { WebhookEvent } from '../types/shopify';

export class VoidShopWebhookService {

  // Handle order creation webhook
  public async handleOrderCreate(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;
      
      console.log(`🌙 New mystical order received: ${orderData.order_number || orderData.id}`);
      
      // Process TheVoidShop specific order logic
      await this.processNewOrder(orderData);
      
      res.status(200).json({
        success: true,
        message: 'Mystical order creation processed',
        orderId: orderData.id,
        processedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Order creation webhook failed:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: 'The mystical order could not be processed'
      });
    }
  }

  // Handle order update webhook
  public async handleOrderUpdate(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;
      
      console.log(`✨ Mystical order updated: ${orderData.order_number || orderData.id}`);
      
      // Process order updates for TheVoidShop
      await this.processOrderUpdate(orderData);
      
      res.status(200).json({
        success: true,
        message: 'Mystical order update processed',
        orderId: orderData.id,
        processedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Order update webhook failed:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: 'The mystical order update was disrupted'
      });
    }
  }

  // Handle product creation webhook
  public async handleProductCreate(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      
      console.log(`🔮 New mystical product manifested: ${productData.title}`);
      
      // Process new product for TheVoidShop
      await this.processNewProduct(productData);
      
      res.status(200).json({
        success: true,
        message: 'Mystical product creation processed',
        productId: productData.id,
        processedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Product creation webhook failed:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: 'The mystical product manifestation was disrupted'
      });
    }
  }

  // Private processing methods
  private async processNewOrder(orderData: any): Promise<void> {
    // Calculate moon phase at order time
    const moonPhase = this.calculateMoonPhase(new Date(orderData.created_at));
    
    // Check if order contains digital items
    const hasDigitalItems = orderData.line_items?.some((item: any) => 
      item.sku?.includes('digital') || item.title?.includes('ritual')
    );
    
    // Log mystical order properties
    console.log(`🌙 Order moon phase: ${moonPhase}`);
    console.log(`🔮 Contains digital tools: ${hasDigitalItems}`);
    
    // TheVoidShop specific processing:
    // - Store moon phase metadata
    // - Queue blessing rituals for high-value orders
    // - Send digital download links
    // - Update limited edition inventory
  }

  private async processOrderUpdate(orderData: any): Promise<void> {
    // Check if order was marked as fulfilled
    if (orderData.fulfillment_status === 'fulfilled') {
      console.log(`✨ Mystical order fulfilled: ${orderData.order_number}`);
      
      // Trigger post-fulfillment rituals
      // Send blessing confirmations
      // Update customer mystical status
    }
    
    // Check for payment updates
    if (orderData.financial_status === 'paid') {
      console.log(`💰 Mystical payment received: ${orderData.order_number}`);
      
      // Process payment-specific logic
      // Initiate blessing preparation
    }
  }

  private async processNewProduct(productData: any): Promise<void> {
    // Extract mystical properties from tags
    const tags = productData.tags?.split(',') || [];
    const isLimitedEdition = tags.includes('limited-edition');
    const ritualUse = tags.find((tag: string) => tag.startsWith('ritual-'))?.replace('ritual-', '');
    
    console.log(`🔮 Product type: ${productData.product_type}`);
    console.log(`✨ Limited edition: ${isLimitedEdition}`);
    console.log(`🌙 Ritual use: ${ritualUse || 'general'}`);
    
    // TheVoidShop specific processing:
    // - Index product for mystical search
    // - Set up inventory alerts for limited editions
    // - Configure automated blessing workflows
    // - Update mystical product database
  }

  private calculateMoonPhase(date: Date): string {
    const lunarCycle = 29.53058867;
    const knownNewMoon = new Date('2024-01-11');
    const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const currentPhase = (daysSinceNewMoon % lunarCycle) / lunarCycle;
    
    if (currentPhase < 0.125) return 'new-moon';
    if (currentPhase < 0.375) return 'waxing-crescent';
    if (currentPhase < 0.625) return 'full-moon';
    if (currentPhase < 0.875) return 'waning-crescent';
    return 'new-moon';
  }
}

export const voidShopWebhookService = new VoidShopWebhookService();
