import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { useCart } from './context/CartContext';
import { fetchShopifyProducts } from './services/api';
import Header from './components/Header';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import PromoBanner from './components/PromoBanner';
import HomePage from './pages/HomePage';
import ApparelPage from './pages/ApparelPage';
import MusicPage from './pages/MusicPage';
import AccessoriesPage from './pages/AccessoriesPage';

// Full ProductDetail component inline
const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchShopifyProducts(50);
        const foundProduct = products.find((p: any) => p.handle === handle);
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
          ← Back
        </a>

        <div className="text-center mb-12 border-b border-gray-700 pb-8">
          <h1 className="text-5xl font-bold mb-4 text-white">{product.title}</h1>
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
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-3xl text-purple-400 font-bold">${product.price}</p>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-medium ${product.available ? 'text-green-400' : 'text-red-400'}`}>
                  {product.available ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.description && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Description</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {product.available && (
              <div className="space-y-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div>
                  <label className="block text-lg font-semibold mb-4 text-purple-300">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors border border-gray-600">
                      -
                    </button>
                    <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors border border-gray-600">
                      +
                    </button>
                  </div>
                </div>

                <button onClick={handleAddToCart} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 font-bold text-lg border-2 border-purple-500 hover:border-purple-400">
                  🛒 Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  console.log('🌙 App component rendering...');
  
  return (
    <Router>
      <AppProvider>
        <CartProvider>
          <div className="min-h-screen bg-black text-white">
            <PromoBanner />
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apparel" element={<ApparelPage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/accessories" element={<AccessoriesPage />} />
              <Route path="/product/:handle" element={<ProductDetailPage />} />
              {/* <Route path="/success" element={<SuccessPage />} /> */}
            </Routes>
            <Footer />
            <MusicPlayer />
          </div>
        </CartProvider>
      </AppProvider>
    </Router>
  );
}

export default App;