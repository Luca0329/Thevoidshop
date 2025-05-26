import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Menu, X, ShoppingCart, Trash2 } from 'lucide-react';
import { formatPrice } from '../data/products';
import MoonPhaseDisplay from './MoonPhaseDisplay';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const { state } = useAppContext();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Apparel', path: '/apparel' },
    { name: 'Music', path: '/music' },
    { name: 'Accessories', path: '/accessories' }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const handleCartUpdate = (event: any) => {
      setCart(event.detail.cart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const removeFromCart = (itemId: string) => {
    const newCart = cart.filter((item: any) => item.id !== itemId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: newCart } }));
  };

  const getTotalItems = () => {
    return cart.reduce((total: number, item: any) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total: number, item: any) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      // Prepare line items for Stripe
      const lineItems = cart.map((item: any) => ({
        price_data: {
          currency: 'dkk', // Using Danish Kroner
          product_data: {
            name: item.product.title,
            description: `Size: ${item.size}`,
            images: item.product.image ? [item.product.image] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to øre (cents)
        },
        quantity: item.quantity,
      }));

      // Call your backend to create checkout session
      const apiUrl = import.meta.env.VITE_API_URL || 'https://thevoidshop-production.up.railway.app';
      const response = await fetch(`${apiUrl}/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: lineItems }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.PNG" alt="The Void Shop Logo" className="h-12 w-12" />
            <span className="text-xl font-bold text-white">THE VOID SHOP</span>
          </a>

          {/* Enhanced Moon Phase Display */}
          <MoonPhaseDisplay className="hidden md:flex" />

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
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-white hover:text-purple-400 transition-colors relative"
              >
                <ShoppingCart size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-4">Shopping Cart</h3>
                    {cart.length === 0 ? (
                      <p className="text-gray-400">Your cart is empty</p>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {cart.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded">
                              <div className="w-12 h-12 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                                {item.product.image ? (
                                  <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-600"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{item.product.title}</p>
                                <p className="text-gray-400 text-xs">Size: {item.size} | Qty: {item.quantity}</p>
                                <p className="text-purple-400 text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-600 pt-3 mt-3">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-white font-bold">Total: {formatPrice(getTotalPrice())}</span>
                          </div>
                          <button 
                            onClick={handleCheckout}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
                          >
                            Checkout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-purple-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`block px-4 py-2 text-white hover:text-purple-400 transition-colors ${
                    location.pathname === item.path ? 'text-purple-400 bg-gray-800' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;