import React from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative overflow-hidden bg-gray-900 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:translate-y-[-4px]">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      {(product.featured || product.new) && (
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
          product.new ? 'bg-green-500 text-black' : 'bg-purple-600 text-white'
        }`}>
          {product.new ? 'NEW' : 'FEATURED'}
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 transition-colors duration-200 group-hover:text-purple-400">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-white font-bold">${product.price.toFixed(2)}</span>
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-105">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;