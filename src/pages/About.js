import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AgencyFooter from '../components/AgencyFooter';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, scale: 1.05, transition: { duration: 0.5 } }
};

export default function About() {
  const [dailyCustomers, setDailyCustomers] = useState(20);
  const conversionBoost = 0.20; // Assume a 20% conversion bump from online presence
  const avgTicketSize = 1000; // INR
  
  // Calculate potential lost revenue per month (30 days)
  const lostRevenue = Math.floor(dailyCustomers * 30 * conversionBoost * avgTicketSize);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen bg-transparent dark:bg-[#050505] text-slate-900 dark:text-[#F3F4F6] transition-colors duration-1000"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <h1 className="text-6xl sm:text-[8vw] font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-[#F3F4F6] mb-8 transition-colors duration-1000">
          THE <span className="text-transparent [-webkit-text-stroke:2px_#0f172a] dark:[-webkit-text-stroke:2px_#06B6D4]">BRAINS</span>
        </h1>
        
        {/* The Calculator */}
        <div className="border-2 border-slate-900 dark:border-gray-800 shadow-[12px_12px_0px_#0f172a] dark:shadow-none p-8 sm:p-16 mb-32 bg-white/80 dark:bg-[#050505]/50 backdrop-blur-md text-slate-900 dark:text-white transition-all duration-1000">
          <h2 className="text-3xl font-bold uppercase mb-4">The Cost of Bad Design</h2>
          <p className="font-mono opacity-60 mb-12 max-w-2xl">
            A bad website doesn't just look ugly. It leaks money every single day. If you don't have a 24/7 digital storefront, you are missing out on after-hours and online traffic. Use the slider below to see how much revenue you are losing by not working with us.
          </p>
          
          <div className="flex flex-col md:flex-row gap-16 items-center relative overflow-hidden">
            {/* Gamified Revenue Orb */}
            <motion.div 
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full blur-[80px] pointer-events-none mix-blend-screen opacity-20"
              style={{ backgroundColor: '#F43F5E' }}
              animate={{ 
                width: 200 + (dailyCustomers / 500) * 400,
                height: 200 + (dailyCustomers / 500) * 400,
                opacity: 0.1 + (dailyCustomers / 500) * 0.3
              }}
              transition={{ type: "spring", bounce: 0.5 }}
            />
            
            <div className="flex-1 w-full relative z-10">
              <label className="flex justify-between font-mono mb-4 text-xl">
                <span>Daily Shop Walk-ins / WhatsApp Messages:</span>
                <span className="text-slate-900 dark:text-[#06B6D4]">{dailyCustomers.toLocaleString()} customers</span>
              </label>
              <input 
                type="range" 
                min="5" 
                max="500" 
                step="5"
                value={dailyCustomers}
                onChange={(e) => setDailyCustomers(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
              <p className="font-mono text-sm opacity-50 mt-4">*Assuming an average ticket size of ₹1,000</p>
            </div>
            
            <div className="flex-1 w-full text-center md:text-right">
              <span className="block font-mono opacity-60 mb-2 uppercase tracking-widest text-sm">Potential Lost Revenue</span>
              <span className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-[#F43F5E]">
                ₹{lostRevenue.toLocaleString()}
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
