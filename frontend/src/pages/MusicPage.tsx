import React from 'react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import ProductGrid from '../components/ProductGrid';

const MusicPage: React.FC = () => {
  const { products, loading, error } = useShopifyProducts();
  
  // Debug: Log the first product to see its structure
  React.useEffect(() => {
    if (products.length > 0) {
      console.log('🎵 First product structure:', products[0]);
      console.log('🎵 Available fields:', Object.keys(products[0]));
    }
  }, [products]);

  // Filter products for music-related items
  const musicProducts = products.filter(product => {
    console.log('🎵 Checking product:', product.title, 'Tags:', product.tags);
    const tags = product.tags?.toLowerCase() || '';
    const title = product.title?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    
    return tags.includes('music') || 
           tags.includes('album') || 
           tags.includes('digital') ||
           tags.includes('tape') ||
           title.includes('music') ||
           description.includes('music');
  });

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
        ) : error ? (
          <div className="text-red-500 text-center py-20">
            {error}
          </div>
        ) : (
          <ProductGrid products={musicProducts} activeCategory="music" />
        )}
      </div>
    </main>
  );
};

export default MusicPage;