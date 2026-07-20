import React from 'react';
import { motion } from 'framer-motion';
import Projects from '../components/Projects';

const pageVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, y: -100, transition: { duration: 0.5 } }
};

export default function Work() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 pt-32 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <h1 className="text-6xl sm:text-[8vw] font-black uppercase tracking-tighter leading-none mix-blend-difference text-[#F3F4F6]">
          OUR <span className="text-transparent [-webkit-text-stroke:2px_#EAB308]">WORK</span>
        </h1>
        <p className="text-xl font-mono opacity-60 mix-blend-difference mt-8 max-w-2xl">
          We don't just build websites. We engineer digital dominance. See the ROI we've delivered for our partners.
        </p>
      </div>
      <Projects />
    </motion.div>
  );
}
