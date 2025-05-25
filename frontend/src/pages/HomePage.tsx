import React, { useEffect, useState } from 'react';
import { fetchShopifyProducts } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import NewArrivals from '../components/NewArrivals';
import About from '../components/About';
import Newsletter from '../components/Newsletter';
import PromoBanner from '../components/PromoBanner';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🛍️ Loading products...');
        const data = await fetchShopifyProducts(8);
        console.log('🛍️ Products loaded:', data);
        
        // Temporary fallback if no products
        if (!data || data.length === 0) {
          console.log('🛍️ No products from API, using test data');
          setProducts([{
            id: 'test-1',
            title: 'Test Product',
            handle: 'test-product',
            description: 'Test description',
            price: 25.00,
            image: 'https://via.placeholder.com/400',
            available: true,
            tags: ['test']
          }]);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('🛍️ Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const latestArrivals = products.slice(0, 4);

  return (
    <main>
      <Hero />
      
      <div className="container mx-auto px-4 py-12">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">Featured Products</h1>
          <p className="text-gray-400 text-lg">Discover our latest collection</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="aspect-square bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-700 rounded"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <h3 className="text-2xl text-white mb-4">No Products Found</h3>
              <p className="text-gray-400 mb-4">Check console for API errors</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded text-white transition-colors"
              >
                Reload Page
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Other Sections */}
      <About />
      <Newsletter />
    </main>
  );
};

export default HomePage;