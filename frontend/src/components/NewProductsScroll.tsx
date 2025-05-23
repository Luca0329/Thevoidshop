import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface NewProductsScrollProps {
  products: Product[];
}

const NewProductsScroll: React.FC<NewProductsScrollProps> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const newProducts = products.filter(product => product.new);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (newProducts.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-b from-black to-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Latest <span className="text-purple-500">Arrivals</span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 px-4 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newProducts.map(product => (
            <div
              key={product.id}
              className="flex-none w-[300px] snap-start group"
            >
              <div className="bg-gray-900 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <span className="px-2 py-1 bg-purple-500 text-xs font-bold text-white rounded-full">
                      NEW
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProductsScroll;