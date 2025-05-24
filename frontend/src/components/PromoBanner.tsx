import React from 'react';

const PromoBanner: React.FC = () => {
  return (
    <div className="w-full bg-red-900/20 backdrop-blur-sm border-y border-red-500/30 py-1 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-red-400/80 font-bold text-base tracking-wider uppercase">
          🔥 SCEPTER'S "DRUNKEN MESSIAH" OUT NOW • AVAILABLE ON TAPE OR DIGITAL • 🔥 SCEPTER'S "DRUNKEN MESSIAH" OUT NOW • AVAILABLE ON TAPE OR DIGITAL • 
        </span>
      </div>
    </div>
  );
};

export { PromoBanner };
export default PromoBanner;
