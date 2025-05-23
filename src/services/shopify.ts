import { shopifyConfig } from '../../config/shopify';
import { TheVoidShopProduct, TheVoidShopVariant, VoidShopOrder, ShopifySession } from '../types/shopify';

export class VoidShopifyService {
  private shopify: any;

  constructor() {
    // Don't initialize here - wait until we need it
    this.shopify = null;
  }

  private getShopifyApi(): any {
    if (!this.shopify) {
      this.shopify = shopifyConfig.getShopifyApi();
    }
    return this.shopify;
  }

  // Product Management for TheVoidShop
  async getProducts(session: ShopifySession, filters?: {
    ritualUse?: string;
    limitedEdition?: boolean;
    mysticCategory?: string;
  }): Promise<TheVoidShopProduct[]> {
    try {
      const RestClient = this.getShopifyApi().clients.Rest as any;
      const client = new RestClient({ session });
      
      let queryParams: any = { limit: 250 };
      
      // Apply TheVoidShop specific filters
      if (filters?.limitedEdition) {
        queryParams.tags = 'limited-edition';
      }
      if (filters?.ritualUse) {
        queryParams.tags = queryParams.tags 
          ? `${queryParams.tags},ritual-${filters.ritualUse}`
          : `ritual-${filters.ritualUse}`;
      }

      const response = await client.get({ path: 'products', query: queryParams });
      
      return this.enrichProductsWithVoidShopData(response.body.products);
    } catch (error) {
      throw new Error(`Failed to fetch TheVoidShop products: ${error}`);
    }
  }

