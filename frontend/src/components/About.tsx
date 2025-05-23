import React from 'react';
import { Music, Headphones, ShoppingBag } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Music className="text-purple-500" size={28} />,
      title: "Underground Sound",
      description: "Curated collection of music from emerging underground artists across multiple alternative genres."
    },
    {
      icon: <Headphones className="text-purple-500" size={28} />,
      title: "Authentic Culture",
      description: "More than merchandise - we represent the true spirit of alternative music culture and lifestyle."
    },
    {
      icon: <ShoppingBag className="text-purple-500" size={28} />,
      title: "Exclusive Merch",
      description: "Limited edition products designed in collaboration with artists from the underground scene."
    }
  ];
  
  return (
    <section id="about-section" className="container mx-auto px-4 py-16 scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          About <span className="text-purple-500">The Void</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Founded by music enthusiasts with deep roots in the underground scene, 
          The Void Shop bridges the gap between alternative culture and quality merchandise.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-gray-900 p-6 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:translate-y-[-4px]"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-900 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-gray-900 rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-10">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Our Story</h3>
            <p className="text-gray-400 mb-4">
              Born from late-night conversations at underground shows, The Void Shop 
              emerged as a response to the commercialization of alternative culture.
            </p>
            <p className="text-gray-400">
              We believe in authenticity, supporting emerging artists, and building a 
              community where the true spirit of underground music thrives. Every product 
              we offer is carefully selected to represent this ethos.
            </p>
          </div>
          <div className="h-full min-h-[300px]">
            <img 
              src="https://images.pexels.com/photos/3060324/pexels-photo-3060324.jpeg"
              alt="Underground concert" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;