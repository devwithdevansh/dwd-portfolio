import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Simulate loading sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsFinished(true), 400); // Small pause at 100%
          setTimeout(() => onComplete(), 1400); // Allow exit animation to run
          return 100;
        }
        // Random jump for a "system loading" feel
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[200] bg-[#020202] text-white flex flex-col items-center justify-center font-mono overflow-hidden"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03]"
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="text-[10px] md:text-xs text-blue-500 uppercase tracking-[0.5em] mb-8 font-bold flex items-center gap-4">
              <span className="w-2 h-2 bg-blue-500 animate-pulse" />
              Initializing DWD Engine
            </div>
            
            {/* Massive Percentage Counter */}
            <div className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums flex items-end">
              {progress > 100 ? 100 : progress}
              <span className="text-3xl md:text-5xl text-gray-700 ml-2 mb-2">%</span>
            </div>

            {/* Brutalist Progress Bar */}
            <div className="w-64 md:w-96 h-[2px] bg-gray-900 mt-12 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.2 }}
              />
            </div>
            
            <div className="text-xs text-gray-600 uppercase tracking-widest mt-6 font-bold flex gap-8">
              <span>SYSTEM_ID: AG-X9</span>
              <span>STATE: {progress < 100 ? "LOADING_ASSETS" : "READY"}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
