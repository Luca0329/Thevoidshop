import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../data/products';

interface ProductCardProps {
  product: any; // Accept both old and new product formats
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
      <div className="aspect-square bg-gray-900 relative overflow-hidden group">
        {product.image2 ? (
          <>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:opacity-0"
            />
            <img
              src={product.image2}
              alt={product.title}
              className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-semibold text-purple-400">
            {formatPrice(product.price)}
          </span>
          
          {product.available ? (
            <span className="text-green-400 text-sm">In Stock</span>
          ) : (
            <span className="text-red-400 text-sm">Out of Stock</span>
          )}
        </div>
        
        {/* Action Buttons */}
        {product.available && (
          <div onClick={(e) => e.stopPropagation()} className="space-y-2">
            {/* Add to Cart Button */}
            <button 
              onClick={() => {
                // Simple cart functionality
                alert(`${product.title} added to cart!`);
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            
            {/* Stripe Buy Button */}
            <div 
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;