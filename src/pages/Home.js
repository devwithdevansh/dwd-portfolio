import React, { useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import SvgMaskText from '../components/SvgMaskText';
import Logo3D from '../components/Logo3D';
import CypherText from '../components/CypherText';
import IndustryMatrix from '../components/IndustryMatrix';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  const { location } = useParams();
  
  // Create a memoized, formatted location string
  const displayLocation = useMemo(() => {
    if (!location) return "THE INDUSTRY";
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen"
    >
      {/* The Dynamic Shader Hero Section */}
      <section className="h-[120vh] relative flex flex-col items-center justify-center">
        
        {/* Interactive 3D Logo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 z-30 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Logo3D />
          </Canvas>
        </div>

        {/* Dynamic Location Title */}
        <div className="dark:invert-0 invert transition-all duration-1000">
          <SvgMaskText textTop="DOMINATE" textBottom={displayLocation} />
        </div>
        
        <div className="absolute bottom-10 left-10 mix-blend-difference z-20 pointer-events-none">
          <p className="text-sm font-mono opacity-50 max-w-xs uppercase tracking-widest leading-loose text-white">
            We don't use templates. We engineer bespoke digital assets designed for one metric only: Revenue.
          </p>
        </div>
      </section>

      {/* The Industry Selector Matrix */}
      <IndustryMatrix />

      {/* Kinetic Typography Scroll Section */}
      <section ref={scrollRef} className="py-32 overflow-hidden mix-blend-difference z-20 relative">
        <motion.div style={{ x: textX1 }} className="whitespace-nowrap mb-16">
          <h2 className="text-[15vw] font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-transparent dark:[-webkit-text-stroke:2px_#EAB308] transition-colors duration-1000">
            <CypherText text="WE HATE TEMPLATES." speed={10} /> <span className="text-[#EAB308] dark:text-white"><CypherText text="WE HATE TEMPLATES." speed={10} /></span>
          </h2>
        </motion.div>
        
        <motion.div style={{ x: textX2 }} className="whitespace-nowrap">
          <h2 className="text-[15vw] font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-white transition-colors duration-1000">
            <CypherText text="WE BUILD CUSTOM ASSETS." speed={10} /> <span className="text-[#06B6D4] dark:text-transparent dark:[-webkit-text-stroke:2px_#06B6D4]"><CypherText text="WE BUILD CUSTOM ASSETS." speed={10} /></span>
          </h2>
        </motion.div>
      </section>

      {/* Brutalist Tech Stack Ticker */}
      <section className="py-16 border-t border-b border-white/50 dark:border-gray-800 bg-white/50 dark:bg-[#050505] backdrop-blur-xl overflow-hidden whitespace-nowrap flex transition-colors duration-1000">
        <div className="animate-[spin_20s_linear_infinite] [animation-direction:reverse] flex w-[200%] gap-8">
           <span className="text-4xl font-mono opacity-30 tracking-[0.5em] text-slate-900 dark:text-white">REACT // THREE.JS // MAKE.COM // NODE.JS // AWS // FRAMER MOTION // SHOPIFY //</span>
           <span className="text-4xl font-mono opacity-30 tracking-[0.5em] text-slate-900 dark:text-white">REACT // THREE.JS // MAKE.COM // NODE.JS // AWS // FRAMER MOTION // SHOPIFY //</span>
        </div>
      </section>

      {/* Teaser Links */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-4 text-right mix-blend-difference z-20">
        <a href="/services" className="text-xl font-bold uppercase tracking-widest text-white hover:text-[#EAB308] transition-colors" data-cursor="hover">What We Do →</a>
        <a href="/work" className="text-xl font-bold uppercase tracking-widest text-white hover:text-[#EAB308] transition-colors" data-cursor="hover">Our Proof →</a>
      </div>
    </motion.div>
  );
}
