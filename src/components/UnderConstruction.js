import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Music, Sparkles, Code, Play, Pause } from 'lucide-react';

const Cat = () => (
  <div className="absolute -top-[35px] md:-top-[45px] left-[15%] cursor-pointer group z-20">
    <svg viewBox="0 0 100 50" className="w-16 md:w-20 h-auto drop-shadow-lg">
       {/* Body */}
       <path d="M 20 50 Q 20 25 50 25 L 70 25 Q 90 25 90 50 Z" fill="#2c2f33" />
       {/* Ears */}
       <path d="M 25 30 L 20 10 L 40 22 Z" fill="#2c2f33" />
       <path d="M 45 22 L 55 10 L 60 27 Z" fill="#2c2f33" />
       {/* Tail */}
       <motion.path 
         d="M 85 45 Q 110 45 105 25" 
         stroke="#2c2f33" strokeWidth="6" fill="none" strokeLinecap="round"
         animate={{ d: ["M 85 45 Q 110 45 105 25", "M 85 45 Q 110 45 100 15", "M 85 45 Q 110 45 105 25"] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
       />
    </svg>
    {/* Zzz Animation */}
    <motion.div 
      animate={{ opacity: [0, 1, 0], y: [-5, -20], x: [0, 10] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
      className="absolute -top-4 right-0 text-[#2c2f33] font-bold text-xs"
    >
      z
    </motion.div>
    <motion.div 
      animate={{ opacity: [0, 1, 0], y: [-5, -25], x: [0, 15] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
      className="absolute -top-6 right-2 text-[#2c2f33] font-bold text-sm"
    >
      Z
    </motion.div>
  </div>
);

const Cloud = ({ top, duration, delay, scale, opacity }) => (
  <motion.div 
    initial={{ x: '-20vw' }}
    animate={{ x: '120vw' }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    className="absolute pointer-events-none"
    style={{ top, scale, opacity }}
  >
    <div className="w-48 h-12 bg-white rounded-full blur-[4px]" />
    <div className="w-32 h-12 bg-white rounded-full blur-[4px] absolute -top-6 left-8" />
  </motion.div>
);

const UnderConstruction = () => {
  const [time, setTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#ffb7b2] via-[#e2bfce] to-[#c2cbe5] flex flex-col items-center justify-end font-sans select-none">
      
      {/* Sun/Moon */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[15%] md:right-[20%] w-24 h-24 md:w-32 md:h-32 bg-[#ffecd2] rounded-full blur-[4px] shadow-[0_0_60px_#ffecd2] pointer-events-none"
      />

      {/* Floating Clouds */}
      {mounted && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Cloud top="15%" duration={45} delay={0} scale={1} opacity={0.6} />
          <Cloud top="25%" duration={60} delay={-20} scale={0.7} opacity={0.4} />
          <Cloud top="35%" duration={50} delay={-10} scale={1.2} opacity={0.5} />
        </div>
      )}

      {/* Main Billboard Scene */}
      <div className="relative z-20 w-full max-w-[900px] mb-[18vh] md:mb-[22vh] px-4 md:px-8 flex justify-center">
        
        {/* Support Pillars */}
        <div className="absolute -bottom-[25vh] left-[20%] md:left-[25%] w-6 md:w-8 h-[30vh] bg-[#3a3f47] border-l-4 border-[#2c2f33] rounded-t-sm shadow-xl" />
        <div className="absolute -bottom-[25vh] right-[20%] md:right-[25%] w-6 md:w-8 h-[30vh] bg-[#3a3f47] border-l-4 border-[#2c2f33] rounded-t-sm shadow-xl" />
        
        {/* Catwalk Platform */}
        <div className="absolute -bottom-3 md:-bottom-4 left-[10%] w-[80%] h-3 md:h-4 bg-[#2c2f33] border-t-2 border-[#4f5660] rounded-sm z-10 shadow-lg" />

        {/* Billboard Frame */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="relative w-full bg-[#2c2f33] p-3 md:p-5 rounded-xl md:rounded-2xl shadow-2xl border-b-[6px] md:border-b-8 border-[#1e2124]"
        >
          {/* Lo-Fi Cat on the Roof */}
          <Cat />

          {/* Top Frame Lights */}
          <div className="absolute -top-3 md:-top-4 left-0 w-full flex justify-evenly px-10 z-0">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex flex-col items-center">
                 <div className="w-4 h-2 md:w-6 md:h-3 bg-[#4f5660] rounded-t-sm"></div>
                 <div className="w-1 md:w-1.5 h-2 md:h-3 bg-[#2c2f33]"></div>
                 <div className="w-2 h-1 md:w-3 md:h-1.5 bg-[#f2a54a] rounded-full shadow-[0_2px_10px_#f2a54a] animate-pulse"></div>
               </div>
             ))}
          </div>

          {/* Inner Screen (Infogenic UI) */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] bg-[#fdfbf7] rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
             
             {/* Left Info Panel (Stats) */}
             <div className="w-full sm:w-[35%] bg-[#f4eee1] border-b sm:border-b-0 sm:border-r border-[#e8dcc4] p-4 md:p-6 flex flex-col justify-between shrink-0">
                
                <div>
                  <div className="flex items-center gap-2 text-[#8b7e6a] mb-2 md:mb-4">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase">System Status</span>
                  </div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#5c5446] leading-none mb-1">
                    BUILDING<br/>THE VIBE.
                  </h2>
                </div>
                
                <div className="bg-[#e8dcc4] rounded-lg p-3 md:p-4 mt-4 sm:mt-0 shadow-inner">
                  <div className="text-[#8b7e6a] text-[9px] md:text-[10px] font-bold uppercase mb-1 tracking-wider">Local Time</div>
                  <div className="text-[#5c5446] font-mono text-lg md:text-2xl font-black tracking-tight flex items-center gap-2">
                    {mounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "00:00"}
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>

             </div>

             {/* Right Content Panel */}
             <div className="w-full sm:w-[65%] p-5 md:p-8 flex flex-col justify-center relative">
                
                {/* Interactive Music Player Widget */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-4 right-4 bg-white shadow-md border border-[#e8dcc4] rounded-full px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 cursor-pointer z-10 group"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <motion.div animate={isPlaying ? { rotate: 360 } : {}} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                    <Music className="w-3 h-3 md:w-4 md:h-4 text-[#8b7e6a] group-hover:text-[#f2a54a] transition-colors" />
                  </motion.div>
                  <span className="text-[10px] md:text-xs font-bold text-[#8b7e6a] select-none">
                    {isPlaying ? "Lo-Fi Beats" : "Paused"}
                  </span>
                  {isPlaying ? (
                     <Pause className="w-3 h-3 text-[#8b7e6a] hidden group-hover:block" />
                  ) : (
                     <Play className="w-3 h-3 text-[#8b7e6a] hidden group-hover:block" />
                  )}
                </motion.div>

                {/* Typography */}
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-[#f2a54a]" />
                  <span className="text-[#f2a54a] font-bold text-[10px] uppercase tracking-widest">Under Construction</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#5c5446] mb-3 leading-tight">
                  Quietly brewing <br/>something new.
                </h1>
                
                <p className="text-[#8b7e6a] text-[10px] md:text-[13px] max-w-[90%] leading-relaxed mb-6 font-medium">
                  We're taking a moment to rebuild and refresh our digital space. Grab a warm drink, enjoy the view, and check back soon.
                </p>

                {/* Smooth Progress Bar */}
                <div className="w-full max-w-[85%] mt-auto">
                  <div className="flex justify-between text-[9px] md:text-[10px] font-bold text-[#8b7e6a] mb-2 uppercase tracking-widest">
                    <span>Installation Progress</span>
                    <span>72%</span>
                  </div>
                  <div className="w-full h-2 md:h-3 bg-[#e8dcc4] rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#ffb7b2] to-[#f2a54a]"
                      initial={{ width: '0%' }}
                      animate={{ width: '72%' }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Floating Coffee Icon */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 right-8 text-[#e8dcc4]"
                >
                  <Coffee className="w-16 h-16 md:w-24 md:h-24 opacity-40 drop-shadow-sm" />
                </motion.div>

             </div>

          </div>
        </motion.div>
      </div>

      {/* The Layered Grassy Hills (Lo-Fi Landscape) */}
      <div className="absolute bottom-0 w-full h-[25vh] md:h-[30vh] z-30 pointer-events-none overflow-hidden flex flex-col justify-end">
        {/* Back Hill */}
        <div className="absolute bottom-[-10vh] left-[-10%] w-[120%] h-[35vh] md:h-[40vh] bg-[#95d5b2] rounded-[50%_50%_0_0] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]" />
        {/* Mid Hill */}
        <div className="absolute bottom-[-5vh] left-[-20%] w-[80%] h-[25vh] md:h-[30vh] bg-[#74c69d] rounded-[50%_50%_0_0] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]" />
        {/* Front Hill */}
        <div className="absolute bottom-[-8vh] right-[-15%] w-[85%] h-[28vh] md:h-[35vh] bg-[#52b788] rounded-[50%_50%_0_0] shadow-[0_-5px_20px_rgba(0,0,0,0.05)]" />
      </div>

    </div>
  );
};

export default UnderConstruction;
