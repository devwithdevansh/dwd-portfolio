import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import Navigation from './Navigation';
import ShaderBackground from './ShaderBackground';
import { INDUSTRY_DATA } from '../data/IndustryData';

import LightMeshBackground from './LightMeshBackground';

export default function Layout({ children }) {
  const location = useLocation();

  const theme = useMemo(() => {
    // If we are on an industry page, pull the theme from the data
    if (location.pathname.startsWith('/industry/')) {
      const industryId = location.pathname.split('/').pop();
      const data = INDUSTRY_DATA[industryId] || INDUSTRY_DATA['enterprise'];
      return data.shaderTheme;
    }
    
    // Core pages themes
    if (location.pathname.startsWith('/work')) return 'default';
    if (location.pathname.startsWith('/services')) return 'structured';
    if (location.pathname.startsWith('/contact')) return 'luxury';
    if (location.pathname.startsWith('/about')) return 'clinical';
    
    // Default theme for Home, etc.
    return 'default';
  }, [location.pathname]);

  return (
    <SmoothScroll>
      <CustomCursor />
      <Navigation />
      
      {/* Backgrounds */}
      <LightMeshBackground />
      <div className="dark:opacity-100 opacity-0 transition-opacity duration-1000 fixed inset-0 z-0 pointer-events-none">
        <ShaderBackground theme={theme} />
      </div>

      <main className="relative min-h-screen bg-transparent text-slate-900 dark:text-[#F3F4F6] cursor-none font-sans overflow-hidden transition-colors duration-1000 z-10">
        {children}
      </main>
    </SmoothScroll>
  );
}
