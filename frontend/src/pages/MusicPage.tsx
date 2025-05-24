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
    
    // Handle tags as either array or string
    let tagsString = '';
    if (Array.isArray(product.tags)) {
      tagsString = product.tags.join(' ').toLowerCase();
    } else if (typeof product.tags === 'string') {
      tagsString = product.tags.toLowerCase();
    }
    
    const title = product.title?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    
    return tagsString.includes('music') || 
           tagsString.includes('album') || 
           tagsString.includes('digital') ||
           tagsString.includes('tape') ||
           tagsString.includes('cassette') ||
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
          <>
            <div className="mb-4 text-gray-400">
              Total products: {products.length} | Music products: {musicProducts.length}
            </div>
            <ProductGrid products={musicProducts} activeCategory="all" />
          </>
        )}
      </div>
    </main>
  );
};

export default MusicPage;