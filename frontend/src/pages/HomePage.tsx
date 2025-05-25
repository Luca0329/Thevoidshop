import React, { useEffect, useState } from 'react';
import { fetchStripeProducts, AutoProduct } from '../services/stripeApi';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import About from '../components/About';
import Newsletter from '../components/Newsletter';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<AutoProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🛍️ Loading products from Stripe...');
        const stripeProducts = await fetchStripeProducts();
        console.log('🛍️ Products loaded:', stripeProducts);
        setProducts(stripeProducts);
      } catch (error) {
        console.error('🛍️ Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main>
      <Hero />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">Featured Products</h1>
          <p className="text-gray-400 text-lg">Automatically synced from Stripe</p>
        </div>

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
              <p className="text-gray-400">Create products in your Stripe dashboard</p>
            </div>
          )}
        </div>
      </div>

      <About />
      <Newsletter />
    </main>
  );
};

export default HomePage;