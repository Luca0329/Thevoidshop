const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://thevoidshop-production.up.railway.app'
    : 'http://localhost:3000');

console.log('🔮 API Base URL:', API_BASE_URL);

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
      const url = `${API_BASE_URL}/mystical-status`;
      console.log('🔮 Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('💀 API Error:', error);
      
      // Return local calculation as fallback
      const now = new Date();
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const constellationIndex = Math.floor((dayOfYear / 2.5) % 12);
      const constellations = ['Capricorn ♑', 'Aquarius ♒', 'Pisces ♓', 'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐'];
      
      return {
        currentMoonPhase: 'new-moon',
        mysticalEnergy: constellations[constellationIndex],
        status: 'mystical backup active',
        timestamp: now.toISOString()
      };
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
