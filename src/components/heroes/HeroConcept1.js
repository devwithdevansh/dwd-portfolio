import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Mock images/assets for the architectural layers
import factoryAsset from '../../assets/projects/objects/hospital/try/leaves_right.png';
import hospitalAsset from '../../assets/projects/objects/hospital/try/hospital.png';
import projectImage from '../../assets/projects/rajtourism.jpg';

export default function HeroConcept1() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Type as Architecture Choreography
  // Initial: Flat typography
  // Scroll 25%: Letters act as windows (scale up, images behind them become visible)
  // Scroll 50%: Z-depth increases, physical layers separate
  // Scroll 75%: Entire structure slides up into the next section

  // Scale the entire word block slightly
  const containerScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);
  
  // Depth transforms for BUSINESS
  const businessZ = useTransform(scrollYProgress, [0, 0.3], [0, 50]);
  const businessOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);

  // Depth transforms for EXPERIENCE (acts as a window)
  const expScale = useTransform(scrollYProgress, [0.1, 0.5], [1, 1.5]);
  const expImageOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  // Depth transforms for ENGINEERS
  const engineersZ = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  
  // Final exit transition
  const heroY = useTransform(scrollYProgress, [0.7, 1], ["0%", "-50%"]);

  return (
    <section ref={containerRef} className="h-[250vh] relative bg-[#FAF3E6] text-[#15121C]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden [perspective:1000px]">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-[0.03] pointer-events-none" />

        <motion.div 
          style={{ scale: containerScale, y: heroY, rotateX: useTransform(scrollYProgress, [0, 0.5], [0, 10]) }}
          className="relative flex flex-col items-center justify-center w-full max-w-7xl mx-auto transform-style-3d"
        >
          {/* LAYER 1: BACKGROUND IMAGES (Revealed behind text) */}
          <motion.div 
            style={{ opacity: expImageOpacity, translateZ: -200 }} 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <img src={projectImage} alt="" className="w-[60vw] h-[40vw] object-cover filter grayscale contrast-125 mix-blend-multiply opacity-20" />
            <img src={hospitalAsset} alt="" className="absolute right-[10%] bottom-[20%] w-64 mix-blend-multiply opacity-40" />
            <img src={factoryAsset} alt="" className="absolute left-[10%] top-[10%] w-32 filter grayscale mix-blend-multiply opacity-40" />
          </motion.div>

          {/* LAYER 2: BUSINESS */}
          <motion.div style={{ translateZ: businessZ, opacity: businessOpacity }} className="relative z-30 mb-[-2vw]">
            <h1 className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85]">
              BUSINESS
            </h1>
          </motion.div>

          {/* LAYER 3: EXPERIENCE (The Window) */}
          <motion.div style={{ scale: expScale, translateZ: 0 }} className="relative z-20 mb-[-2vw]">
            {/* Outline text to act as a frame/window */}
            <h1 className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-[#FAF3E6]" style={{ WebkitTextStroke: '2px #15121C' }}>
              EXPERIENCE
            </h1>
            
            {/* Solid text that fades out to reveal the outline/window */}
            <motion.h1 
              style={{ opacity: useTransform(scrollYProgress, [0.1, 0.3], [1, 0]) }}
              className="absolute inset-0 text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-[#E8A33D]"
            >
              EXPERIENCE
            </motion.h1>
          </motion.div>

          {/* LAYER 4: ENGINEERS */}
          <motion.div style={{ translateZ: engineersZ }} className="relative z-10">
            <h1 className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85]">
              ENGINEERS
            </h1>
          </motion.div>

        </motion.div>

        {/* Technical Labels anchored to the architecture */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]) }}
          className="absolute left-8 bottom-8 md:left-16 md:bottom-16 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest text-[#15121C]"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E8A33D] rounded-full" />
            STRUCTURAL INTEGRITY: SECURE
          </div>
          <div>SYSTEMS: ONLINE</div>
        </motion.div>

      </div>
    </section>
  );
}
