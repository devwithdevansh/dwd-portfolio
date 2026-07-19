import React from 'react';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <SmoothScroll>
      <CustomCursor />
      
      {/* 
        Global Layout Wrapper 
        We use a very dark charcoal background (#050505) to give that raw brutalist feel.
        Cursor disappears natively so our custom cursor shines.
      */}
      <main className="min-h-screen bg-[#050505] text-[#F3F4F6] cursor-none font-sans overflow-hidden">
        
        {/* Temporary Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center relative">
          <h1 className="text-[10vw] font-black tracking-tighter leading-none uppercase mix-blend-difference z-10" data-cursor="hover">
            Creative
          </h1>
          <h1 className="text-[10vw] font-black tracking-tighter leading-none uppercase mix-blend-difference z-10 text-[#EAB308]" data-cursor="hover">
            Developer
          </h1>
          
          <p className="mt-8 text-xl max-w-md text-center opacity-70 z-10">
            Phase 1 Foundation complete. Scroll down to test the momentum scroll.
          </p>
        </section>

        {/* Temporary Spacer to test scrolling */}
        <section className="h-screen flex items-center justify-center border-t border-gray-800">
          <h2 className="text-4xl font-bold uppercase" data-cursor="hover">
            More content coming soon
          </h2>
        </section>
        
      </main>
    </SmoothScroll>
  );
}

export default App;
