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
    const shopifyDomain = import.meta.env.VITE_SHOPIFY_DOMAIN;
    
    // For multiple items, just redirect to the first product page
    const firstItem = items[0];
    const productUrl = `https://${shopifyDomain}/products/${firstItem.handle}`;
    
    window.open(productUrl, '_blank');
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

        <div className="max-h-64 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Your cart is empty
            </div>
          ) : (            <X size={20} />
            items.map(item => (
              <div key={item.id} className="p-4 border-b border-gray-700 flex items-center gap-3">
                <img 
                  src={item.image}  overflow-y-auto">
                  alt={item.title}ength === 0 ? (
                  className="w-12 h-12 object-cover rounded"v className="p-8 text-center text-gray-400">
                />y
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                  <p className="text-purple-400 font-semibold">${item.price}</p>lassName="p-4 border-b border-gray-700 flex items-center gap-3">
                </div>
src={item.image} 
                <div className="flex items-center gap-2">  alt={item.title}
                  <button ver rounded"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-gray-400 hover:text-white"
                  >lassName="flex-1 min-w-0">
                    <Minus size={16} />                  <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                  </button>bold">${item.price}</p>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-gray-400 hover:text-white"button 
                  >teQuantity(item.id, item.quantity - 1)}
                    <Plus size={16} />me="text-gray-400 hover:text-white"
                  </button>
                </div> size={16} />

                <button tity}</span>
                  onClick={() => removeFromCart(item.id)}button 
                  className="text-red-400 hover:text-red-300"ateQuantity(item.id, item.quantity + 1)}
                >me="text-gray-400 hover:text-white"
                  <X size={16} />
                </button>                    <Plus size={16} />
              </div>on>
            ))
          )}
        </div>button 
removeFromCart(item.id)}
        {items.length > 0 && (me="text-red-400 hover:text-red-300"
          <div className="p-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-3">    <X size={16} />
              <span className="font-bold">Total: ${getTotalPrice().toFixed(2)}</span>    </button>
            </div></div>
            <button             ))
              onClick={handleCheckout}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
            >
              Checkout
            </button>ssName="p-4 border-t border-gray-700">
          </div>ssName="flex justify-between items-center mb-3">
        )}ld">Total: ${getTotalPrice().toFixed(2)}</span>
      </div>
    </>button 
  );{handleCheckout}
};me="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"

export default CartDropdown;    Checkout

export default CartDropdown;
