import { Request, Response } from 'express';
import { voidShopifyService } from '../services/shopify';
import { VoidShopOrder } from '../types/shopify';

export class VoidShopOrdersController {

  // Get all mystical orders with optional filtering
  public async getAllOrders(req: Request, res: Response): Promise<void> {
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
        status: req.query.status as string,
        moonPhase: req.query.moonPhase as string
      };

      const orders = await voidShopifyService.getOrders(session, filters);
      
      res.json({
        success: true,
        count: orders.length,
        orders,
        filters: filters,
        retrievedAt: new Date().toISOString(),
        cosmicAlignment: 'favorable'
      });

    } catch (error) {
      console.error('❌ Failed to retrieve mystical orders:', error);
      res.status(500).json({
        error: 'Order retrieval failed',
        message: 'The cosmic order records are temporarily obscured'
      });
    }
  }

  // Update order's ritual blessing status
  public async updateRitualStatus(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      const orderId = parseInt(req.params.id);
      const { blessed, ritualNotes } = req.body;

      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      if (isNaN(orderId)) {
        res.status(400).json({
          error: 'Invalid order ID',
          message: 'The mystical order identifier must be a number'
        });
        return;
      }

      if (typeof blessed !== 'boolean') {
        res.status(400).json({
          error: 'Invalid blessing status',
          message: 'Blessing status must be true or false',
          received: typeof blessed
        });
        return;
      }

      const updatedOrder = await voidShopifyService.updateOrderRitualStatus(session, orderId, blessed);

      console.log(`🌟 Order ${orderId} ritual status updated: ${blessed ? 'blessed' : 'unblessed'}`);

      res.json({
        success: true,
        order: updatedOrder,
        message: blessed ? 'Order blessed by the mystical ritualist' : 'Blessing removed from order',
        updatedAt: new Date().toISOString(),
        ritualNotes: ritualNotes || 'No additional notes',
        cosmicEnergy: blessed ? 'radiant' : 'neutral'
      });

    } catch (error) {
      console.error('❌ Failed to update ritual status:', error);
      res.status(500).json({
        error: 'Ritual blessing update failed',
        message: 'The mystical energies resisted the blessing ritual'
      });
    }
  }

  // Get orders by moon phase
  public async getOrdersByMoonPhase(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      const moonPhase = req.params.phase;

      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      const validPhases = ['new-moon', 'waxing-crescent', 'full-moon', 'waning-crescent'];
      if (!validPhases.includes(moonPhase)) {
        res.status(400).json({
          error: 'Invalid moon phase',
          message: 'Valid phases are: new-moon, waxing-crescent, full-moon, waning-crescent',
          provided: moonPhase
        });
        return;
      }

      const orders = await voidShopifyService.getOrders(session, { moonPhase });
      
      res.json({
        success: true,
        moonPhase: moonPhase,
        count: orders.length,
        orders,
        lunarEnergy: moonPhase === 'full-moon' ? 'maximum' : 'moderate',
        retrievedAt: new Date().toISOString(),
        cosmicWisdom: `Orders placed during ${moonPhase} carry special mystical significance`
      });

    } catch (error) {
      console.error('❌ Failed to retrieve orders by moon phase:', error);
      res.status(500).json({
        error: 'Lunar order retrieval failed',
        message: 'The moon phases are temporarily obscured'
      });
    }
  }

  // Get blessed orders (orders that have been ritualized)
  public async getBlessedOrders(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      const allOrders = await voidShopifyService.getOrders(session);
      const blessedOrders = allOrders.filter(order => order.blessedByRitualist);

      res.json({
        success: true,
        message: 'Orders blessed by the mystical ritualist',
        count: blessedOrders.length,
        totalOrders: allOrders.length,
        blessedPercentage: allOrders.length > 0 ? Math.round((blessedOrders.length / allOrders.length) * 100) : 0,
        orders: blessedOrders,
        retrievedAt: new Date().toISOString(),
        spiritualEnergy: 'pure'
      });

    } catch (error) {
      console.error('❌ Failed to retrieve blessed orders:', error);
      res.status(500).json({
        error: 'Blessed order retrieval failed',
        message: 'The blessed orders are protected by mystical barriers'
      });
    }
  }

  // Get order statistics for TheVoidShop dashboard
  public async getOrderStats(req: Request, res: Response): Promise<void> {
    try {
      const session = req.voidShop?.session;
      if (!session) {
        res.status(401).json({ 
          error: 'No mystical session',
          message: 'TheVoidShop requires active connection'
        });
        return;
      }

      const orders = await voidShopifyService.getOrders(session);
      
      const stats = {
        totalOrders: orders.length,
        blessedOrders: orders.filter(o => o.blessedByRitualist).length,
        digitalOrders: orders.filter(o => o.ritualInstructions).length,
        totalValue: orders.reduce((sum, order) => sum + parseFloat(order.total_price || '0'), 0),
        avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + parseFloat(order.total_price || '0'), 0) / orders.length : 0
      };

      res.json({
        success: true,
        stats,
        mysticalInsights: this.generateMysticalInsights(stats),
        retrievedAt: new Date().toISOString(),
        cosmicWisdom: 'Numbers reveal the flow of mystical energy'
      });

    } catch (error) {
      console.error('❌ Failed to retrieve order statistics:', error);
      res.status(500).json({
        error: 'Statistics retrieval failed',
        message: 'The cosmic data streams are temporarily disrupted'
      });
    }
  }

  // Private helper methods
  private generateMysticalInsights(stats: any): string[] {
    const insights: string[] = [];
    
    if (stats.blessedOrders > stats.totalOrders * 0.8) {
      insights.push('The blessing rituals are flowing with exceptional cosmic energy');
    }
    
    if (stats.digitalOrders > stats.totalOrders * 0.5) {
      insights.push('Digital mystical tools are in high demand among seekers');
    }
    
    if (stats.avgOrderValue > 100) {
      insights.push('The cosmic abundance is manifesting through higher order values');
    }
    
    insights.push('Current mystical energy flows are strong and stable');
    
    return insights;
  }
}

export const voidShopOrdersController = new VoidShopOrdersController();
