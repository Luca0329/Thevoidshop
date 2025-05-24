import React from 'react';
import { Disc3, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 pt-16 pb-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Disc3 size={28} className="text-purple-500" />
              <h2 className="text-xl font-bold text-white tracking-wider">
                THE <span className="text-purple-500">VOID</span> SHOP
              </h2>
            </div>
            <p className="text-gray-400 mb-6">
              Your gateway to the underground music scene. Authentic gear for authentic people.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          {/* Shop Column */}
          <div>
            <h3 className="text-white font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Apparel
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Music
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Accessories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>
          
          {/* Info Column */}
          <div>
            <h3 className="text-white font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter Column */}
          <div>
            <h3 className="text-white font-bold mb-4">Join The Void</h3>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive offers, new releases, and underground news.
            </p>
            <div className="flex">
              <input 
                type="email" 
                id="newsletter-email"
                name="email"
                placeholder="Your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md transition-colors duration-200">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6">
          <p className="text-gray-500 text-center">
            © {new Date().getFullYear()} The Void Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;