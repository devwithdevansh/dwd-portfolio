import React from 'react';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import ShaderBackground from './components/ShaderBackground';
import SvgMaskText from './components/SvgMaskText';
import Projects from './components/Projects';

function App() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <ShaderBackground />
      
      {/* 
        Global Layout Wrapper 
        Cursor disappears natively so our custom cursor shines.
      */}
      <main className="min-h-screen bg-[#050505] text-[#F3F4F6] cursor-none font-sans overflow-hidden">
        
        {/* The Shader Hero Section */}
        <section className="h-[120vh] relative flex flex-col items-center justify-center">
          <SvgMaskText textTop="Creative" textBottom="Developer" />
          
          <div className="absolute bottom-32 flex flex-col items-center opacity-70 mix-blend-difference z-10 pointer-events-none">
            <span className="uppercase tracking-[0.3em] text-sm mb-4">Scroll to explore</span>
            <div className="w-[1px] h-16 bg-white animate-pulse" />
          </div>
        </section>

        {/* The Projects Section */}
        <Projects />
        
      </main>
    </SmoothScroll>
  );
}

export default App;
