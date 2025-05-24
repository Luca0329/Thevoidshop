import React from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleBuyNow = () => {
    // Create Shopify buy URL
    const shopifyDomain = import.meta.env.VITE_SHOPIFY_DOMAIN;
    const buyUrl = `https://${shopifyDomain}/products/${product.handle}`;
    
    // Open Shopify product page in new tab
    window.open(buyUrl, '_blank');
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-purple-500/20">
      {/* Product Image */}
      <div className="aspect-square bg-gray-900 relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-purple-400">
            ${product.price}
          </span>
          
          {product.available ? (
            <span className="text-green-400 text-sm">In Stock</span>
          ) : (
            <span className="text-red-400 text-sm">Out of Stock</span>
          )}
        </div>
        
        <button 
          onClick={handleBuyNow}
          className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors duration-200"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;