  async getProductById(session: ShopifySession, productId: number): Promise<TheVoidShopProduct | null> {
    try {
      const RestClient = this.getShopifyApi().clients.Rest as any;
      const client = new RestClient({ session });
      const response = await client.get({ path: `products/${productId}` });
      
      const enrichedProducts = this.enrichProductsWithVoidShopData([response.body.product]);
      return enrichedProducts[0] || null;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  }

  async createMysticProduct(session: ShopifySession, productData: Partial<TheVoidShopProduct>): Promise<TheVoidShopProduct> {
    try {
      const RestClient = this.getShopifyApi().clients.Rest as any;
      const client = new RestClient({ session });
      
      // Build Shopify-compatible product with TheVoidShop metadata
      const shopifyProduct = {
        product: {
          title: productData.title,
          body_html: productData.body_html,
          vendor: productData.vendor || 'TheVoidShop',
          product_type: productData.mysticCategory || 'mystic-item',
          tags: this.buildVoidShopTags(productData),
          metafields: this.buildVoidShopMetafields(productData),
          variants: productData.variants?.map(v => ({
            title: v.title,
            price: v.price,
            sku: v.sku,
            inventory_quantity: v.inventory_quantity
          }))
        }
      };

      const response = await client.post({ path: 'products', body: shopifyProduct });
      
      const enrichedProducts = this.enrichProductsWithVoidShopData([response.body.product]);
      return enrichedProducts[0];
    } catch (error) {
      throw new Error(`Failed to create mystical product: ${error}`);
    }
  }

  // Order Management for TheVoidShop
  async getOrders(session: ShopifySession, filters?: {
    status?: string;
    moonPhase?: string;
  }): Promise<VoidShopOrder[]> {
    try {
      const RestClient = this.getShopifyApi().clients.Rest as any;
      const client = new RestClient({ session });
      
      const queryParams: any = { 
        limit: 250,
        status: filters?.status || 'any'
      };

      const response = await client.get({ path: 'orders', query: queryParams });
      
      return this.enrichOrdersWithVoidShopData(response.body.orders);
    } catch (error) {
      throw new Error(`Failed to fetch TheVoidShop orders: ${error}`);
    }
  }

  async updateOrderRitualStatus(session: ShopifySession, orderId: number, blessed: boolean): Promise<VoidShopOrder> {
    try {
      const RestClient = this.getShopifyApi().clients.Rest as any;
      const client = new RestClient({ session });
      
      const updateData = {
        order: {
          id: orderId,
          note_attributes: [
            { name: 'blessed_by_ritualist', value: blessed.toString() },
            { name: 'blessing_timestamp', value: new Date().toISOString() }
          ]
        }
      };

      const response = await client.put({ path: `orders/${orderId}`, body: updateData });
      
      const enrichedOrders = this.enrichOrdersWithVoidShopData([response.body.order]);
      return enrichedOrders[0];
    } catch (error) {
      throw new Error(`Failed to update ritual status: ${error}`);
    }
  }

  // Private helper methods for TheVoidShop data enrichment
  private enrichProductsWithVoidShopData(products: any[]): TheVoidShopProduct[] {
    return products.map(product => ({
      ...product,
      ritualUse: this.extractRitualUse(product.tags),
      limitedEdition: product.tags?.includes('limited-edition') || false,
      dropDate: new Date(product.created_at),
      mysticCategory: this.determineMysticCategory(product.product_type),
      rarityLevel: this.determineRarityLevel(product.tags),
      energyAlignment: this.extractEnergyAlignment(product.tags),
      isDigitalItem: product.tags?.includes('digital') || false,
      variants: product.variants?.map((v: any) => this.enrichVariantData(v)) || []
    }));
  }

  private enrichOrdersWithVoidShopData(orders: any[]): VoidShopOrder[] {
    return orders.map(order => ({
      ...order,
      moonPhaseAtOrder: this.calculateMoonPhase(new Date(order.created_at)),
      ritualInstructions: this.extractRitualInstructions(order.line_items),
      blessedByRitualist: order.note_attributes?.some((attr: any) => 
        attr.name === 'blessed_by_ritualist' && attr.value === 'true'
      ) || false
    }));
  }

  private buildVoidShopTags(productData: Partial<TheVoidShopProduct>): string {
    const tags = [];
    
    if (productData.ritualUse) tags.push(`ritual-${productData.ritualUse}`);
    if (productData.limitedEdition) tags.push('limited-edition');
    if (productData.mysticCategory) tags.push(productData.mysticCategory);
    if (productData.rarityLevel) tags.push(`rarity-${productData.rarityLevel}`);
    if (productData.isDigitalItem) tags.push('digital');
    if (productData.energyAlignment) {
      productData.energyAlignment.forEach(energy => tags.push(`energy-${energy}`));
    }
    
    return tags.join(',');
  }

  private buildVoidShopMetafields(productData: Partial<TheVoidShopProduct>): any[] {
    return [
      {
        namespace: 'thevoidshop',
        key: 'ritual_use',
        value: productData.ritualUse || '',
        type: 'single_line_text_field'
      },
      {
        namespace: 'thevoidshop',
        key: 'rarity_level',
        value: productData.rarityLevel || 'common',
        type: 'single_line_text_field'
      }
    ];
  }

  private extractRitualUse(tags: string): string {
    const ritualTag = tags?.split(',').find(tag => tag.trim().startsWith('ritual-'));
    return ritualTag ? ritualTag.replace('ritual-', '').trim() : 'general';
  }

  private determineMysticCategory(productType: string): 'apparel' | 'digital-tools' | 'accessories' {
    if (productType?.includes('clothing') || productType?.includes('apparel')) return 'apparel';
    if (productType?.includes('digital') || productType?.includes('tool')) return 'digital-tools';
    return 'accessories';
  }

  private determineRarityLevel(tags: string): 'common' | 'rare' | 'legendary' | 'cosmic' {
    const rarityTag = tags?.split(',').find(tag => tag.trim().startsWith('rarity-'));
    const rarity = rarityTag ? rarityTag.replace('rarity-', '').trim() : 'common';
    return ['common', 'rare', 'legendary', 'cosmic'].includes(rarity) ? rarity as any : 'common';
  }

  private extractEnergyAlignment(tags: string): string[] {
    return tags?.split(',')
      .filter(tag => tag.trim().startsWith('energy-'))
      .map(tag => tag.replace('energy-', '').trim()) || [];
  }

  private enrichVariantData(variant: any): TheVoidShopVariant {
    return {
      ...variant,
      sizeGuide: this.determineSizeGuide(variant.title),
      colorHex: this.extractColorHex(variant.title),
      downloadUrl: variant.sku?.includes('digital') ? `https://thevoidshop.com/downloads/${variant.sku}` : undefined
    };
  }

  private determineSizeGuide(title: string): 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'digital' {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const foundSize = sizes.find(size => title?.toUpperCase().includes(size));
    return foundSize as any || (title?.includes('digital') ? 'digital' : 'M');
  }

  private extractColorHex(title: string): string | undefined {
    const colorMap: { [key: string]: string } = {
      'void-black': '#000000',
      'mystic-purple': '#4B0082',
      'cosmic-blue': '#191970',
      'ritual-red': '#8B0000',
      'ethereal-white': '#F8F8FF'
    };
    
    const colorName = Object.keys(colorMap).find(color => 
      title?.toLowerCase().includes(color.replace('-', ' '))
    );
    
    return colorName ? colorMap[colorName] : undefined;
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

  private extractRitualInstructions(lineItems: any[]): string | undefined {
    const digitalItems = lineItems?.filter(item => 
      item.sku?.includes('digital') || item.title?.includes('ritual')
    );
    
    if (digitalItems?.length > 0) {
      return 'Digital ritual tools included. Instructions will be sent via mystical email portal.';
    }
    
    return undefined;
  }
}

export const voidShopifyService = new VoidShopifyService();
