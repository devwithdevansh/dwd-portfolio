import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskRevealText from '../motion/MaskRevealText';
import MagneticButton from '../motion/MagneticButton';
import ParallaxLayer from '../motion/ParallaxLayer';

export default function HeroA({ displayLocation }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Typography choreography
  // On scroll: BUSINESS moves up/left, EXPERIENCE scales/fades, ENGINEERS moves down/right
  const businessY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const businessX = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const businessScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const experienceOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.5, 0]);
  const experienceScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  const engineersY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const engineersX = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const engineersScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const textOpacity = useTransform(scrollYProgress, [0.4, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="h-[150vh] relative flex flex-col items-center pt-[25vh] bg-[#F8F9FA] text-[#15121C] overflow-hidden"
    >
      {/* Subtle Blueprint Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-blueprint-grid" />

      {/* Sticky Container for the visual sequence */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Core Typography Composition */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative z-20 flex flex-col items-center justify-center text-center w-full max-w-7xl px-4"
        >
          {/* BUSINESS */}
          <motion.div style={{ y: businessY, x: businessX, scale: businessScale }} className="w-full relative z-30">
            <MaskRevealText 
              text="BUSINESS" 
              as="h1" 
              className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.8] text-[#15121C]"
              delay={0.1}
            />
            {/* Subtle floating label attached to BUSINESS */}
            <motion.div 
              style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
              className="absolute top-0 right-[10%] text-xs font-mono tracking-widest opacity-0 uppercase"
            >
              [ SECTOR INTELLIGENCE ]
            </motion.div>
          </motion.div>

          {/* EXPERIENCE */}
          <motion.div style={{ opacity: experienceOpacity, scale: experienceScale }} className="w-full my-[-2vw] md:my-[-1vw] relative z-20">
            <MaskRevealText 
              text="EXPERIENCE" 
              as="h1" 
              className="text-[14vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.8] text-[#E8A33D]"
              delay={0.3}
            />
          </motion.div>

          {/* ENGINEERS */}
          <motion.div style={{ y: engineersY, x: engineersX, scale: engineersScale }} className="w-full relative z-10 flex items-center justify-center gap-4">
            <MaskRevealText 
              text={displayLocation} 
              as="h1" 
              className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.8] text-[#15121C]"
              delay={0.5}
            />
          </motion.div>
        </motion.div>

        {/* Small Supporting Text & CTA */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-12 md:bottom-24 w-full flex flex-col items-center justify-center z-30"
        >
          <p className="font-mono text-sm tracking-[0.2em] uppercase max-w-sm text-center mb-8 opacity-60">
            We engineer invisible business systems.
          </p>
          <MagneticButton 
            className="px-8 py-4 bg-[#15121C] text-white rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#E8A33D] transition-colors duration-300"
            data-cursor="link"
          >
            Start a Project
          </MagneticButton>
        </motion.div>

        {/* Background Depth Elements appearing on scroll */}
        <ParallaxLayer offset={100} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 z-0">
          <span className="text-[30vw] font-black uppercase whitespace-nowrap text-[#2B3A67]">SYSTEM</span>
        </ParallaxLayer>

      </div>
    </section>
  );
}
