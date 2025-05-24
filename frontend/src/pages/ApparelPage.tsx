import React from 'react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import ProductGrid from '../components/ProductGrid';

const ApparelPage: React.FC = () => {
  const { products, loading, error } = useShopifyProducts();
  
  // Filter products for apparel-related items only (exclude music)
  const apparelProducts = products.filter(product => {
    // Handle tags as either array or string
    let tagsString = '';
    if (Array.isArray(product.tags)) {
      tagsString = product.tags.join(' ').toLowerCase();
    } else if (typeof product.tags === 'string') {
      tagsString = product.tags.toLowerCase();
    }
    
    const title = product.title?.toLowerCase() || '';
    const productType = product.productType?.toLowerCase() || '';
    
    // Exclude music-related products
    const isMusicProduct = tagsString.includes('music') || 
                          tagsString.includes('album') || 
                          tagsString.includes('digital') ||
                          tagsString.includes('tape') ||
                          tagsString.includes('cassette') ||
                          title.includes('music');
    
    // Include apparel-related products
    const isApparelProduct = tagsString.includes('apparel') ||
                            tagsString.includes('clothing') ||
                            tagsString.includes('shirt') ||
                            tagsString.includes('hoodie') ||
                            productType.includes('apparel') ||
                            title.includes('shirt') ||
                            title.includes('hoodie');
    
    return !isMusicProduct && (isApparelProduct || (!isMusicProduct && products.length > 0));
  });

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
          <ProductGrid products={apparelProducts} />
        )}
      </div>
    </main>
  );
};

export default ApparelPage;