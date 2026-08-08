import React, { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import SvgMaskText from '../components/SvgMaskText';
import Logo3D from '../components/Logo3D';
import CypherText from '../components/CypherText';
import IndustryMatrix from '../components/IndustryMatrix';
import ProofMarquee from '../components/ProofMarquee';
import AgencyFooter from '../components/AgencyFooter';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  const { location } = useParams();
  
  // Create a memoized, formatted location string
  const displayLocation = useMemo(() => {
    if (!location) return "ENGINEERS";
    return location.toUpperCase();
  }, [location]);

  // Framer Motion for Kinetic Scroll
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });
  
  const textX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const textX2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
  const textX3 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen bg-transparent transition-colors duration-1000"
    >
      {/* The Dynamic Shader Hero Section */}
      <section className="h-[120vh] relative flex flex-col items-center justify-center">
        
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-48 h-48 z-30 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <React.Suspense fallback={null}>
              <Logo3D />
            </React.Suspense>
          </Canvas>
        </div>

        {/* Dynamic Location Title */}
        <div className="transition-all duration-1000">
          <SvgMaskText textTop="BUSINESS EXPERIENCE" textBottom={displayLocation} />
        </div>
        
        <div className="absolute bottom-10 left-10 md:left-20 z-20 pointer-events-none">
          <p className="text-sm md:text-base font-mono opacity-60 max-w-md uppercase tracking-widest leading-loose text-slate-900 dark:text-white transition-colors duration-1000">
            This is not a portfolio. <br />
            This is your first business consultation. <br />
            Every morning, millions of shutters open. How many truly grow?
          </p>
        </div>
      </section>

      <ProofMarquee />

      {/* The Industry Selector Matrix */}
      <IndustryMatrix />

      {/* Kinetic Typography Scroll Section (The Constitution) */}
      <section ref={scrollRef} className="py-40 overflow-hidden z-20 relative bg-white/5 dark:bg-black/5 backdrop-blur-sm">
        
        {/* First Kinetic Line */}
        <motion.div style={{ x: textX1 }} className="whitespace-nowrap mb-12">
          <h2 className="text-[12vw] font-black uppercase tracking-tighter leading-none text-transparent [-webkit-text-stroke:2px_#0f172a] dark:[-webkit-text-stroke:2px_#EAB308] transition-colors duration-1000">
            <CypherText text="WE DO NOT BUILD WEBSITES." speed={10} /> <span className="text-slate-900 dark:text-white"><CypherText text="WE DO NOT BUILD WEBSITES." speed={10} /></span>
          </h2>
        </motion.div>
        
        {/* Second Kinetic Line */}
        <motion.div style={{ x: textX2 }} className="whitespace-nowrap mb-12">
          <h2 className="text-[12vw] font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-white transition-colors duration-1000">
            <CypherText text="WE ENGINEER INVISIBLE SYSTEMS." speed={10} /> <span className="text-transparent [-webkit-text-stroke:2px_#0f172a] dark:[-webkit-text-stroke:2px_#06B6D4]"><CypherText text="WE ENGINEER INVISIBLE SYSTEMS." speed={10} /></span>
          </h2>
        </motion.div>

        {/* Third Kinetic Line */}
        <motion.div style={{ x: textX3 }} className="whitespace-nowrap">
          <h2 className="text-[12vw] font-black uppercase tracking-tighter leading-none text-transparent [-webkit-text-stroke:2px_#0f172a] dark:[-webkit-text-stroke:2px_#EC4899] transition-colors duration-1000">
            <CypherText text="BUSINESS FIRST. TECHNOLOGY SECOND." speed={10} /> <span className="text-slate-900 dark:text-white"><CypherText text="BUSINESS FIRST. TECHNOLOGY SECOND." speed={10} /></span>
          </h2>
        </motion.div>
        
      </section>

      {/* Brutalist Tech Stack Ticker */}
      <section className="py-20 border-t border-b border-slate-200/20 dark:border-gray-800/50 bg-white/50 dark:bg-[#050505]/50 overflow-hidden whitespace-nowrap flex transition-colors duration-1000 backdrop-blur-md">
        <div className="animate-[spin_20s_linear_infinite] [animation-direction:reverse] flex w-[200%] gap-8">
           <span className="text-4xl font-mono opacity-30 tracking-[0.5em] text-slate-900 dark:text-white">REACT // THREE.JS // MAKE.COM // NODE.JS // AWS // FRAMER MOTION // SHOPIFY //</span>
           <span className="text-4xl font-mono opacity-30 tracking-[0.5em] text-slate-900 dark:text-white">REACT // THREE.JS // MAKE.COM // NODE.JS // AWS // FRAMER MOTION // SHOPIFY //</span>
        </div>
      </section>

      <AgencyFooter />
    </motion.div>
  );
}
