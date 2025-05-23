import React from 'react';
import { products } from '../data/products';
import ProductGrid from '../components/ProductGrid';

const MusicPage: React.FC = () => {
  return (
    <main className="pt-24">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Underground <span className="text-purple-500">Music</span>
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Dive into our collection of underground and alternative music. From limited edition 
          vinyl pressings to exclusive digital releases, discover the sound of the void.
        </p>
        <ProductGrid products={products} activeCategory="music" />
      </div>
    </main>
  );
};

export default MusicPage;