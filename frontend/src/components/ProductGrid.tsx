import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, activeCategory }) => {
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-16">
          <p className="text-gray-400 text-lg">
            No products found in this category. Check back later!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;