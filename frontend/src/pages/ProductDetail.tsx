import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchShopifyProducts } from '../services/api';
import { Product } from '../types';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchShopifyProducts(50); // Load more products to find the one we need
        const foundProduct = products.find(p => p.handle === handle);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      loadProduct();
    }

    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [handle]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      alert(`${quantity} x ${product.title} added to cart!`);
    }
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
          <button 
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Product Title - Header */}
        <div className="text-center mb-12 border-b border-gray-700 pb-8">
          <h1 className="text-5xl font-bold mb-4 text-white">{product.title}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {/* Placeholder gallery items - you can expand this when you have multiple images */}
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="aspect-square bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={`${product.title} view ${index}`}
                      className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <span className="text-xs">View {index}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-8">
            {/* Price and Availability */}
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-3xl text-purple-400 font-bold">${product.price}</p>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${product.available ? 'text-green-400' : 'text-red-400'}`}>
                  {product.available ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Description</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            {product.available && (
              <div className="space-y-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div>
                  <label className="block text-lg font-semibold mb-4 text-purple-300">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors border border-gray-600"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors border border-gray-600"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 font-bold text-lg border-2 border-purple-500 hover:border-purple-400"
                >
                  <ShoppingCart size={24} />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-purple-300 font-semibold mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!product.available && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <p className="text-red-300 text-lg font-medium">This product is currently out of stock.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
