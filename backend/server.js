import React, { useState, useEffect } from 'react';
import { VoidShopAPI } from '../services/api';

interface MoonPhaseDisplayProps {
  className?: string;
}

export default function MoonPhaseDisplay({ className = '' }: MoonPhaseDisplayProps) {
  const [mysticalStatus, setMysticalStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeToFullMoon, setTimeToFullMoon] = useState<string>('');
  const [moonPercentage, setMoonPercentage] = useState<number>(0);

  // Calculate moon percentage and phase
  useEffect(() => {
    const calculateMoonData = () => {
      const fullMoonCycle = 29.53059 * 24 * 60 * 60 * 1000; // Accurate lunar cycle
      const referenceNewMoon = new Date('2024-01-11T11:57:00Z'); // January 11, 2024 new moon
      
      const now = new Date();
      const timeSinceReference = now.getTime() - referenceNewMoon.getTime();
      const cyclePosition = (timeSinceReference % fullMoonCycle) / fullMoonCycle;
      
      // Calculate percentage illuminated (0% = new moon, 50% = full moon, 100% = new moon again)
      let illumination;
      if (cyclePosition <= 0.5) {
        // Waxing: 0% to 100%
        illumination = cyclePosition * 200;
      } else {
        // Waning: 100% to 0%
        illumination = (1 - cyclePosition) * 200;
      }
      
      setMoonPercentage(Math.round(illumination));
      
      // Calculate time to next full moon
      let timeToFull;
      if (cyclePosition <= 0.5) {
        // Before full moon
        timeToFull = (0.5 - cyclePosition) * fullMoonCycle;
      } else {
        // After full moon, next cycle
        timeToFull = (1.5 - cyclePosition) * fullMoonCycle;
      }
      
      const days = Math.floor(timeToFull / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeToFull % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeToFull % (1000 * 60 * 60)) / (1000 * 60));
      
      if (Math.abs(cyclePosition - 0.5) < 0.001) {
        setTimeToFullMoon('Full Moon Now! 🌕');
      } else if (days > 0) {
        setTimeToFullMoon(`${days}d ${hours}h to Full Moon`);
      } else if (hours > 0) {
        setTimeToFullMoon(`${hours}h ${minutes}m to Full Moon`);
      } else {
        setTimeToFullMoon(`${minutes}m to Full Moon`);
      }
    };

    calculateMoonData();
    const interval = setInterval(calculateMoonData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch mystical status from API
  useEffect(() => {
    async function fetchMysticalStatus() {
      try {
        const status = await VoidShopAPI.getMysticalStatus();
        if (status) {
          setMysticalStatus(status);
        } else {
          // Fallback mystical status
          setMysticalStatus({
            currentMoonPhase: 'new-moon',
            mysticalEnergy: getMoonConstellation(), // CHANGED: Replace "flowing" here too
            status: 'channeling cosmic energies',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Failed to fetch mystical status:', error);
        // Always show something
        setMysticalStatus({
          currentMoonPhase: 'new-moon',
          mysticalEnergy: getMoonConstellation(), // CHANGED: Replace "flowing" here
          status: 'mystical backup active',
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMysticalStatus();
    const interval = setInterval(fetchMysticalStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate which constellation the moon is in (without astronomy-engine for now)
  const getMoonConstellation = () => {
    // Simple fallback calculation
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const constellationIndex = Math.floor((dayOfYear / 2.5) % 12);
    const constellations = ['Capricorn ♑', 'Aquarius ♒', 'Pisces ♓', 'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐'];
    return constellations[constellationIndex];
  };

  // Get moon icon by phase
  const getMoonIcon = (phase: string) => {
    switch (phase) {
      case 'new-moon': return '🌑';
      case 'waxing-crescent': return '🌒';
      case 'full-moon': return '🌕';
      case 'waning-crescent': return '🌘';
      default: return '🌙';
    }
  };

  // Get moon phase from percentage
  const getMoonPhaseFromPercentage = (percentage: number) => {
    if (percentage < 1) return { phase: 'new-moon', direction: 'new' };
    if (percentage < 25) return { phase: 'waxing-crescent', direction: 'waxing' };
    if (percentage < 75) return { phase: 'first-quarter', direction: 'waxing' };
    if (percentage < 99) return { phase: 'waxing-gibbous', direction: 'waxing' };
    if (percentage >= 99) return { phase: 'full-moon', direction: 'full' };
    if (percentage < 75) return { phase: 'waning-gibbous', direction: 'waning' };
    if (percentage < 25) return { phase: 'last-quarter', direction: 'waning' };
    return { phase: 'waning-crescent', direction: 'waning' };
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-lg animate-pulse">🌙</span>
        <span className="text-purple-300 text-sm">Loading...</span>
      </div>
    );
  }

  const displayStatus = mysticalStatus || {
    currentMoonPhase: 'new-moon',
    mysticalEnergy: getMoonConstellation(), // REPLACED "flowing" with constellation
    status: 'channeling cosmic energies'
  };

  const moonData = getMoonPhaseFromPercentage(moonPercentage);

  return (
    <div className={`flex items-center space-x-4 text-sm ${className}`}>
      {/* Current Moon Phase with Percentage */}
      <div className="flex items-center space-x-1">
        <span className="text-lg">
          {getMoonIcon(displayStatus.currentMoonPhase)}
        </span>
        <div className="flex flex-col">
          <span className="text-purple-300 font-medium text-xs hidden sm:inline">
            {displayStatus.currentMoonPhase.replace('-', ' ')}
          </span>
          <span className="text-purple-400 font-bold text-xs">
            {moonPercentage}% {moonData.direction === 'waxing' ? '↗' : moonData.direction === 'waning' ? '↘' : '●'}
          </span>
        </div>
      </div>

      {/* Full Moon Countdown */}
      <div className="flex items-center space-x-1 bg-purple-900/30 px-2 py-1 rounded">
        <span className="text-yellow-400">🌕</span>
        <span className="text-yellow-300 font-medium text-xs">
          {timeToFullMoon}
        </span>
      </div>

      {/* Mystical Energy - now shows constellation */}
      <div className="flex items-center space-x-1 hidden md:flex">
        <span className="text-purple-400">✨</span>
        <span className="text-purple-400 font-medium capitalize">
          {displayStatus.mysticalEnergy}
        </span>
      </div>
    </div>
  );
}