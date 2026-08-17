import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import hospitalAsset from '../../assets/projects/objects/hospital/try/hospital.png';
import projectImage from '../../assets/projects/rajtourism.jpg';

export default function HeroConcept2() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Collage Choreography
  // Initial: Clean typography only
  // Scroll 0 -> 0.4: Random collage elements float in from different directions (chaos)
  // Scroll 0.4 -> 0.6: Hold maximalist state
  // Scroll 0.6 -> 0.8: Snap into a highly structured grid system
  
  // Elements chaos transforms
  const chaosY1 = useTransform(scrollYProgress, [0, 0.4, 0.6, 0.8], [-200, 0, 0, 50]);
  const chaosX1 = useTransform(scrollYProgress, [0, 0.4, 0.6, 0.8], [-200, 0, 0, 50]);
  const chaosRot1 = useTransform(scrollYProgress, [0, 0.4, 0.6, 0.8], [-45, 12, 12, 0]);

  const chaosY2 = useTransform(scrollYProgress, [0, 0.4, 0.6, 0.8], [200, 0, 0, -50]);
  const chaosX2 = useTransform(scrollYProgress, [0, 0.4, 0.6, 0.8], [200, 0, 0, -50]);
  const chaosRot2 = useTransform(scrollYProgress, [0, 0.4, 0.6, 0.8], [45, -15, -15, 0]);

  // Main text snap transform
  const textScale = useTransform(scrollYProgress, [0.6, 0.8], [1, 0.6]);
  const textY = useTransform(scrollYProgress, [0.6, 0.8], [0, "-20vh"]);
  
  // Master opacity for the transition out
  const heroOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <section ref={containerRef} className="h-[300vh] relative bg-[#FAF3E6] text-[#15121C]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* The Clean Core Typography */}
        <motion.div 
          style={{ scale: textScale, y: textY, opacity: heroOpacity }}
          className="relative z-30 flex flex-col items-center justify-center w-full max-w-7xl"
        >
          <h1 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.85]">BUSINESS</h1>
          <h1 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.85] text-[#E8A33D]">EXPERIENCE</h1>
          <h1 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.85]">ENGINEERS</h1>
        </motion.div>

        {/* The Collage Fragments */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 pointer-events-none z-20">
          
          {/* Fragment 1: Image & Tape */}
          <motion.div 
            style={{ y: chaosY1, x: chaosX1, rotate: chaosRot1, opacity: useTransform(scrollYProgress, [0.1, 0.3], [0, 1]) }}
            className="absolute left-[10%] top-[20%] w-64 bg-white p-2 shadow-2xl transition-all duration-300"
          >
            <div className="w-12 h-4 bg-yellow-200/50 absolute -top-2 left-1/2 -translate-x-1/2 rotate-[-5deg]" />
            <img src={projectImage} alt="" className="w-full h-auto filter grayscale" />
            <div className="text-[10px] font-mono mt-2 font-bold uppercase">Fig. 01: User Flow</div>
          </motion.div>

          {/* Fragment 2: Paper Cut 3D Object */}
          <motion.div 
            style={{ y: chaosY2, x: chaosX2, rotate: chaosRot2, opacity: useTransform(scrollYProgress, [0.1, 0.3], [0, 1]) }}
            className="absolute right-[15%] bottom-[25%] w-72 transition-all duration-300"
          >
            <img src={hospitalAsset} alt="" className="w-full h-auto drop-shadow-2xl" />
            <div className="absolute top-0 right-0 bg-[#15121C] text-[#FAF3E6] font-mono text-[8px] p-1 px-2">ASSET_LOADED</div>
          </motion.div>

          {/* Fragment 3: Tech Metric Graph (Abstract CSS) */}
          <motion.div 
            style={{ 
              y: useTransform(scrollYProgress, [0.2, 0.5, 0.6, 0.8], [100, 0, 0, -100]), 
              opacity: useTransform(scrollYProgress, [0.2, 0.4], [0, 1]),
              scale: useTransform(scrollYProgress, [0.6, 0.8], [1, 1.5])
            }}
            className="absolute right-[10%] top-[30%] w-48 h-32 border border-[#15121C]/20 p-4 flex items-end gap-2 bg-[#FAF3E6]/80 backdrop-blur-sm"
          >
            <div className="w-4 h-full bg-[#E8A33D] transform origin-bottom scale-y-[0.4]" />
            <div className="w-4 h-full bg-[#E8A33D] transform origin-bottom scale-y-[0.7]" />
            <div className="w-4 h-full bg-[#15121C] transform origin-bottom scale-y-[0.9]" />
            <div className="w-4 h-full bg-[#E8A33D] transform origin-bottom scale-y-[0.6]" />
            <div className="absolute top-2 left-2 text-[10px] font-mono font-bold">SYS_LOAD</div>
          </motion.div>

        </motion.div>

        {/* The Snapping Grid Background (Appears at 0.6) */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]) }}
          className="absolute inset-0 pointer-events-none z-10"
        >
          {/* Structured horizontal and vertical lines */}
          <div className="absolute top-[20vh] w-full h-[1px] bg-[#15121C]/20" />
          <div className="absolute bottom-[20vh] w-full h-[1px] bg-[#15121C]/20" />
          <div className="absolute left-[20vw] h-full w-[1px] bg-[#15121C]/20" />
          <div className="absolute right-[20vw] h-full w-[1px] bg-[#15121C]/20" />
          
          <div className="absolute top-4 left-4 font-mono text-xs font-bold tracking-widest text-[#15121C]">
            [ GRID_LOCK : ACTIVE ]
          </div>
        </motion.div>

      </div>
    </section>
  );
}
