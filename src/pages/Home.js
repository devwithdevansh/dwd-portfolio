import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ShaderBackground from '../components/ShaderBackground';
import SvgMaskText from '../components/SvgMaskText';
import Projects from '../components/Projects';
import Logo3D from '../components/Logo3D';
import AgencyFooter from '../components/AgencyFooter';

export default function Home() {
  const { location, industry } = useParams();

  // Dynamic SEO Copy Logic
  const displayLocation = location ? location.replace(/-/g, ' ').toUpperCase() : 'THE WORLD';
  const displayIndustry = industry ? industry.replace(/-/g, ' ').toUpperCase() : 'BUSINESSES';

  // Determine the shader theme based on the industry
  const theme = useMemo(() => {
    if (!industry) return 'default';
    const ind = industry.toLowerCase();
    if (ind.includes('jewel') || ind.includes('diamond')) return 'luxury';
    if (ind.includes('hospital') || ind.includes('health')) return 'clinical';
    if (ind.includes('school') || ind.includes('education')) return 'structured';
    return 'default';
  }, [industry]);

  return (
    <>
      <ShaderBackground theme={theme} />
      
      {/* The Dynamic Shader Hero Section */}
      <section className="h-[120vh] relative flex flex-col items-center justify-center">
        
        {/* Interactive 3D Logo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 z-30">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Logo3D />
          </Canvas>
        </div>

        {/* Dynamic Location Title */}
        <SvgMaskText textTop="DOMINATE" textBottom={displayLocation} />
        
        <div className="absolute top-[20%] text-center px-4 mix-blend-difference z-20 pointer-events-none">
          <p className="text-xl sm:text-2xl font-mono uppercase tracking-widest opacity-80">
            Stop losing customers to ugly websites.
          </p>
          <p className="text-md sm:text-lg mt-4 opacity-50 max-w-2xl mx-auto">
            We build bespoke digital experiences that make {displayIndustry} ready to work with us before even talking.
          </p>
        </div>

        <div className="absolute bottom-32 flex flex-col items-center opacity-70 mix-blend-difference z-10 pointer-events-none">
          <span className="uppercase tracking-[0.3em] text-sm mb-4">Scroll to explore</span>
          <div className="w-[1px] h-16 bg-white animate-pulse" />
        </div>
      </section>

      {/* The Projects Section */}
      <Projects />

      {/* Team & Contact Footer */}
      <AgencyFooter />
    </>
  );
}
