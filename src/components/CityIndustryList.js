import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { INDUSTRY_DATA } from '../data/IndustryData';

export default function CityIndustryList({ baseRoute = "" }) {
  const industries = Object.values(INDUSTRY_DATA);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative w-full min-h-screen bg-transparent dark:bg-[#050505] py-24 border-t border-slate-200 dark:border-gray-800 z-20 overflow-hidden transition-colors duration-1000">
      
      {/* Dynamic Background Image Reveal */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 z-0 pointer-events-none mix-blend-luminosity"
            style={{
              backgroundImage: `url('${industries[hoveredIndex].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full px-4 sm:px-12 md:px-24">
        <div className="mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-slate-400">
            [ SELECT TARGET SECTOR ]
          </h2>
        </div>

        <div className="flex flex-col border-t border-slate-300 dark:border-gray-800">
          {industries.map((ind, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <Link 
                key={ind.id}
                to={`${baseRoute}/industry/${ind.id}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 md:py-16 border-b border-slate-300 dark:border-gray-800 transition-colors duration-500 hover:bg-white/50 dark:hover:bg-white/5"
              >
                <div className="flex flex-col gap-2 relative z-20 px-4">
                  <span className="text-xs font-mono font-bold tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: isHovered ? ind.color : undefined }}>
                    0{index + 1} {'//'}
                  </span>
                  <h3 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:-translate-y-2 transition-transform duration-500">
                    {ind.name}
                  </h3>
                </div>

                <div className="mt-6 md:mt-0 px-4 flex flex-col items-start md:items-end relative z-20">
                  <p className="text-sm md:text-base font-medium text-slate-500 max-w-sm md:text-right group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-500">
                    {ind.hero}
                  </p>
                  
                  <motion.div 
                    className="mt-6 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ind.color }}>
                      Initiate Protocol
                    </span>
                    <span className="w-8 h-[2px] bg-current" style={{ color: ind.color }}></span>
                  </motion.div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
