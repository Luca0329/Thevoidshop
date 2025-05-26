import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { products, formatPrice } from '../data/products';
import { Product } from '../data/products';

// Simple cart hook with proper event handling
const useCart = () => {
  const addToCart = (product: Product, quantity: number, size: string) => {
    const newItem = {
      id: `${product.handle}-${size}`,
      product,
      quantity,
      size
    };
    
    const savedCart = localStorage.getItem('cart');
    const currentCart = savedCart ? JSON.parse(savedCart) : [];
    
    const existing = currentCart.find((item: any) => item.id === newItem.id);
    let newCart;
    
    if (existing) {
      newCart = currentCart.map((item: any) => 
        item.id === newItem.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...currentCart, newItem];
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Dispatch custom event to notify header
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { cart: newCart } 
    }));
  };

  return { addToCart };
};

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = products.find(p => p.handle === handle);
    setProduct(foundProduct || null);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [handle]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const getTotalPrice = () => {
    return product ? product.price * quantity : 0;
  };

  const getRecommendedProducts = () => {
    return products
      .filter(p => p.handle !== product?.handle && p.available)
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <a href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors">
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <a href="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors">
          ← Back to Shop
        </a>

        {/* Title Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">{product.title}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
              )}
            </div>
            
            {product.description && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Description</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <p className="text-3xl text-purple-400 font-bold">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${product.available ? 'text-green-400' : 'text-red-400'}`}>
                    {product.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {product.available && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Purchase</h3>
                
                {/* Size Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:border-purple-400"
                  >
                    <option value="">Select a size</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!selectedSize) {
                      alert('Please select a size');
                      return;
                    }
                    if (product) {
                      addToCart(product, quantity, selectedSize);
                      alert(`${quantity}x ${product.title} (Size: ${selectedSize}) added to cart!`);
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded mb-4 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <div className="border-t border-gray-700 pt-4">
                  {/* Stripe Buy Button */}
                  <div 
                    dangerouslySetInnerHTML={{
                      __html: `
                        <stripe-buy-button
                          buy-button-id="${product.stripeBuyButtonId}"
                          publishable-key="${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}"
                        >
                        </stripe-buy-button>
                      `
                    }}
                  />
                  
                  {/* Fallback Buy Button */}
                  <button 
                    onClick={() => {
                      if (!selectedSize) {
                        alert('Please select a size');
                        return;
                      }
                      window.open(`https://checkout.stripe.com/c/pay/${product.stripeBuyButtonId}`, '_blank');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-2 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Recommended Products */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-purple-300">You might also like</h3>
              <div className="space-y-4">
                {getRecommendedProducts().map((recommendedProduct) => (
                  <div key={recommendedProduct.handle} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-purple-400 transition-colors">
                    <div className="w-16 h-16 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                      {recommendedProduct.image ? (
                        <img src={recommendedProduct.image} alt={recommendedProduct.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{recommendedProduct.title}</h4>
                      <p className="text-purple-400 font-bold">{formatPrice(recommendedProduct.price)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(recommendedProduct, 1, 'M');
                        alert(`${recommendedProduct.title} (Size: M) added to cart!`);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                    >
                      <ShoppingCart size={12} />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
