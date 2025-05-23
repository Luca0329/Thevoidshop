import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disc3, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { VoidShopAPI } from '../services/api';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mysticalStatus, setMysticalStatus] = useState<any>(null);
  const [countdown, setCountdown] = useState<string>('');
  const [moonSign, setMoonSign] = useState<string>('');
  const { state, toggleAdmin } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All', path: '/' },
    { id: 'apparel', label: 'Apparel', path: '/apparel' },
    { id: 'music', label: 'Music', path: '/music' },
    { id: 'accessories', label: 'Accessories', path: '/accessories' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate which zodiac sign the moon is in
  const calculateMoonSign = () => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Simplified moon sign calculation (moon changes signs approximately every 2.5 days)
    const moonCycle = 27.3; // sidereal month
    const signDuration = moonCycle / 12; // ~2.3 days per sign
    
    const signs = [
      { name: 'Aries', symbol: '♈', element: 'fire' },
      { name: 'Taurus', symbol: '♉', element: 'earth' },
      { name: 'Gemini', symbol: '♊', element: 'air' },
      { name: 'Cancer', symbol: '♋', element: 'water' },
      { name: 'Leo', symbol: '♌', element: 'fire' },
      { name: 'Virgo', symbol: '♍', element: 'earth' },
      { name: 'Libra', symbol: '♎', element: 'air' },
      { name: 'Scorpio', symbol: '♏', element: 'water' },
      { name: 'Sagittarius', symbol: '♐', element: 'fire' },
      { name: 'Capricorn', symbol: '♑', element: 'earth' },
      { name: 'Aquarius', symbol: '♒', element: 'air' },
      { name: 'Pisces', symbol: '♓', element: 'water' }
    ];
    
    const currentSignIndex = Math.floor((dayOfYear % moonCycle) / signDuration) % 12;
    return signs[currentSignIndex];
  };

  // Calculate next full moon countdown
  const calculateNextFullMoon = () => {
    const lunarCycle = 29.53058867; // days
    const knownFullMoon = new Date('2024-12-15'); // Reference full moon
    const now = new Date();
    
    // Calculate days since known full moon
    const daysSinceKnown = (now.getTime() - knownFullMoon.getTime()) / (1000 * 60 * 60 * 24);
    
    // Find next full moon
    const cyclesSinceKnown = Math.floor(daysSinceKnown / lunarCycle);
    const nextFullMoon = new Date(knownFullMoon.getTime() + ((cyclesSinceKnown + 1) * lunarCycle * 24 * 60 * 60 * 1000));
    
    // Calculate time remaining
    const timeRemaining = nextFullMoon.getTime() - now.getTime();
    const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (daysLeft > 0) {
      return `${daysLeft}d ${hoursLeft}h`;
    } else {
      return `${hoursLeft}h`;
    }
  };

  useEffect(() => {
    async function fetchMysticalStatus() {
      try {
        const status = await VoidShopAPI.getMysticalStatus();
        setMysticalStatus(status);
      } catch (error) {
        console.error('Failed to fetch mystical status:', error);
      }
    }

    const updateCountdown = () => {
      setCountdown(calculateNextFullMoon());
      const currentSign = calculateMoonSign();
      setMoonSign(`${currentSign.symbol} ${currentSign.name}`);
    };

    fetchMysticalStatus();
    updateCountdown();
    
    const statusInterval = setInterval(fetchMysticalStatus, 5 * 60 * 1000);
    const countdownInterval = setInterval(updateCountdown, 60 * 1000);
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleCartClick = () => {
    // This will be replaced with Shopify's cart URL once integrated
    window.open('https://your-shopify-store.myshopify.com/cart', '_blank');
  };

  const handleProfileClick = () => {
    // This will be replaced with Shopify's customer account URL once integrated
    window.open('https://your-shopify-store.myshopify.com/account', '_blank');
  };

  const getMoonIcon = (phase: string) => {
    switch (phase) {
      case 'new-moon': return '🌑';
      case 'waxing-crescent': return '🌒';
      case 'full-moon': return '🌕';
      case 'waning-crescent': return '🌘';
      default: return '🌙';
    }
  };

  const formatMoonPhase = (phase: string, percentage: number) => {
    const phaseName = phase.replace('-', ' ');
    return `${phaseName} (${percentage}%)`;
  };

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Moon Phase & Sign - Far Left */}
          <div className="flex items-center space-x-3 text-sm min-w-0">
            {mysticalStatus && (
              <>
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{getMoonIcon(mysticalStatus.currentMoonPhase)}</span>
                  <span className="text-purple-300 hidden sm:inline capitalize">
                    {mysticalStatus.moonPhasePercentage 
                      ? formatMoonPhase(mysticalStatus.currentMoonPhase, mysticalStatus.moonPhasePercentage)
                      : mysticalStatus.currentMoonPhase.replace('-', ' ')
                    }
                  </span>
                  {/* Mobile version - just percentage */}
                  <span className="text-purple-300 sm:hidden">
                    {mysticalStatus.moonPhasePercentage}%
                  </span>
                </div>
                
                {/* Moon Sign */}
                {moonSign && (
                  <>
                    <span className="text-purple-500 hidden sm:inline">•</span>
                    <div className="hidden sm:flex items-center space-x-1">
                      <span className="text-purple-400 text-xs">
                        {moonSign}
                      </span>
                    </div>
                  </>
                )}
                
                {/* Full Moon Countdown */}
                {countdown && (
                  <>
                    <span className="text-purple-500 hidden md:inline">•</span>
                    <div className="hidden md:flex items-center space-x-1">
                      <span className="text-purple-400">🌕</span>
                      <span className="text-gray-400 text-xs">in</span>
                      <span className="text-purple-300 text-xs font-mono">
                        {countdown}
                      </span>
                    </div>
                  </>
                )}
                
                <span className="text-purple-500 hidden lg:inline">•</span>
                <span className="text-purple-400 hidden lg:inline text-xs capitalize">
                  {mysticalStatus.mysticalEnergy}
                </span>
              </>
            )}
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Disc3 size={28} className="text-purple-500" />
            <h1 className="text-2xl font-bold text-white tracking-wider">
              THE <span className="text-purple-500">VOID</span> SHOP
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className={`text-base font-medium transition-colors duration-200 hover:text-purple-400 ${
                  location.pathname === category.path ? 'text-purple-500' : 'text-gray-300'
                }`}
              >
                {category.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-6">
            <button 
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200"
              onClick={handleProfileClick}
              title="Customer Account"
            >
              <User size={22} className={state.isAdmin ? "text-green-400" : "text-gray-300"} />
            </button>
            <button 
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 relative"
              onClick={handleCartClick}
              title="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {/* Cart item count will be dynamically updated by Shopify */}
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button 
              className="md:hidden text-gray-300 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-20 left-0 right-0 bg-black bg-opacity-95 shadow-lg transition-all duration-300 ${
          isMenuOpen ? 'max-h-64 py-4' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className={`text-left py-2 text-base font-medium transition-colors duration-200 hover:text-purple-400 ${
                location.pathname === category.path ? 'text-purple-500' : 'text-gray-300'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;