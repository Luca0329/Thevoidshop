import React from 'react';
import { Product } from '../types';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const featuredProducts = products.filter(product => product.featured);
  
  if (featuredProducts.length === 0) return null;
  
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Featured <span className="text-purple-500">Collections</span>
        </h2>
        <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">
          <span>View all</span>
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.slice(0, 3).map(product => (
          <div key={product.id} className="group relative overflow-hidden bg-gray-900 rounded-lg h-[350px]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-200">
                {product.name}
              </h3>
              <p className="text-gray-300 mb-4 opacity-80 text-sm">{product.description}</p>
              <button className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium text-sm rounded-md hover:bg-purple-700 transition-colors duration-200">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;