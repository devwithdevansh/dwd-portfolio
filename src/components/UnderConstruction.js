import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cloud = ({ delay, duration, top, scale }) => (
  <motion.div
    className="absolute left-[-250px] opacity-90 z-0"
    style={{ top, scale }}
    animate={{ x: ['0vw', '130vw'] }}
    transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
  >
    <svg width="200" height="120" viewBox="0 0 104 64" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M72 64H24C10.7452 64 0 53.2548 0 40C0 27.818 9.07106 17.7554 20.899 16.2081C25.0489 6.4384 34.8214 0 46 0C60.0384 0 71.7451 10.0279 74.3432 23.3615C75.4093 23.1259 76.5165 23 77.6522 23C92.2031 23 104 34.7969 104 49.3478C104 57.4398 100.354 64 72 64Z"/>
    </svg>
  </motion.div>
);

const Light = () => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-4 bg-gray-800 rounded-t-md shadow-inner"></div>
    <div className="w-2 h-4 bg-gray-900"></div>
    <div className="w-4 h-1 bg-yellow-200 shadow-[0_5px_15px_rgba(255,255,0,0.8)] rounded-full"></div>
  </div>
);

const DeviceCluster = () => (
  <div className="relative w-full max-w-[450px] h-[300px] flex items-end ml-4 md:ml-10">
    
    {/* Desktop */}
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="absolute bottom-[30px] left-0 w-[260px] md:w-[340px] h-[180px] md:h-[230px] bg-[#2a2a2a] rounded-t-xl p-3 md:p-4 shadow-xl z-10 flex flex-col"
    >
      <div className="w-full flex-1 bg-white rounded-sm p-3 md:p-4 flex flex-col gap-3 border border-gray-200">
        <div className="w-full h-8 bg-gray-200 rounded-sm"></div>
        <div className="w-full h-3 bg-gray-200 rounded-sm w-3/4"></div>
        <div className="flex gap-3 flex-1 mt-2">
          <div className="w-1/3 h-full bg-gray-200 rounded-sm"></div>
          <div className="w-2/3 h-full bg-gray-200 rounded-sm"></div>
        </div>
      </div>
      
      {/* Stand */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 md:w-28 h-10 bg-[#2a2a2a]" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}></div>
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 md:w-48 h-2 bg-[#222] rounded-t-md"></div>
    </motion.div>

    {/* Tablet */}
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="absolute bottom-0 right-[60px] md:right-[100px] w-[110px] md:w-[140px] h-[150px] md:h-[190px] bg-[#3a3a3a] rounded-xl p-2 md:p-3 shadow-2xl z-20 flex flex-col"
    >
      <div className="w-full flex-1 bg-white rounded-sm p-2 flex flex-col gap-2 border border-gray-200">
        <div className="w-full h-12 bg-gray-200 rounded-sm"></div>
        <div className="flex gap-2 h-10">
           <div className="w-1/3 bg-gray-200 rounded-sm"></div>
           <div className="w-1/3 bg-gray-200 rounded-sm"></div>
           <div className="w-1/3 bg-gray-200 rounded-sm"></div>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-sm"></div>
      </div>
      <div className="w-full h-4 flex items-center justify-center mt-1">
        <div className="w-2 h-2 rounded-full bg-[#222]"></div>
      </div>
    </motion.div>

    {/* Phone */}
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.5 }}
      className="absolute bottom-[5px] md:bottom-[10px] right-0 md:right-[20px] w-[50px] md:w-[65px] h-[100px] md:h-[130px] bg-[#1a1a1a] rounded-lg p-1.5 shadow-2xl z-30 flex flex-col"
    >
      <div className="w-full flex-1 bg-white rounded-sm p-1.5 flex flex-col gap-1.5 border border-gray-200">
        <div className="w-full h-8 bg-gray-200 rounded-sm"></div>
        <div className="w-full h-3 bg-gray-200 rounded-sm"></div>
        <div className="w-full h-3 bg-gray-200 rounded-sm w-4/5"></div>
      </div>
      <div className="w-full h-3 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#333]"></div>
      </div>
    </motion.div>

  </div>
);

const UnderConstruction = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#60A5FA] via-[#93C5FD] to-[#DBEAFE] overflow-hidden relative flex flex-col items-center justify-end font-sans pb-[10vh]">
      
      {/* Sky Background & Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && (
          <>
            <Cloud delay={0} duration={40} top="10%" scale={1.2} />
            <Cloud delay={15} duration={55} top="25%" scale={0.8} />
            <Cloud delay={5} duration={45} top="40%" scale={1.5} />
            <Cloud delay={25} duration={60} top="15%" scale={0.9} />
            <Cloud delay={35} duration={35} top="5%" scale={1.1} />
          </>
        )}
      </div>

      {/* Billboard Structure */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        
        {/* The Billboard */}
        <motion.div 
          initial={{ y: "100vh" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 50, duration: 1.5 }}
          className="relative max-w-6xl w-full"
        >
          {/* Top Lights */}
          <div className="absolute -top-8 left-0 w-full flex justify-evenly px-10 md:px-20 z-0">
            <Light /><Light /><Light /><Light /><Light />
          </div>

          {/* Frame */}
          <div className="bg-[#111] p-3 md:p-5 rounded-sm shadow-2xl relative z-10">
            {/* Canvas */}
            <div className="bg-white w-full aspect-[4/3] lg:aspect-[21/9] flex flex-col lg:flex-row items-center p-8 md:p-12 lg:p-16 gap-8 lg:gap-16 border-[1px] border-gray-200">
              
              {/* Left: Devices */}
              <div className="w-full lg:w-1/2 h-[250px] md:h-[350px] flex items-center justify-center lg:justify-start">
                 <DeviceCluster />
              </div>

              {/* Right: Typography */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left h-full">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1f2937] leading-[1.1] tracking-tight"
                >
                  Wanna <br className="hidden lg:block"/>
                  Grow the <br className="hidden lg:block"/>
                  <span className="text-[#1d4ed8]">Business?</span>
                </motion.h1>
                
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="w-full h-1 bg-[#1d4ed8] my-6 md:my-8 origin-left"
                />
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3, duration: 0.8 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1f2937]"
                >
                  We make <span className="text-[#1d4ed8]">Websites</span><br/>
                  for <span className="text-[#1d4ed8]">business</span>
                </motion.h2>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3, type: "spring", bounce: 0.5 }}
                  className="mt-8 self-center lg:self-start bg-yellow-400 text-black text-sm md:text-base font-bold px-4 py-2 rotate-[-2deg] shadow-md border-2 border-dashed border-black"
                >
                  🚧 WE ARE CURRENTLY REBUILDING THIS SITE 🚧
                </motion.div>
              </div>

            </div>
          </div>
          
          {/* Catwalk / Bottom Ledge */}
          <div className="absolute -bottom-4 -left-2 w-[calc(100%+16px)] h-4 bg-gradient-to-b from-gray-700 to-gray-900 border-t-2 border-gray-500 shadow-xl z-20"></div>
          <div className="absolute -bottom-8 -left-2 w-[calc(100%+16px)] h-4 flex justify-between px-4 z-10">
             {[...Array(15)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-gray-800 -mt-4"></div>
             ))}
          </div>

        </motion.div>

        {/* Support Pillar */}
        <div className="w-24 md:w-40 h-[30vh] bg-gradient-to-r from-gray-800 via-gray-600 to-gray-900 border-x-8 border-gray-950 relative z-0 mt-4 shadow-2xl flex flex-col items-center">
            {/* Ladder */}
            <div className="w-8 h-full border-x-4 border-gray-900 flex flex-col justify-evenly py-4 absolute right-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-full h-1.5 bg-gray-900"></div>
                ))}
            </div>
        </div>

      </div>

    </div>
  );
};

export default UnderConstruction;
