import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskRevealText from '../motion/MaskRevealText';
import ParallaxLayer from '../motion/ParallaxLayer';
import MagneticButton from '../motion/MagneticButton';

// Reuse an existing paper asset from the repo
import factoryAsset from '../../assets/projects/objects/hospital/try/leaves_right.png';
import hospitalBuilding from '../../assets/projects/objects/hospital/try/hospital.png';

export default function HeroB({ displayLocation }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const titleOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="h-[150vh] relative bg-[#FAF3E6] text-[#1A1A1A] overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Paper Grid Depth */}
        <ParallaxLayer offset={-50} className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-10">
          <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] border border-dashed border-[#1A1A1A] rounded-full" />
        </ParallaxLayer>

        {/* Background Paper Elements (reveal on scroll) */}
        <motion.div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-10"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [0, 1]), y: useTransform(scrollYProgress, [0, 0.5], [100, 0]) }}
        >
          <img src={factoryAsset} alt="" className="absolute left-[10%] top-[20%] w-32 opacity-20 filter grayscale" />
          <img src={hospitalBuilding} alt="" className="absolute right-[5%] bottom-[10%] w-64 opacity-10 mix-blend-multiply" />
        </motion.div>

        {/* Typography */}
        <motion.div 
          className="relative z-20 flex flex-col items-center text-center w-full px-4"
          style={{ scale: titleScale, opacity: titleOpacity }}
        >
          <div className="relative overflow-hidden mb-[-2vw]">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="text-[12vw] md:text-[9vw] font-black uppercase tracking-tighter leading-none text-[#1A1A1A]"
            >
              BUSINESS
            </motion.h1>
          </div>
          <div className="relative overflow-hidden mb-[-2vw] z-30">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
              className="text-[12vw] md:text-[9vw] font-black uppercase tracking-tighter leading-none text-transparent"
              style={{ WebkitTextStroke: '2px #1A1A1A' }}
            >
              EXPERIENCE
            </motion.h1>
          </div>
          <div className="relative overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="text-[12vw] md:text-[9vw] font-black uppercase tracking-tighter leading-none text-[#1A1A1A]"
            >
              {displayLocation}
            </motion.h1>
          </div>
        </motion.div>

        {/* Interactive Overlay Box */}
        <motion.div
          className="absolute left-8 bottom-8 md:left-16 md:bottom-16 bg-white p-6 shadow-xl border border-gray-100 max-w-xs z-30"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="w-4 h-4 bg-[#E8A33D] rounded-full mb-4 animate-pulse" />
          <h3 className="font-bold uppercase tracking-widest text-xs mb-2">System Architecture</h3>
          <p className="text-sm opacity-60 font-mono leading-relaxed">
            We don't build websites. We engineer invisible business systems.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
