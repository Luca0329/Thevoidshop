import React from 'react';
import { Product } from '../data/products';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleCardClick = () => {
    window.location.href = `/product/${product.handle}`;
  };

  return (
    <div 
      onClick={handleCardClick}
      className="cursor-pointer block bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-purple-500/20 group"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-900 relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-semibold text-purple-400">
            ${product.price}
          </span>
          
          {product.available ? (
            <span className="text-green-400 text-sm">In Stock</span>
          ) : (
            <span className="text-red-400 text-sm">Out of Stock</span>
          )}
        </div>
        
        {/* Stripe Buy Button */}
        {product.available && (
          <div 
            onClick={(e) => e.stopPropagation()}
            dangerouslySetInnerHTML={{
              __html: `
                <stripe-buy-button
                  buy-button-id="${product.stripeBuyButtonId}"
                  publishable-key="${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}"
                >
                </stripe-buy-button>
              `
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;