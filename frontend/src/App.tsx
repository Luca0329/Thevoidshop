import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import PromoBanner from './components/PromoBanner';
import HomePage from './pages/HomePage';
import ApparelPage from './pages/ApparelPage';
import MusicPage from './pages/MusicPage';
import AccessoriesPage from './pages/AccessoriesPage';
import ProductDetail from './pages/ProductDetail';
import SuccessPage from './pages/SuccessPage';

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
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/success" element={<SuccessPage />} />
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