import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { INDUSTRY_DATA } from '../data/IndustryData';
import CypherText from './CypherText';

const BentoCard = ({ ind, index }) => {
  const [hovered, setHovered] = useState(false);
  const imageSrc = ind.image;

  return (
    <Link 
      to={`/industry/${ind.id}`}
      className="group relative h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-[#050505] border border-gray-800 hover:border-gray-600 transition-colors duration-700 block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Structural Grid (Editorial Vibe) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Typography: Tightly integrated top-left */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none">
        <div className="text-[10px] text-cyan-500 font-mono uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
           <span className="w-4 h-[1px] bg-cyan-500"></span> Sector {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-white mix-blend-difference uppercase tracking-tighter group-hover:pl-2 transition-all duration-500">
          {ind.name}
        </h3>
      </div>

      {/* The Expertly Blended Illustration */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex items-end justify-end">
        <motion.img 
          src={imageSrc} 
          alt={ind.name}
          className="absolute w-[120%] md:w-[100%] h-[120%] md:h-[100%] object-contain object-bottom -right-4 -bottom-4 transition-all duration-700"
          initial={{ opacity: 0.2, filter: 'grayscale(100%) brightness(0.6)' }}
          animate={{
            scale: hovered ? 1.05 : 1,
            opacity: hovered ? 0.85 : 0.25,
            filter: hovered ? 'grayscale(0%) brightness(0.95)' : 'grayscale(100%) brightness(0.6)',
          }}
          style={{ mixBlendMode: hovered ? 'normal' : 'luminosity' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      {/* Forensic Overlays (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col gap-1 pointer-events-none">
         <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Status: Operational</span>
         <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            View Analytics <span className="animate-pulse">_</span>
         </span>
      </div>

      {/* Dynamic Hover Glow */}
      <motion.div 
         className="absolute inset-0 pointer-events-none mix-blend-screen z-20"
         animate={{ opacity: hovered ? 0.15 : 0 }}
         style={{ background: `radial-gradient(circle at 80% 80%, ${ind.color || '#22d3ee'}, transparent 60%)` }}
      />
    </Link>
  );
};

export default function IndustryMatrix() {
  const industries = Object.values(INDUSTRY_DATA);

  return (
    <section className="relative w-full min-h-screen bg-[#050505] py-32 border-t border-gray-800 z-20 overflow-hidden">
      
      {/* Background static noise */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header Section */}
        <div className="mb-24 mix-blend-difference text-white">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-8 max-w-4xl">
            <CypherText text="Most agencies sell you generic templates." speed={10} />
          </h2>
          <p className="text-xl sm:text-2xl font-mono opacity-60 max-w-3xl leading-relaxed">
            Your business is unique, but your website looks identical to your competitors. 
            It is leaking money and bleeding trust every single day. Let's fix that.
          </p>
          <p className="text-sm font-bold uppercase tracking-[0.5em] mt-16 opacity-50">
            Select Your Sector ↓
          </p>
        </div>

        {/* The Expert Editorial Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {industries.map((ind, index) => (
            <div key={ind.id} className={index === 0 ? "md:col-span-2 lg:col-span-2" : "col-span-1"}>
              <BentoCard ind={ind} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
