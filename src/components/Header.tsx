import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disc3, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state, toggleAdmin } = useAppContext();
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black bg-opacity-90 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Disc3 size={28} className="text-purple-500" />
            <h1 className="text-2xl font-bold text-white tracking-wider">
              THE <span className="text-purple-500">VOID</span> SHOP
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className={`text-base font-medium transition-colors duration-200 hover:text-purple-400 ${
                  location.pathname === category.path ? 'text-purple-500' : 'text-gray-300'
                }`}
              >
                {category.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-6">
            <button 
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
              onClick={handleProfileClick}
              title="Customer Account"
            >
              <User size={22} className={state.isAdmin ? "text-green-400" : "text-gray-300"} />
            </button>
            <button 
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 relative"
              onClick={handleCartClick}
              title="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {/* Cart item count will be dynamically updated by Shopify */}
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button 
              className="md:hidden text-gray-300 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-20 left-0 right-0 bg-black bg-opacity-95 shadow-lg transition-all duration-300 ${
          isMenuOpen ? 'max-h-64 py-4' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className={`text-left py-2 text-base font-medium transition-colors duration-200 hover:text-purple-400 ${
                location.pathname === category.path ? 'text-purple-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;