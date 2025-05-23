import React from 'react';
import { products } from '../data/products';
import ProductGrid from '../components/ProductGrid';

const ApparelPage: React.FC = () => {
  return (
    <main className="pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Alternative <span className="text-purple-500">Apparel</span>
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Express your underground spirit with our curated collection of alternative apparel. 
          Each piece is designed to embody the essence of counter-culture while maintaining 
          premium quality and comfort.
        </p>
        <ProductGrid products={products} activeCategory="apparel" />
      </div>
    </main>
  );
};

export default ApparelPage;