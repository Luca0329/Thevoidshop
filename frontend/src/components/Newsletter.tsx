import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative overflow-hidden bg-gray-900 rounded-lg">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <img 
            src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg" 
            alt="Background texture" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 px-6 py-12 md:p-16 flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join the <span className="text-purple-500">Underground</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mb-8">
            Subscribe to our newsletter for exclusive drops, artist collaborations, 
            and early access to limited edition merch. Step into the void and never miss a beat.
          </p>
          
          <form className="max-w-md mx-auto flex gap-4">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="flex-1 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Join
            </button>
          </form>
          
          <p className="text-gray-500 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;