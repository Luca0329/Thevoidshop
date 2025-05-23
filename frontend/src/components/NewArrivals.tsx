import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';

interface NewArrivalsProps {
  products: Product[];
}

const NewArrivals: React.FC<NewArrivalsProps> = ({ products }) => {
  const newProducts = products.filter(product => product.new);
  
  if (newProducts.length === 0) return null;
  
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          New <span className="text-green-500">Arrivals</span>
        </h2>
        <button className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors duration-200">
          <span>View all</span>
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;