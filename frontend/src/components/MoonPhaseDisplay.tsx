import React, { useState, useEffect } from 'react';
import { VoidShopAPI } from '../services/api';

interface MoonPhaseDisplayProps {
  className?: string;
}

export default function MoonPhaseDisplay({ className = '' }: MoonPhaseDisplayProps) {
  const [mysticalStatus, setMysticalStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMysticalStatus() {
      try {
        const status = await VoidShopAPI.getMysticalStatus();
        setMysticalStatus(status);
      } catch (error) {
        console.error('Failed to fetch mystical status:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMysticalStatus();
    // Update every 5 minutes
    const interval = setInterval(fetchMysticalStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getMoonIcon = (phase: string) => {
    switch (phase) {
      case 'new-moon': return '🌑';
      case 'waxing-crescent': return '🌒';
      case 'full-moon': return '🌕';
      case 'waning-crescent': return '🌘';
      default: return '🌙';
    }
  };

  const getMoonName = (phase: string) => {
    switch (phase) {
      case 'new-moon': return 'New Moon';
      case 'waxing-crescent': return 'Waxing Crescent';
      case 'full-moon': return 'Full Moon';
      case 'waning-crescent': return 'Waning Crescent';
      default: return 'Unknown Phase';
    }
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'flowing': return 'text-purple-400';
      case 'surging': return 'text-blue-400';
      case 'stable': return 'text-green-400';
      case 'chaotic': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-purple-900/30 to-black/30 border-b border-purple-500/20 ${className}`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-purple-400">
              🌙 Channeling cosmic energies...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mysticalStatus) return null;

  return (
    <div className={`bg-gradient-to-r from-purple-900/30 to-black/30 border-b border-purple-500/20 backdrop-blur-sm ${className}`}>
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border-b border-red-500/30 overflow-hidden">
        <div className="whitespace-nowrap">
          <div className="inline-block animate-scroll">
            <span className="text-red-400 font-bold text-sm px-8">
              🔥 SCEPTER'S "DRUNKEN MESSIAH" OUT NOW! 🔥 
            </span>
            <span className="text-purple-300 text-sm px-8">
              Available in vinyl, digital, and limited edition variants 
            </span>
            <span className="text-red-400 font-bold text-sm px-8">
              🔥 SCEPTER'S "DRUNKEN MESSIAH" OUT NOW! 🔥 
            </span>
            <span className="text-purple-300 text-sm px-8">
              Available in vinyl, digital, and limited edition variants 
            </span>
          </div>
        </div>
      </div>

      {/* Moon Phase Display */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-6 text-sm">
          {mysticalStatus && (
            <>
              {/* Moon Phase */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {getMoonIcon(mysticalStatus.currentMoonPhase)}
                </span>
                <div>
                  <span className="text-purple-300 font-medium">
                    {mysticalStatus.currentMoonPhase.replace('-', ' ')}
                    {mysticalStatus.moonPhasePercentage && ` (${mysticalStatus.moonPhasePercentage}%)`}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-purple-500/30"></div>

              {/* Mystical Energy */}
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">✨</span>
                <span className="text-gray-300">Energy:</span>
                <span className="text-purple-400 font-medium capitalize">
                  {mysticalStatus.mysticalEnergy}
                </span>
              </div>

              {/* Divider */}
              <div className="h-4 w-px bg-purple-500/30"></div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">🔮</span>
                <span className="text-gray-300 hidden sm:inline">Status:</span>
                <span className="text-purple-300 font-medium capitalize">
                  {mysticalStatus.status}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
