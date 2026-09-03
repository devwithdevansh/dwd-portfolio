import React from 'react';
import { motion } from 'framer-motion';
import { HardHat, Wrench, Hammer, Settings } from 'lucide-react';

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Animated Caution Tape Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] rotate-[-45deg]" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #ffff00 40px, #ffff00 80px)'
             }}>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 bg-[#ffff00] p-8 md:p-16 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-[90%] flex flex-col items-center"
      >
        
        {/* Animated Icons Container */}
        <div className="flex gap-6 mb-8">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <HardHat size={64} className="text-black" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 90, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Settings size={64} className="text-black" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -45, 0], y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Hammer size={64} className="text-black" />
          </motion.div>
        </div>

        {/* Pixel/Blocky Typography Effect */}
        <div className="text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.5 }}
          >
            Sorry
          </motion.h1>
          <motion.div 
            className="h-2 w-full bg-black mb-4 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
          <motion.h2 
            className="text-4xl md:text-6xl font-black text-black tracking-widest uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Under Construction
          </motion.h2>
        </div>

        <motion.p 
          className="mt-8 text-black text-lg md:text-2xl font-bold text-center max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          We are completely rebuilding our website to bring you a better experience. Stay tuned!
        </motion.p>
        
        {/* Loading Bar */}
        <div className="w-full h-8 border-4 border-black mt-10 relative overflow-hidden bg-white">
          <motion.div 
            className="h-full bg-black"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "30%", "70%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          />
        </div>

      </motion.div>

      {/* Floating particles/pixels effect */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-[#ffff00] opacity-50"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UnderConstruction;
