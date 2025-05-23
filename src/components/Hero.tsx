import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center">
      {/* Background with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg" 
          alt="Concert atmosphere" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-purple-900/20"></div>
        
        {/* Animated fog effect */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 to-transparent animate-pulse"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl relative">
          <div className="absolute -left-4 top-0 w-1 h-32 bg-gradient-to-b from-purple-500 to-transparent"></div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
            Enter <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300">The Void</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
            Where shadows dance with sound, and style emerges from darkness. 
            Discover our collection of underground treasures and forbidden melodies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md flex items-center justify-center space-x-2 transition-all duration-300 transform hover:translate-y-[-2px] relative overflow-hidden">
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button 
              onClick={scrollToAbout}
              className="group px-8 py-4 bg-transparent border border-purple-500 text-purple-400 hover:text-purple-300 font-medium rounded-md transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Descend Deeper</span>
              <div className="absolute inset-0 bg-purple-900/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
          
          {/* Animated runes */}
          <div className="absolute -right-16 top-0 hidden md:block">
            <div className="grid grid-cols-2 gap-4 opacity-20">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 h-4 border border-purple-500 rotate-45 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Animated Scroll Indicator */}
        <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;