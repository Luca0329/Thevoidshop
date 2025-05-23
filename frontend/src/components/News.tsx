import React from 'react';
import { NewsItem } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface NewsProps {
  news: NewsItem[];
}

const News: React.FC<NewsProps> = ({ news }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Latest from <span className="text-purple-500">The Void</span>
        </h2>
        <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">
          <span>View all news</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <article 
            key={item.id}
            className="group bg-gray-900 rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className="flex items-center">
                  <User size={14} className="mr-1" />
                  <span>{item.author}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {item.excerpt}
              </p>

              <button className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-200">
                <span>Read more</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default News;