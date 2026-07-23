import React from 'react';
import { motion } from 'framer-motion';

export default function ProofMarquee() {
  const marqueeText = "OVER ₹50M REVENUE GENERATED ✦ TRUSTED BY 40+ INDIAN BRANDS ✦ ZERO TEMPLATES USED ✦ BESPOKE ENGINEERING ✦ ";
  
  return (
    <div className="w-full wood-oak nailed dark:bg-[#EAB308] py-4 overflow-hidden border-y border-[#2C1E16] dark:border-none z-40 relative shadow-2xl">
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
    </div>
  );
}
