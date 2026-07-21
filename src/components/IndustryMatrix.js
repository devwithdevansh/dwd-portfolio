import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { INDUSTRY_DATA } from '../data/IndustryData';
import CypherText from './CypherText';
import PopOutIllustration from './PopOutIllustration';

export default function IndustryMatrix() {
  const [hoveredIndustry, setHoveredIndustry] = useState(null);
  
  const industries = Object.values(INDUSTRY_DATA);

  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-32 border-t border-gray-800 z-20">
      
      {/* Dynamic Background Fill on Hover */}
      <AnimatePresence>
        {hoveredIndustry && (
          <motion.div
            key="bg-fill"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ backgroundColor: hoveredIndustry.color }}
          >
             {/* A subtle noise overlay to make the solid color look premium */}
             <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="mb-32 mix-blend-difference text-white">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-8 max-w-4xl">
            <CypherText text="Most agencies sell you generic templates." speed={10} />
          </h2>
          <p className="text-xl sm:text-2xl font-mono opacity-60 max-w-3xl leading-relaxed">
            Your business is unique, but your website looks identical to your competitors. 
            It is leaking money and bleeding trust every single day. Let's fix that.
          </p>
          <p className="text-sm font-bold uppercase tracking-[0.5em] mt-16 opacity-50">
            Select Your Industry ↓
          </p>
        </div>

        <div className="flex flex-col border-t border-gray-800">
          {industries.map((ind, index) => (
            <Link
              key={ind.id}
              to={`/industry/${ind.id}`}
              className="group border-b border-gray-800 py-8 sm:py-12 flex items-center justify-between transition-all duration-500 relative"
              onMouseEnter={() => setHoveredIndustry(ind)}
              onMouseLeave={() => setHoveredIndustry(null)}
              data-cursor="hover"
            >
              <div className="flex items-center gap-8 sm:gap-16 mix-blend-difference text-white z-20">
                <span className="font-mono text-xl opacity-30 group-hover:opacity-100 transition-opacity">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
                <h3 className="text-4xl sm:text-6xl md:text-[5vw] font-black uppercase tracking-tighter group-hover:pl-8 transition-all duration-500">
                  {ind.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-8 z-10">
                {/* The Static Preview Image or 3D Vector */}
                {ind.id === 'hospitals' ? (
                  <PopOutIllustration src="/assets/projects/city-hospital-building/hospital_transparent.png" hovered={hoveredIndustry?.id === 'hospitals'} />
                ) : (
                  <div className="relative w-32 h-20 md:w-64 md:h-40 overflow-hidden hidden sm:block opacity-60 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl rounded-xl z-10">
                    <motion.img 
                      src={ind.image} 
                      alt={ind.name}
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    />
                    {/* Subtle brutalist overlay frame */}
                    <div className="absolute inset-0 border border-white/10 pointer-events-none rounded-xl" />
                  </div>
                )}

                <span className="text-4xl opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 transition-all duration-500 mix-blend-difference text-white">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
