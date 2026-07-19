import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ShaderBackground from '../components/ShaderBackground';
import AgencyFooter from '../components/AgencyFooter';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 0.5 } }
};

export default function About() {
  const [traffic, setTraffic] = useState(5000);
  const conversionRate = 0.015; // Assuming a 1.5% boost with good design
  const avgOrderValue = 250;
  
  // Calculate potential lost revenue per month
  const lostRevenue = Math.floor(traffic * conversionRate * avgOrderValue);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 pt-32 min-h-screen"
    >
      <ShaderBackground theme="clinical" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <h1 className="text-6xl sm:text-[8vw] font-black uppercase tracking-tighter leading-none mix-blend-difference text-[#F3F4F6] mb-8">
          THE <span className="text-transparent [-webkit-text-stroke:2px_#06B6D4]">BRAINS</span>
        </h1>
        
        {/* The Calculator */}
        <div className="border border-gray-800 p-8 sm:p-16 mb-32 mix-blend-difference bg-[#050505]/50 backdrop-blur-md">
          <h2 className="text-3xl font-bold uppercase mb-4">The Cost of Bad Design</h2>
          <p className="font-mono opacity-60 mb-12 max-w-2xl">
            A bad website doesn't just look ugly. It leaks money every single day. Use the slider below to see how much revenue you are losing by not working with us.
          </p>
          
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 w-full">
              <label className="flex justify-between font-mono mb-4 text-xl">
                <span>Monthly Traffic:</span>
                <span className="text-[#06B6D4]">{traffic.toLocaleString()} visitors</span>
              </label>
              <input 
                type="range" 
                min="500" 
                max="50000" 
                step="500"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
            </div>
            
            <div className="flex-1 w-full text-center md:text-right">
              <span className="block font-mono opacity-60 mb-2 uppercase tracking-widest text-sm">Potential Lost Revenue</span>
              <span className="text-5xl sm:text-7xl font-black text-[#F43F5E]">
                ${lostRevenue.toLocaleString()}
              </span>
              <span className="block font-mono opacity-60 mt-2">/ month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team & Footer */}
      <AgencyFooter />
    </motion.div>
  );
}
