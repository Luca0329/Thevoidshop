import React from 'react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import ProductGrid from '../components/ProductGrid';

const ApparelPage: React.FC = () => {
  const { products, loading } = useShopifyProducts('apparel');

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
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </main>
  );
};

export default ApparelPage;