import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  handle: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
        handle: product.handle
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const checkout = async () => {
    try {
      console.log('🛒 Starting checkout with items:', items);
      
      if (items.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://thevoidshop-production.up.railway.app';
      console.log('🛒 Using API URL:', apiUrl);
      
      // Test backend connection first
      console.log('🛒 Testing backend connection...');
      const healthCheck = await fetch(`${apiUrl}/health`);
      console.log('🛒 Health check status:', healthCheck.status);
      
      const checkoutData = {
        items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity || 1,
        })),
      };
      
      console.log('🛒 Sending checkout data:', JSON.stringify(checkoutData, null, 2));
      
      const response = await fetch(`${apiUrl}/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      console.log('🛒 Response status:', response.status);
      console.log('🛒 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('🛒 Raw response:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }
      
      const responseData = JSON.parse(responseText);
      console.log('🛒 Parsed response:', responseData);
      
      if (responseData.url) {
        console.log('🛒 Redirecting to Stripe:', responseData.url);
        window.location.href = responseData.url;
      } else {
        throw new Error('No checkout URL received from Stripe');
      }
    } catch (error) {
      console.error('🛒 Checkout error details:', error);
      alert(`Checkout failed: ${error.message}`);
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
