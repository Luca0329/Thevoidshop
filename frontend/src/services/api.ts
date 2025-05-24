const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://thevoidshop.railway.app'
    : 'http://localhost:3000');

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
  ritualUse: string;
  limitedEdition: boolean;
  dropDate: Date;
  mysticCategory: 'apparel' | 'digital-tools' | 'accessories';
  rarityLevel: 'common' | 'rare' | 'legendary' | 'cosmic';
  energyAlignment: string[];
  isDigitalItem: boolean;
}

export class VoidShopAPI {
  static async getMysticalStatus() {
    try {
      const url = API_BASE_URL + '/mystical-status';
      console.log('🔮 Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('💀 API Error:', error);
      
      // Always try Railway as backup
      try {
        console.log('🔄 Trying Railway backup...');
        const response = await fetch('https://thevoidshop.railway.app/mystical-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Railway backup successful:', data);
          return data;
        }
      } catch (backupError) {
        console.error('💀 Railway backup failed:', backupError);
      }
      
      return null;
    }
  }

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

      const url = API_BASE_URL + '/api/products?' + params.toString();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Failed to fetch Shopify products:', error);
      return null;
    }
  }

  static async healthCheck() {
    try {
      const response = await fetch(API_BASE_URL + '/health', {
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

export default VoidShopAPI;
