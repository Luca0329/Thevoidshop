import React from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import About from '../components/About';
import Newsletter from '../components/Newsletter';

const HomePage: React.FC = () => {
  // Use static products for speed - no API calls needed
  const featuredProducts = products.slice(0, 8);

  return (
    <main>
      <Hero />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">Featured Products</h1>
          <p className="text-gray-400 text-lg">Discover our latest collection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <About />
      <Newsletter />
    </main>
  );
};

export default HomePage;