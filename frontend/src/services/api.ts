const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://thevoidshop.railway.app'
  : 'http://localhost:3000';

export interface VoidShopProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  images: Array<{ src: string; alt?: string }>;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    inventory_quantity: number;
    sku?: string;
  }>;
  tags: string;
  
  // TheVoidShop mystical properties
  ritualUse: string;
  limitedEdition: boolean;
  dropDate: Date;
  mysticCategory: 'apparel' | 'digital-tools' | 'accessories';
  rarityLevel: 'common' | 'rare' | 'legendary' | 'cosmic';
  energyAlignment: string[];
  isDigitalItem: boolean;
}

export class VoidShopAPI {
  // Get mystical status (moon phase, energy levels)
  static async getMysticalStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/mystical-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch mystical status:', error);
      return null;
    }
  }

  // Get products from Shopify backend
  static async getProducts(filters?: {
    mysticCategory?: string;
    limitedEdition?: boolean;
    ritualUse?: string;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.mysticCategory) params.append('mysticCategory', filters.mysticCategory);
      if (filters?.limitedEdition) params.append('limitedEdition', 'true');
      if (filters?.ritualUse) params.append('ritualUse', filters.ritualUse);

      const response = await fetch(`${API_BASE_URL}/api/products?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Failed to fetch Shopify products:', error);
      return null;
    }
  }

  // Get single product by ID
  static async getProduct(productId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }

  // Get orders with mystical enhancements
  static async getOrders(filters?: {
    status?: string;
    moonPhase?: string;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.moonPhase) params.append('moonPhase', filters.moonPhase);

      const response = await fetch(`${API_BASE_URL}/api/orders?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return null;
    }
  }

  // Health check to see if backend is connected
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}
