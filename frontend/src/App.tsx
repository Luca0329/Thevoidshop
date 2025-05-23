import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import MoonPhaseDisplay from './components/MoonPhaseDisplay';
import HomePage from './pages/HomePage';
import ApparelPage from './pages/ApparelPage';
import MusicPage from './pages/MusicPage';
import AccessoriesPage from './pages/AccessoriesPage';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-black text-white">
          <Header />
          <MoonPhaseDisplay />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/apparel" element={<ApparelPage />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/accessories" element={<AccessoriesPage />} />
          </Routes>

          <Footer />
          <MusicPlayer />
        </div>
      </AppProvider>
    </Router>
  );
}

export default App