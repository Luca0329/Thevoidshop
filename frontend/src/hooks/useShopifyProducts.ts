import { useState, useEffect } from 'react';
import { VoidShopAPI, VoidShopProduct } from '../services/api';
import { products as staticProducts } from '../data/products';

export function useShopifyProducts(category?: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingShopify, setUsingShopify] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        // Check if backend is healthy
        const isHealthy = await VoidShopAPI.healthCheck();
        
        if (isHealthy) {
          // Try to fetch from Shopify backend
          const shopifyProducts = await VoidShopAPI.getProducts({
            mysticCategory: category as any
          });
          
          if (shopifyProducts && shopifyProducts.length > 0) {
            setProducts(shopifyProducts);
            setUsingShopify(true);
            console.log('🔮 Using live Shopify products');
          } else {
            // Fallback to static products
            const filteredProducts = category 
              ? staticProducts.filter(p => p.category === category)
              : staticProducts;
            setProducts(filteredProducts);
            setUsingShopify(false);
            console.log('📦 Using static products (no Shopify data)');
          }
        } else {
          // Backend not available, use static
          const filteredProducts = category 
            ? staticProducts.filter(p => p.category === category)
            : staticProducts;
          setProducts(filteredProducts);
          setUsingShopify(false);
          console.log('📦 Using static products (backend offline)');
        }
      } catch (error) {
        // Fallback to static products on error
        const filteredProducts = category 
          ? staticProducts.filter(p => p.category === category)
          : staticProducts;
        setProducts(filteredProducts);
        setUsingShopify(false);
        setError('Failed to connect to Shopify backend');
        console.log('📦 Using static products (error occurred)');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  return { 
    products, 
    loading, 
    usingShopify, 
    error,
    refresh: () => fetchProducts()
  };
}
