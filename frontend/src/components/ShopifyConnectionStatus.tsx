import React, { useState, useEffect } from 'react';
import { VoidShopAPI } from '../services/api';

export default function ShopifyConnectionStatus() {
  const [status, setStatus] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const isHealthy = await VoidShopAPI.healthCheck();
        setIsConnected(isHealthy);
        
        if (isHealthy) {
          const mysticalStatus = await VoidShopAPI.getMysticalStatus();
          setStatus(mysticalStatus);
        }
      } catch (error) {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-purple-900/90 text-white p-3 rounded-lg text-sm border border-purple-500/50 backdrop-blur-sm z-50">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <div>
          <div className="font-medium">
            {isConnected ? '🔮 Shopify Backend Active' : '📦 Static Mode'}
          </div>
          {status && (
            <div className="text-xs text-purple-300 mt-1">
              Moon: {status.currentMoonPhase?.replace('-', ' ')} • Energy: {status.mysticalEnergy}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
