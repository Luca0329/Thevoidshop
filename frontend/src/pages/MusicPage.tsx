import React from 'react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import ProductGrid from '../components/ProductGrid';

const MusicPage: React.FC = () => {
  const { products, loading } = useShopifyProducts('music');

  return (
    <main className="pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Underground <span className="text-purple-500">Music</span>
          </h1>
          <p className="text-gray-400">
            Dive into our collection of underground and alternative music. From limited edition
            vinyl pressings to exclusive digital releases, discover the sound of the void.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-purple-400 animate-pulse">
              🎵 Summoning mystical tracks...
            </div>
          </div>
        ) : (
          <ProductGrid products={products} activeCategory="music" />
        )}
      </div>
    </main>
  );
};

export default MusicPage;