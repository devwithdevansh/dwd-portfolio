import React from 'react';

export default function TechnicalGridBackground({ globalTheme }) {
  const isLight = globalTheme === 'light';
  
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${isLight ? 'opacity-100' : 'opacity-20'}`}>
      
      {/* Precision Blueprint Grid */}
      <div 
        className={`absolute inset-0 opacity-[0.4] pointer-events-none ${isLight ? 'mix-blend-multiply' : 'mix-blend-screen'}`}
        style={{ 
          backgroundImage: isLight 
            ? `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1.5' fill='%230f172a' fill-opacity='0.3'/%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0V0zm1 1h98v98H1V1z' fill='%231e293b' fill-opacity='0' fill-rule='evenodd'/%3E%3Cpath d='M0 50h100M50 0v100' stroke='%23334155' stroke-width='0.5'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Cinematic noise overlay for editorial film grain feel */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
    </div>
  );
}
