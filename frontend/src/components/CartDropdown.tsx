import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ isOpen, onClose, onMouseEnter, onMouseLeave }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    // Simple redirect to Shopify store for checkout
    const shopifyDomain = import.meta.env.VITE_SHOPIFY_DOMAIN;
    const checkoutUrl = `https://${shopifyDomain}/cart`;
    
    // Add items to Shopify cart URL
    const cartItems = items.map(item => `${item.handle}:${item.quantity}`).join(',');
    const finalUrl = `https://${shopifyDomain}/cart/add?items=${cartItems}`;
    
    window.open(finalUrl, '_blank');
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed top-16 right-4 w-96 max-h-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Your cart is empty
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="p-4 border-b border-gray-700 flex items-center gap-3">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                  <p className="text-purple-400 font-semibold">${item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold">Total: ${getTotalPrice().toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDropdown;
