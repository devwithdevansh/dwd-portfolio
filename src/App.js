import React from 'react';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import ShaderBackground from './components/ShaderBackground';
import SvgMaskText from './components/SvgMaskText';

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

        {/* Temporary Spacer to test scrolling and velocity distortion */}
        <section className="h-[200vh] relative flex items-center justify-center border-t border-gray-800 bg-[#050505] z-10">
          <div className="max-w-4xl px-8 text-center mix-blend-difference">
            <h2 className="text-4xl sm:text-6xl font-bold uppercase mb-8" data-cursor="hover">
              Brutalism & Motion
            </h2>
            <p className="text-xl opacity-70 leading-relaxed">
              When you scroll fast, the WebGL shader in the background distorts based on your scroll velocity. 
              If you are on mobile, tilt your phone to see the gyroscope parallax affect the massive typography above.
            </p>
          </div>
        </section>
        
      </main>
    </SmoothScroll>
  );
}

export default App;
