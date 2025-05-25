import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { Product } from '../data/products';

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProduct = products.find(p => p.handle === handle);
    setProduct(foundProduct || null);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [handle]);

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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image Available</div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">{product.title}</h1>
              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <p className="text-3xl text-purple-400 font-bold">${product.price}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${product.available ? 'text-green-400' : 'text-red-400'}`}>
                    {product.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Description</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {product.available && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Purchase</h3>
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
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-purple-300">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
