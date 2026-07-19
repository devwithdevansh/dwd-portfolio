import React from 'react';
import SmoothScroll from './SmoothScroll';
import CustomCursor from './CustomCursor';

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      <main className="min-h-screen bg-[#050505] text-[#F3F4F6] cursor-none font-sans overflow-hidden">
        {children}
      </main>
    </SmoothScroll>
  );
}
