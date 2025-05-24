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

  const handleCheckout = async () => {
    alert('Checkout button clicked!');
    console.log('🛒 Starting checkout with items:', items);
    
    try {
      const shopifyDomain = import.meta.env.VITE_SHOPIFY_DOMAIN;
      const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
      
      console.log('🛒 Shopify domain:', shopifyDomain);
      console.log('🛒 Token exists:', !!storefrontToken);
      
      const checkoutMutation = `
        mutation checkoutCreate($input: CheckoutCreateInput!) {
          checkoutCreate(input: $input) {
            checkout {
              id
              webUrl
            }
            checkoutUserErrors {
              field
              message
            }
          }
        }
      `;
      
      const lineItems = items.map(item => ({
        variantId: item.id,
        quantity: item.quantity
      }));
      
      console.log('🛒 Line items:', lineItems);

      const response = await fetch(`https://${shopifyDomain}/api/2023-10/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({
          query: checkoutMutation,
          variables: {
            input: { lineItems }
          }
        })
      });

      console.log('🛒 Response status:', response.status);
      const data = await response.json();
      console.log('🛒 Response data:', data);
      
      if (data.data?.checkoutCreate?.checkout) {
        console.log('🛒 Checkout URL:', data.data.checkoutCreate.checkout.webUrl);
        window.open(data.data.checkoutCreate.checkout.webUrl, '_blank');
        clearCart();
        onClose();
      } else {
        console.error('🛒 Checkout creation failed:', data.data?.checkoutCreate?.checkoutUserErrors);
        alert('Checkout failed. Check console for details.');
      }
    } catch (error) {
      console.error('🛒 Checkout error:', error);
      alert('Unable to process checkout. Please try again.');
    }
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
