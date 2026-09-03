import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Hammer, Code2 } from 'lucide-react';

const UnderConstruction = () => {
  const [mounted, setMounted] = useState(false);
  
  // 3D Parallax Setup
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(mouseYSpring, [0, 1], [6, -6]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-6, 6]);

  const bgX = useTransform(mouseXSpring, [0, 1], [15, -15]);
  const bgY = useTransform(mouseYSpring, [0, 1], [15, -15]);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#eef8fc] overflow-hidden flex items-center justify-center font-sans perspective-[2000px]">
      
      {/* Parallax Background (Sky & Clouds) */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-[-50px] pointer-events-none"
      >
         <div className="absolute inset-0 bg-gradient-to-b from-[#bfe4f7] to-[#eef8fc]" />
         
         {/* Drifting Clouds (Faithful to original SVG but globally animated) */}
         {mounted && (
           <div className="absolute inset-0 opacity-95">
              
              <motion.div 
                animate={{ x: [0, 1500] }} 
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-[10%] left-[-200px]"
              >
                <svg width="200" height="100" viewBox="0 0 150 100" fill="#ffffff">
                  <ellipse cx="50" cy="50" rx="34" ry="16"/>
                  <ellipse cx="76" cy="42" rx="24" ry="14"/>
                  <ellipse cx="26" cy="46" rx="20" ry="12"/>
                </svg>
              </motion.div>
              
              <motion.div 
                animate={{ x: [0, -1500] }} 
                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                className="absolute top-[25%] right-[-200px] scale-75 opacity-70"
              >
                <svg width="250" height="150" viewBox="0 0 150 100" fill="#ffffff">
                  <ellipse cx="70" cy="50" rx="46" ry="18"/>
                  <ellipse cx="104" cy="44" rx="26" ry="15"/>
                  <ellipse cx="40" cy="48" rx="24" ry="13"/>
                </svg>
              </motion.div>
              
              <motion.div 
                animate={{ x: [-1000, 1000] }} 
                transition={{ duration: 45, repeat: Infinity, ease: "linear", delay: 5 }}
                className="absolute top-[5%] left-[20%] scale-110 opacity-80"
              >
                <svg width="180" height="90" viewBox="0 0 150 100" fill="#ffffff">
                  <ellipse cx="50" cy="50" rx="30" ry="14"/>
                  <ellipse cx="70" cy="44" rx="18" ry="11"/>
                </svg>
              </motion.div>

           </div>
         )}
      </motion.div>

      {/* Main 3D Billboard Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="relative w-full max-w-[900px] p-6 transform-gpu z-10"
      >
        <div className="relative w-full aspect-[680/480]">
          
          {/* Billboard Frame & Support Structure (SVG) */}
          <svg width="100%" height="100%" viewBox="0 0 680 480" className="absolute inset-0 z-0 drop-shadow-2xl pointer-events-none overflow-visible">
            
            {/* Flying Birds */}
            <path d="M0 70 q8 -8 16 0 q8 -8 16 0" fill="none" stroke="#5b6670" strokeWidth="2" strokeLinecap="round" className="animate-[fly_16s_linear_infinite]" />
            <path d="M0 105 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="#5b6670" strokeWidth="1.6" strokeLinecap="round" className="animate-[fly_21s_linear_infinite] delay-[-6s]" />

            {/* Leaves */}
            <g transform="translate(600, 400)" className="animate-[sway_5s_ease-in-out_infinite_alternate] origin-[30px_30px]">
              <path fill="#7fb069" d="M10 15 Q30 0 55 10 Q35 25 10 15Z"/>
              <path fill="#7fb069" d="M5 35 Q28 25 48 38 Q26 48 5 35Z"/>
            </g>

            {/* Support Pillars & Struts */}
            <rect x="330" y="345" width="20" height="135" rx="3" fill="#5b6670"/>
            <line x1="340" y1="345" x2="100" y2="340" stroke="#5b6670" strokeWidth="4" strokeLinecap="round"/>
            <line x1="340" y1="345" x2="580" y2="340" stroke="#5b6670" strokeWidth="4" strokeLinecap="round"/>
            <rect x="90" y="336" width="500" height="9" rx="3" fill="#5b6670"/>

            {/* Lights */}
            <line x1="120" y1="150" x2="120" y2="128" stroke="#5b6670" strokeWidth="3"/>
            <circle cx="120" cy="124" r="4" fill="#f2a54a" className="animate-[blink_1.6s_ease-in-out_infinite] shadow-[0_0_10px_#f2a54a]"/>
            <line x1="560" y1="150" x2="560" y2="128" stroke="#5b6670" strokeWidth="3"/>
            <circle cx="560" cy="124" r="4" fill="#f2a54a" className="animate-[blink_1.6s_ease-in-out_infinite] shadow-[0_0_10px_#f2a54a]" style={{animationDelay: '0.8s'}}/>

            {/* Outer Frame */}
            <rect x="70" y="150" width="540" height="190" rx="8" fill="#20242b"/>
          </svg>

          {/* HTML Overlay Panel (The actual billboard screen) */}
          <div 
            className="absolute rounded-sm overflow-hidden bg-gradient-to-br from-[#12151b] to-[#1a1e26] flex flex-col items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto"
            style={{ 
              left: '12.05%', 
              top: '33.75%', 
              width: '75.88%', 
              height: '34.58%'
            }}
          >
             {/* Screen Glare Overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10 mix-blend-overlay" />
             
             {/* Animated Grid Pattern */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none animate-[slide_10s_linear_infinite]" />
             
             {mounted && (
               <div className="relative z-20 flex flex-col items-center justify-center w-full h-full p-4 md:p-6 lg:p-8">
                 
                 {/* Top Status */}
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2, duration: 0.8 }}
                   className="flex items-center gap-2 mb-1.5 md:mb-3"
                 >
                   <Code2 className="text-[#f2a54a] w-3 h-3 md:w-5 md:h-5 animate-pulse" />
                   <span className="text-[#f2a54a] font-mono text-[8px] md:text-[10px] tracking-[0.2em] uppercase font-bold">
                     System Architecture V2
                   </span>
                 </motion.div>
                 
                 {/* Main Title */}
                 <motion.h1 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.4, type: "spring" }}
                   className="text-base md:text-2xl lg:text-3xl font-black text-white tracking-tight mb-1 md:mb-2 text-center"
                 >
                   SITE UNDER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2a54a] to-yellow-300">CONSTRUCTION</span>
                 </motion.h1>
                 
                 {/* Subtitle */}
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.6 }}
                   className="text-[#a7afba] text-[8px] md:text-xs text-center max-w-[85%] mb-3 md:mb-5 font-medium leading-relaxed"
                 >
                   We're currently building a next-generation experience. Compiling assets and establishing secure connections...
                 </motion.p>
                 
                 {/* Premium Animated Progress Bar */}
                 <div className="w-[85%] bg-gray-900 rounded-full h-1 md:h-1.5 border border-gray-700 p-[1px] relative overflow-hidden mb-3 md:mb-5">
                    <motion.div 
                       className="h-full bg-gradient-to-r from-[#f2a54a] via-yellow-400 to-[#f2a54a] rounded-full"
                       initial={{ width: '0%', backgroundPosition: '0% 50%' }}
                       animate={{ 
                         width: ['0%', '100%', '0%'],
                         backgroundPosition: ['100% 50%', '0% 50%'] 
                       }}
                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       style={{ backgroundSize: '200% 200%' }}
                    />
                 </div>

                 {/* Interactive Action Button */}
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="group flex items-center gap-1.5 md:gap-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-[8px] md:text-[11px] font-semibold text-white transition-all backdrop-blur-sm shadow-[0_0_15px_rgba(242,165,74,0.15)] hover:shadow-[0_0_25px_rgba(242,165,74,0.4)] cursor-pointer"
                   onClick={() => alert('Thanks for your interest! We will notify you when we launch.')}
                 >
                   <Hammer className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-[#f2a54a] group-hover:-rotate-12 transition-transform" />
                   NOTIFY ME
                   <ArrowRight className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 group-hover:translate-x-1 transition-transform" />
                 </motion.button>

               </div>
             )}
          </div>
        </div>
      </motion.div>
      
      {/* Global Animations for SVG elements */}
      <style>{`
        @keyframes fly {
          0% { transform: translate(-40px, 0); }
          25% { transform: translate(160px, -10px); }
          50% { transform: translate(360px, 4px); }
          75% { transform: translate(560px, -8px); }
          100% { transform: translate(760px, 0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes slide {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
        @keyframes sway {
          from { transform: rotate(-3deg); }
          to { transform: rotate(3deg); }
        }
      `}</style>
      
    </div>
  );
};

export default UnderConstruction;
