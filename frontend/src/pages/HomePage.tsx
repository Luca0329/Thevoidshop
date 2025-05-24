import React from 'react';
import { useShopifyProducts } from '../hooks/useShopifyProducts';
import ProductGrid from '../components/ProductGrid';
import PromoBanner from '../components/PromoBanner';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import NewArrivals from '../components/NewArrivals';
import About from '../components/About';
import Newsletter from '../components/Newsletter';

const HomePage: React.FC = () => {
  const { products = [], loading, error } = useShopifyProducts();

  // Get latest arrivals (newest products)
  const latestArrivals = products.slice(0, 4);

  return (
    <main>
      <PromoBanner />
      <Hero />
      
      {/* Update existing NewArrivals to use Shopify products */}
      <NewArrivals />
      
      {/* Keep all original sections */}
      <FeaturedProducts />
      <About />
      <Newsletter />
    </main>
  );
};

export default HomePage;