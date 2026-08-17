import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import hospitalAsset from '../../assets/projects/objects/hospital/try/hospital.png';
import factoryAsset from '../../assets/projects/objects/hospital/try/leaves_right.png'; // Using as a desk scrap

export default function HeroConcept3() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Workspace Camera Choreography
  // Initial: Looking down at a large workspace table. Text is huge in the center.
  // Scroll: Camera zooms in (scale), panning across the table (x/y), discovering different parts of the workspace.
  // End: Zooms through the "O" or empty space of a letter to transition.

  const tableScale = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const tableX = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const tableY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const masterOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  return (
    <section ref={containerRef} className="h-[300vh] relative bg-[#EBE7E0] overflow-hidden cursor-crosshair">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* The Workspace Table / Surface */}
        <motion.div 
          style={{ scale: tableScale, x: tableX, y: tableY, opacity: masterOpacity }}
          className="relative w-[150vw] h-[150vh] flex items-center justify-center origin-center"
        >
          {/* Workspace Grid Pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(#15121C 1px, transparent 1px)', 
            backgroundSize: '40px 40px',
            opacity: 0.1 
          }} />

          {/* Core Typography (Physically placed on the table) */}
          <div className="relative z-30 flex flex-col items-center justify-center shadow-2xl bg-[#FAF3E6] p-16 md:p-24 rotate-[-2deg]">
            {/* Tape */}
            <div className="absolute -top-4 left-8 w-24 h-8 bg-white/60 rotate-[-10deg] shadow-sm backdrop-blur-sm" />
            <div className="absolute -bottom-4 right-8 w-24 h-8 bg-white/60 rotate-[-5deg] shadow-sm backdrop-blur-sm" />
            
            <h1 className="text-[10vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none text-[#15121C]">BUSINESS</h1>
            <h1 className="text-[10vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none text-transparent" style={{ WebkitTextStroke: '2px #15121C' }}>EXPERIENCE</h1>
            <h1 className="text-[10vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none text-[#E8A33D]">ENGINEERS</h1>
          </div>

          {/* Desk Items (Scattered around) */}
          
          {/* Item 1: Business Illustration (Top Left) */}
          <div className="absolute top-[15%] left-[20%] w-64 rotate-12 shadow-xl bg-white p-4 z-20">
            <img src={hospitalAsset} alt="" className="w-full h-auto filter sepia-[0.3]" />
            <div className="font-mono text-[10px] mt-2 uppercase font-bold text-[#15121C]">Asset_Hospital_v2.png</div>
          </div>

          {/* Item 2: Technical Diagram (Bottom Left) */}
          <div className="absolute bottom-[20%] left-[25%] w-80 h-64 border border-[#15121C] bg-[#FAF3E6]/90 p-6 rotate-[-5deg] z-10 shadow-lg">
            <h3 className="font-mono text-xs font-bold mb-4 border-b border-[#15121C] pb-2">DATA FLOW DIAGRAM</h3>
            <div className="w-full h-2 bg-[#15121C]/20 mb-2" />
            <div className="w-3/4 h-2 bg-[#15121C]/20 mb-2" />
            <div className="w-full h-2 bg-[#15121C]/20 mb-6" />
            <div className="w-1/2 h-16 border-2 border-dashed border-[#E8A33D]" />
          </div>

          {/* Item 3: Post-it notes (Top Right) */}
          <div className="absolute top-[25%] right-[25%] w-32 h-32 bg-[#E8A33D] rotate-[15deg] shadow-md p-4 z-40">
            <p className="font-mono text-[10px] text-black font-bold uppercase leading-tight">
              Remember:<br/><br/>
              Technology is just the tool.<br/>
              Solve the business problem first.
            </p>
          </div>

          {/* Item 4: Scrap foliage (Bottom Right) */}
          <div className="absolute bottom-[30%] right-[20%] w-40 rotate-[-20deg] z-10 opacity-70">
            <img src={factoryAsset} alt="" className="w-full filter grayscale" />
          </div>

        </motion.div>
      </div>
    </section>
  );
}
