import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { ArrowRight } from 'lucide-react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';

const NewArrivals: React.FC = () => {
  const { products = [], loading, error } = useShopifyProducts();
  
  const newArrivals = products.slice(0, 4);
  
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Latest <span className="text-purple-500">Arrivals</span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-purple-400 animate-pulse">Summoning new arrivals...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">Error loading products</div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-12">No new arrivals yet.</div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;