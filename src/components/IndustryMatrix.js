import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { INDUSTRY_DATA } from '../data/IndustryData';
import CypherText from './CypherText';

const getBentoClasses = (index) => {
  // Bespoke Masonry Layout for 9 items (3-column grid)
  const classes = [
    "md:col-span-2 md:row-span-2", // 0: Hospitals (Hero block)
    "md:col-span-1 md:row-span-1", // 1: Car Detailing
    "md:col-span-1 md:row-span-1", // 2: Factories
    "md:col-span-1 md:row-span-1", // 3: Jewelers
    "md:col-span-2 md:row-span-1", // 4: Cafes (Wide)
    "md:col-span-2 md:row-span-1", // 5: Hotels (Wide)
    "md:col-span-1 md:row-span-1", // 6: Schools
    "md:col-span-1 md:row-span-1", // 7: Tuition
    "md:col-span-2 md:row-span-1", // 8: Enterprise (Wide)
  ];
  return classes[index] || "col-span-1";
};

const BentoCard = ({ ind, index }) => {
  const [hovered, setHovered] = useState(false);
  const imageSrc = ind.image;
  const isLarge = index === 0;

  return (
    <Link 
      to={`/industry/${ind.id}`}
      className={`group relative w-full rounded-3xl overflow-hidden bg-white/60 dark:bg-[#0a0a0a] backdrop-blur-2xl dark:backdrop-blur-none border border-white/80 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-sm dark:hover:shadow-2xl hover:-translate-y-1 transition-all duration-700 block ${isLarge ? 'h-[32rem]' : 'h-[15.5rem]'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Structural Grid */}
      <div className="absolute inset-0 opacity-[0.4] dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23e2e8f0' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Typography: Deep corporate tones or glowing white */}
      <div className="absolute top-6 left-6 right-6 z-30 pointer-events-none transition-colors duration-1000">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 flex items-center gap-2" style={{ color: ind.color }}>
           <span className="w-4 h-[2px]" style={{ backgroundColor: ind.color }}></span> Sector {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </div>
        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:pl-2 transition-all duration-500 break-words leading-none">
          {ind.name}
        </h3>
      </div>

      {/* The Expertly Blended Illustration */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-end justify-end">
        <motion.img 
          src={imageSrc} 
          alt={ind.name}
          className="absolute w-[110%] h-[110%] object-contain object-bottom -right-4 -bottom-4 transition-all duration-700 mix-blend-normal dark:mix-blend-luminosity"
          initial={{ opacity: 0.8, filter: 'grayscale(100%) contrast(120%) brightness(0.95)' }}
          animate={{
            scale: hovered ? 1.05 : 1,
            opacity: hovered ? 1 : 0.8,
            filter: hovered ? `grayscale(0%) drop-shadow(0 20px 30px ${ind.color}30) contrast(105%) brightness(1)` : 'grayscale(100%) drop-shadow(0 0px 0px rgba(0,0,0,0)) contrast(120%) brightness(0.95)',
          }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      {/* Forensic Overlays (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col gap-1 pointer-events-none">
         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status: Operational</span>
         <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: ind.color }}>
            View Analytics <span className="animate-pulse">_</span>
         </span>
      </div>

      {/* Dynamic Hover Gradient for Light/Dark Theme */}
      <motion.div 
         className="absolute inset-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen z-20"
         animate={{ opacity: hovered ? (document.documentElement.classList.contains('dark') ? 0.15 : 0.05) : 0 }}
         style={{ background: `radial-gradient(circle at 80% 80%, ${ind.color}, transparent 70%)` }}
      />
    </Link>
  );
};

export default function IndustryMatrix() {
  const industries = Object.values(INDUSTRY_DATA);

  return (
    <section className="relative w-full min-h-screen bg-transparent dark:bg-[#050505] py-32 border-t border-slate-200/50 dark:border-gray-800 z-20 overflow-hidden transition-colors duration-1000">
      
      {/* Soft corporate noise overlay */}
      <div className="absolute inset-0 opacity-[0.3] mix-blend-multiply dark:mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header Section */}
        <div className="mb-24 text-slate-900 dark:text-white transition-colors duration-1000">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-8 max-w-4xl">
            <CypherText text="Most agencies sell you generic templates." speed={10} />
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-slate-600 dark:text-gray-400 max-w-3xl leading-relaxed transition-colors duration-1000">
            Your business is unique, but your website looks identical to your competitors. 
            It is leaking money and bleeding trust every single day. Let's fix that.
          </p>
          <p className="text-sm font-bold uppercase tracking-[0.5em] mt-16 text-slate-400 dark:text-gray-500">
            Select Your Sector ↓
          </p>
        </div>

        {/* The Art-Directed Light Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-min">
          {industries.map((ind, index) => (
            <div key={ind.id} className={getBentoClasses(index)}>
              <BentoCard ind={ind} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
