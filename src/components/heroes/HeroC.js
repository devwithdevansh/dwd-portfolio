import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskRevealText from '../motion/MaskRevealText';
import MagneticButton from '../motion/MagneticButton';
import ParallaxLayer from '../motion/ParallaxLayer';

// Using an existing project image as a visual fragment
import projectImg from '../../assets/projects/rajtourism.jpg';

export default function HeroC({ displayLocation }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Aggressive scroll transformations for maximalist feel
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const textY = useTransform(scrollYProgress, [0, 0.8], [0, -200]);
  const fragmentY = useTransform(scrollYProgress, [0, 0.8], [0, 300]);

  return (
    <section 
      ref={containerRef}
      className="h-[150vh] relative bg-[#FAF3E6] text-[#15121C] overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center p-4">
        
        {/* Maximalist Background Grid & Technical Accents */}
        <motion.div style={{ scale: bgScale }} className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full bg-blueprint-grid" />
        </motion.div>

        {/* Scattered Graphic Fragments */}
        <motion.div style={{ y: fragmentY }} className="absolute inset-0 pointer-events-none z-10 flex justify-between p-12 opacity-80 hidden md:flex">
          <div className="w-64 h-64 border-l-4 border-t-4 border-[#2B3A67] pt-4 pl-4 font-mono text-[10px] tracking-widest text-[#2B3A67]">
            [ NODE : 01 ]<br/>
            STATUS: ACTIVE
          </div>
          <div className="w-64 h-64 border-r-4 border-b-4 border-[#E8A33D] pb-4 pr-4 font-mono text-[10px] tracking-widest text-[#E8A33D] flex items-end justify-end">
            [ METRICS ]
          </div>
        </motion.div>

        {/* Floating Image Fragment */}
        <ParallaxLayer offset={-80} className="absolute left-[15%] top-[25%] w-48 h-64 overflow-hidden shadow-2xl z-20 hidden md:block opacity-70">
          <img src={projectImg} alt="" className="w-full h-full object-cover filter grayscale contrast-125" />
          <div className="absolute inset-0 bg-[#E8A33D] mix-blend-multiply opacity-50" />
        </ParallaxLayer>

        {/* Dense Typography */}
        <motion.div style={{ y: textY }} className="relative z-30 flex flex-col w-full max-w-7xl">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-2">
            <MaskRevealText text="BUSINESS" as="h1" className="text-[14vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none" delay={0.1} />
            <span className="font-mono text-xs md:text-sm tracking-[0.3em] opacity-50 uppercase hidden md:inline-block border-b border-black pb-1">
              Technology Second
            </span>
          </div>
          
          <div className="flex justify-start md:ml-[10%]">
            <MaskRevealText text="EXPERIENCE" as="h1" className="text-[14vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none text-[#2B3A67]" delay={0.2} />
          </div>

          <div className="flex justify-end mt-2 md:mt-[-2vw]">
            <MaskRevealText text={displayLocation} as="h1" className="text-[14vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none text-transparent" style={{ WebkitTextStroke: '2px #15121C' }} delay={0.3} />
          </div>
        </motion.div>

        {/* Floating CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 md:bottom-16 w-full flex justify-center z-40"
        >
          <MagneticButton 
            className="px-12 py-5 bg-[#E8A33D] text-black font-black tracking-widest uppercase shadow-xl hover:scale-105 transition-transform"
            data-cursor="button"
          >
            Explore Systems
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
}
