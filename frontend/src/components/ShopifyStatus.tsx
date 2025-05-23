import React, { useState, useEffect } from 'react';
import { VoidShopAPI } from '../services/api';

export default function ShopifyStatus() {
  const [status, setStatus] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const isHealthy = await VoidShopAPI.healthCheck();
      setIsConnected(isHealthy);
      
      if (isHealthy) {
        const mysticalStatus = await VoidShopAPI.getMysticalStatus();
        setStatus(mysticalStatus);
      }
    }
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-purple-900/90 text-white p-3 rounded-lg text-sm border border-purple-500/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <div>
          <div className="font-medium">
            {isConnected ? '🔮 Shopify Connected' : '📦 Static Mode'}
          </div>
          {status && (
            <div className="text-xs text-purple-300">
              {status.currentMoonPhase} • {status.mysticalEnergy}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
