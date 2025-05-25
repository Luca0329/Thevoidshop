import React, { useEffect, useState } from 'react';
import { fetchStripeProducts, AutoProduct } from '../services/stripeApi';
import ProductCard from '../components/ProductCard';

const ApparelPage: React.FC = () => {
  const [products, setProducts] = useState<AutoProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchStripeProducts();
        // Filter for apparel only
        const apparelProducts = allProducts.filter(p => p.category === 'apparel');
        setProducts(apparelProducts);
      } catch (error) {
        console.error('Error loading apparel:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className="pt-24 min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alternative <span className="text-purple-500">Apparel</span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-2xl">
            Express your underground spirit with our curated collection of alternative apparel. 
            Each piece is designed to embody the essence of counter-culture while maintaining 
            premium quality and comfort.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-purple-400 animate-pulse">
              🌙 Loading mystical apparel...
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="col-span-4 text-center py-12">
            <h3 className="text-2xl text-white mb-4">No Apparel Found</h3>
            <p className="text-gray-400">Add products with category="apparel" in Stripe</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ApparelPage;