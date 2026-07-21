import React from 'react';
import { motion } from 'framer-motion';

export default function PopOutIllustration({ src, hovered }) {
  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 hidden sm:block pointer-events-none group z-30">
      {/* 
        LAYER 1: The Base "Portal"
        This container is strict about overflow. It acts as the "card" or "window" the image lives inside.
      */}
      <div className="absolute inset-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-all duration-700 bg-[#0a0a0a]">
        <motion.img 
          src={src} 
          alt="Base Illustration"
          className="w-full h-full object-contain object-bottom filter grayscale transition-all duration-700"
          initial={false}
          animate={{ 
            scale: hovered ? 1.4 : 1.0,
            y: hovered ? 15 : 0,
            filter: hovered ? 'grayscale(0%) drop-shadow(0px 20px 20px rgba(0,0,0,0.8))' : 'grayscale(100%)'
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
        
        {/* Subtle inner shadow to make it feel like a window */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
      </div>

      {/* 
        LAYER 2: The "Pop-Out" Layer
        This layer sits strictly ON TOP of the portal and is NOT constrained by overflow-hidden.
        We clip off the bottom half so it ONLY shows the top part popping out.
      */}
      <div className="absolute -inset-x-20 -top-32 bottom-0 pointer-events-none z-40">
        <motion.img 
          src={src} 
          alt="Popping Illustration"
          className="w-full h-full object-contain object-bottom filter grayscale transition-all duration-700"
          initial={false}
          animate={{ 
            scale: hovered ? 1.4 : 1.0,
            y: hovered ? 15 : 0,
            filter: hovered ? 'grayscale(0%) drop-shadow(0px -15px 30px rgba(0,0,0,0.6))' : 'grayscale(100%) opacity(0)'
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
      </div>
      
      {/* 
        Foreground Abstract Tech UI (Only visible on hover)
      */}
      <motion.div 
        className="absolute bottom-4 -right-8 flex flex-col gap-1 pointer-events-none z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -20 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="w-16 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        <div className="w-8 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] mt-1 drop-shadow-md">
          Portal Breach
        </span>
      </motion.div>
    </div>
  );
}
