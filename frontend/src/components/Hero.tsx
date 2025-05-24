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
          <div className="text-left space-y-12">
            <h1 className="text-6xl md:text-7xl font-bold tracking-wider text-left">
              <div className="flex flex-col leading-tight items-start">
                <span className="text-white">ENTER</span>
                <span className="text-purple-400">THE VOID</span>
              </div>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
              Where shadows dance with sound, and style emerges from darkness. 
              Discover our collection of underground treasures and forbidden melodies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-start items-start pt-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-purple-500/50">
                Shop Now
              </button>
              <button className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-300">
                Explore Collection
              </button>
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