import React from 'react';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';
import Navigation from './Navigation';

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navigation />
      <main className="min-h-screen bg-[#050505] text-[#F3F4F6] cursor-none font-sans overflow-hidden">
        {children}
      </main>
    </SmoothScroll>
  );
}
