import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('🎯 Card clicked!', product.handle);
    console.log('🎯 Event target:', e.target);
    
    // Build the URL directly without eval() or string construction
    const productUrl = `/product/${product.handle}`;
    console.log('🎯 Opening URL:', productUrl);
    
    try {
      // Open in new window/tab - CSP compliant approach
      const newWindow = window.open(productUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        console.log('🎯 New window opened successfully');
      } else {
        console.log('🎯 Popup blocked, using same window navigation');
        navigate(productUrl);
      }
    } catch (error) {
      console.error('🎯 Window opening failed:', error);
      // Fallback to same-window navigation
      navigate(productUrl);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      onMouseDown={() => console.log('🎯 Mouse down on card')}
      onMouseUp={() => console.log('🎯 Mouse up on card')}
      style={{ pointerEvents: 'auto' }}
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
        
        <button 
          onClick={handleAddToCart}
          disabled={!product.available}
          className={`w-full py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center gap-2 ${
            product.available 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          {product.available ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;