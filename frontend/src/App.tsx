import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import HomePage from './pages/HomePage';
import ApparelPage from './pages/ApparelPage';
import MusicPage from './pages/MusicPage';
import AccessoriesPage from './pages/AccessoriesPage';

// Simple inline ProductDetail component
const ProductDetailTemp: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Product Detail</h1>
          <h2 className="text-3xl text-purple-400 mb-8">Handle: {handle}</h2>
          <p className="text-xl text-gray-300">Coming Soon - This page is under construction</p>
          <div className="mt-8">
            <a href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded transition-colors">
              Back to Home
            </a>
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
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apparel" element={<ApparelPage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/accessories" element={<AccessoriesPage />} />
              <Route path="/product/:handle" element={<ProductDetailTemp />} />
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