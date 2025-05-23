import React from 'react';
import { products } from '../data/products';
import ProductGrid from '../components/ProductGrid';

const AccessoriesPage: React.FC = () => {
  return (
    <main className="pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Alternative <span className="text-purple-500">Accessories</span>
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Complete your look with our selection of underground-inspired accessories. 
          From patches and pins to unique collectibles, find the perfect pieces to 
          express your alternative style.
        </p>
        <ProductGrid products={products} activeCategory="accessories" />
      </div>
    </main>
  );
};

export default AccessoriesPage;