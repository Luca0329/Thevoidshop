import React from 'react';
import Hero from '../components/Hero';
import News from '../components/News';
import NewProductsScroll from '../components/NewProductsScroll';
import FeaturedProducts from '../components/FeaturedProducts';
import NewArrivals from '../components/NewArrivals';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import About from '../components/About';
import Events from '../components/Events';
import { products } from '../data/products';
import { events } from '../data/events';
import { news } from '../data/news';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <News news={news} />
      <NewProductsScroll products={products} />
      <FeaturedProducts products={products} />
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Shop <span className="text-purple-500">Collection</span>
        </h2>
        <ProductGrid products={products} activeCategory="all" />
      </section>
      <Events events={events} />
      <About />
      <Newsletter />
    </main>
  );
};

export default HomePage;