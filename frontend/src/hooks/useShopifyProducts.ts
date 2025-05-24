import { useState, useEffect } from 'react';
import { fetchShopifyProducts } from '../services/api';

export function useShopifyProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch products from Shopify
        const shopifyProducts = await fetchShopifyProducts();
        
        console.log('🔮 Raw Shopify response:', shopifyProducts);
        
        if (shopifyProducts && shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
          console.log('🔮 Using live Shopify products:', shopifyProducts.length, 'products loaded');
        } else {
          setProducts([]);
          console.log('📦 No products found in Shopify - response was:', shopifyProducts);
        }
      } catch (error) {
        setProducts([]);
        setError('Failed to connect to Shopify backend');
        console.log('📦 Shopify error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { 
    products, 
    loading, 
    error
  };
}
