import React from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div style={{ border: '5px solid yellow', padding: '20px', margin: '20px' }}>
      <h1 
        onClick={() => window.location.href = `/product/${product.handle}`}
        style={{ 
          background: 'blue', 
          color: 'white', 
          padding: '20px', 
          cursor: 'pointer',
          fontSize: '20px'
        }}
      >
        CLICK ME TO GO TO: {product.title} - WEBHOOK TEST
      </h1>
      
      <img 
        src={product.image} 
        alt={product.title}
        onClick={() => window.location.href = `/product/${product.handle}`}
        style={{ 
          width: '200px', 
          height: '200px', 
          cursor: 'pointer',
          border: '3px solid green'
        }}
      />
      
      <button 
        onClick={handleAddToCart}
        style={{ background: 'red', color: 'white', padding: '10px' }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;