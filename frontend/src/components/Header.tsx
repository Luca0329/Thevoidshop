import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state } = useAppContext();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Apparel', path: '/apparel' },
    { name: 'Music', path: '/music' },
    { name: 'Accessories', path: '/accessories' }
  ];

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">THE VOID SHOP</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`text-white hover:text-purple-400 transition-colors ${
                  location.pathname === item.path ? 'text-purple-400' : ''
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="text-white hover:text-purple-400 transition-colors relative"
            >
              <ShoppingCart size={24} />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-purple-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;