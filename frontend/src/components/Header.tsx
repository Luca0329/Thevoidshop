import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disc3, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import MoonPhaseDisplay from './MoonPhaseDisplay';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, toggleAdmin } = useAppContext();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All', path: '/' },
    { id: 'apparel', label: 'Apparel', path: '/apparel' },
    { id: 'music', label: 'Music', path: '/music' },
    { id: 'accessories', label: 'Accessories', path: '/accessories' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCartClick = () => {
    // This will be replaced with Shopify's cart URL once integrated
    window.open('https://your-shopify-store.myshopify.com/cart', '_blank');
  };

  const handleProfileClick = () => {
    // This will be replaced with Shopify's customer account URL once integrated
    window.open('https://your-shopify-store.myshopify.com/account', '_blank');
  };

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-purple-400">
            THE VOID SHOP
          </Link>

          {/* Moon Phase Display - Desktop */}
          <div className="hidden md:block">
            <MoonPhaseDisplay />
          </div>

          {/* Desktop Navigation and Cart */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <Link to="/music" className="hover:text-purple-400 transition-colors">Music</Link>
              <Link to="/apparel" className="hover:text-purple-400 transition-colors">Apparel</Link>
              <Link to="/accessories" className="hover:text-purple-400 transition-colors">Accessories</Link>
            </nav>
            
            <div className="relative">
              <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2 pt-4">
              <Link to="/" className="py-2 hover:text-purple-400 transition-colors">Home</Link>
              <Link to="/music" className="py-2 hover:text-purple-400 transition-colors">Music</Link>
              <Link to="/apparel" className="py-2 hover:text-purple-400 transition-colors">Apparel</Link>
              <Link to="/accessories" className="py-2 hover:text-purple-400 transition-colors">Accessories</Link>

              {/* Mobile Cart */}
              <div className="flex items-center justify-between pt-2">
                <span>Cart</span>
                <div className="relative">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;