import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, x: 100, transition: { duration: 0.5 } }
};

const SERVICES = [
  { title: 'Web Development', desc: 'Bespoke, high-performance React & Three.js applications that obliterate templates.', color: '#EAB308' },
  { title: 'Mobile Apps', desc: 'Native and cross-platform mobile experiences designed for maximum engagement.', color: '#06B6D4' },
  { title: 'Automations', desc: 'Enterprise-grade Make.com workflows connecting your entire tech stack.', color: '#10B981' },
  { title: 'Branding', desc: 'Aggressive, unforgettable brand identities that command market authority.', color: '#A855F7' }
];

export default function Services() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 pt-32 min-h-screen pb-32"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h1 className="text-6xl sm:text-[8vw] font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-[#F3F4F6] mb-24 transition-colors duration-1000">
          WHAT WE <span className="text-transparent [-webkit-text-stroke:2px_#FFF] dark:[-webkit-text-stroke:2px_#10B981]">DO</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900 dark:text-white transition-colors duration-1000">
          {SERVICES.map((srv, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1), duration: 0.8 }}
              className="border-2 border-slate-900 dark:border-gray-800 p-8 sm:p-12 hover:shadow-[12px_12px_0px_#0f172a] dark:hover:shadow-none hover:-translate-y-2 hover:-translate-x-2 bg-white/80 dark:bg-transparent dark:hover:bg-white/5 transition-all duration-300 group cursor-pointer"
              data-cursor="hover"
            >
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 transition-colors" style={{ color: srv.color }}>
                {srv.title}
              </h2>
              <p className="text-xl opacity-70 font-mono leading-relaxed">
                {srv.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
