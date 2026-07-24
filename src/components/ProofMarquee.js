import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ProofMarquee() {
  const marqueeText = "OVER ₹50M REVENUE GENERATED ✦ TRUSTED BY 40+ INDIAN BRANDS ✦ ZERO TEMPLATES USED ✦ BESPOKE ENGINEERING ✦ ";
  
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const shadowY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const dynamicBoxShadow = useTransform(shadowY, (y) => `0px ${y}px 50px -10px rgba(44, 30, 22, 0.7)`);

  return (
    <motion.div 
      ref={ref}
      style={{ boxShadow: document.documentElement.classList.contains('dark') ? 'none' : dynamicBoxShadow }}
      className="w-full wood-oak nailed dark:bg-[#EAB308] py-4 overflow-hidden border-y border-[#2C1E16] dark:border-none z-40 relative"
    >
      <div className="relative flex whitespace-nowrap">
        <motion.div 
          className="flex whitespace-nowrap font-black uppercase tracking-[0.3em] text-sm sm:text-base burned-text dark:text-black dark:text-shadow-none"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20
          }}
        >
          <span>{marqueeText}{marqueeText}{marqueeText}{marqueeText}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
