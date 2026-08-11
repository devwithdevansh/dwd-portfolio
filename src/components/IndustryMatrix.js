import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { INDUSTRY_DATA } from '../data/IndustryData';
import CypherText from './CypherText';

const getBentoClasses = (index) => {
  // Bespoke Masonry Layout for 9 items (3-column grid)
  const classes = [
    "md:col-span-3 md:row-span-2", // 0: Hospitals (Full Width Diorama)
    "md:col-span-1 md:row-span-1", // 1: Car Detailing
    "md:col-span-1 md:row-span-1", // 2: Factories
    "md:col-span-1 md:row-span-1", // 3: Jewelers
    "md:col-span-2 md:row-span-1", // 4: Cafes (Wide)
    "md:col-span-2 md:row-span-1", // 5: Hotels (Wide)
    "md:col-span-1 md:row-span-1", // 6: Schools (Auto-fills next to Cafes)
    "md:col-span-1 md:row-span-1", // 7: Tuition (Auto-fills next to Hotels)
    "md:col-span-1 md:row-span-1", // 8: Gyms
    "md:col-span-2 md:row-span-1", // 9: Salons (Wide, fills row with Gyms)
    "md:col-span-3 md:row-span-1", // 10: Enterprise (Full width at bottom)
  ];
  return classes[index] || "col-span-1";
};



const BentoCard = ({ ind, index, baseRoute }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const navigate = useNavigate();
  
  const isLarge = index === 0;

  // Pop-Out Book Physics (Outer Card)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const cardY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const textParallaxY = useTransform(scrollYProgress, [0, 1], [50, 0]);

  // True Diorama Pop-Out Physics (Internal Layers rising from bottom)
  // Sequence: Background (0-0.2) -> Hospital (0.2-0.4) -> Leaves (0.4-0.6) -> Characters (0.6-0.9)
  const layerPopY = [
    useTransform(scrollYProgress, [0.4, 0.6], [80, 0]),    // 0: Leaves A
    useTransform(scrollYProgress, [0.45, 0.65], [100, 0]), // 1: Leaves B
    useTransform(scrollYProgress, [0.5, 0.7], [90, 0]),    // 2: Leaves C
    useTransform(scrollYProgress, [0.2, 0.4], [120, 0]),   // 3: Hospital
    useTransform(scrollYProgress, [0.6, 0.8], [150, 0]),   // 4: Doctor
    useTransform(scrollYProgress, [0.7, 0.9], [180, 0]),   // 5: Ambulance
    useTransform(scrollYProgress, [0.5, 0.7], [160, 0]),   // 6: Sign Board
  ];

  const layerOpacity = [
    useTransform(scrollYProgress, [0.35, 0.55], [0, 1]),   // 0: Leaves A
    useTransform(scrollYProgress, [0.4, 0.6], [0, 1]),     // 1: Leaves B
    useTransform(scrollYProgress, [0.45, 0.65], [0, 1]),   // 2: Leaves C
    useTransform(scrollYProgress, [0.15, 0.35], [0, 1]),   // 3: Hospital
    useTransform(scrollYProgress, [0.55, 0.75], [0, 1]),   // 4: Doctor
    useTransform(scrollYProgress, [0.65, 0.85], [0, 1]),   // 5: Ambulance
    useTransform(scrollYProgress, [0.45, 0.65], [0, 1]),   // 6: Sign Board
  ];
  
  // Continuous Parallax (as you keep scrolling past)
  const { scrollYProgress: internalScroll } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const layerParallaxY = [
    useTransform(internalScroll, [0, 1], [0, -15]),
    useTransform(internalScroll, [0, 1], [0, -25]),
    useTransform(internalScroll, [0, 1], [0, -20]),
    useTransform(internalScroll, [0, 1], [0, -50]),
    useTransform(internalScroll, [0, 1], [0, -100]),
    useTransform(internalScroll, [0, 1], [0, -80]),
    useTransform(internalScroll, [0, 1], [0, -60]),
  ];

  const layerScales = [
    useTransform(internalScroll, [0, 1], [1, 1.05]),
    useTransform(internalScroll, [0, 1], [1, 1.10]),
    useTransform(internalScroll, [0, 1], [1, 1.15]),
    useTransform(internalScroll, [0, 1], [1, 1.20]),
    useTransform(internalScroll, [0, 1], [1, 1.30]),
    useTransform(internalScroll, [0, 1], [1, 1.40]),
    useTransform(internalScroll, [0, 1], [1, 1.25]),
  ];

  const dioramaLayers = isLarge ? [
    // 0. Leaves A (Left burst)
    { src: require('../assets/projects/objects/hospital/try/leaves_left.png'), classes: 'w-[15%] h-[15%] left-[5%] bottom-[10%] object-contain object-bottom z-5 drop-shadow-xl' },
    // 1. Leaves B (Center burst)
    { src: require('../assets/projects/objects/hospital/try/leaves_center.png'), classes: 'w-[18%] h-[18%] left-[20%] bottom-[15%] object-contain object-bottom z-5 drop-shadow-xl' },
    // 2. Leaves C (Right burst)
    { src: require('../assets/projects/objects/hospital/try/leaves_right.png'), classes: 'w-[12%] h-[12%] right-[25%] bottom-[10%] object-contain object-bottom z-5 drop-shadow-xl' },
    
    // 3. Hospital Main Building (Lowered to sit naturally on its new large base)
    { src: require('../assets/projects/objects/hospital/try/hospital.png'), classes: 'w-[80%] h-[90%] left-[5%] bottom-[0%] object-contain object-bottom z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]' },
    
    // 4. Doctor & Patient (Moved to the center to stand on the actual stairs)
    { src: require('../assets/projects/objects/hospital/try/doctor.png'), classes: 'w-[25%] h-[35%] left-[34%] bottom-[2%] object-contain object-bottom z-20 drop-shadow-2xl' },
    // 5. Ambulance
    { src: require('../assets/projects/objects/hospital/try/ambulance.png'), classes: 'w-[40%] h-[45%] right-[-5%] bottom-[-5%] object-contain object-bottom z-20 drop-shadow-2xl' },
    // 6. Hospital Sign Board (Lowered and tucked to the left)
    { src: require('../assets/projects/objects/hospital/try/sign_board.png'), classes: 'w-[22%] h-[30%] left-[0%] bottom-[0%] object-contain object-bottom z-[15] drop-shadow-2xl' },
  ] : [];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (clicked) return;
    setClicked(true);
    
    // Pre-calculate route
    const targetRoute = ind.id === 'schools' ? '/education-erp' 
      : ind.id === 'tuition' ? '/tuition-erp'
      : ind.id === 'hospitals' ? '/hospital-erp'
      : ind.id === 'jewelers' ? '/jewelry-erp' 
      : ind.id === 'factories' ? '/factory-erp' 
      : ind.id === 'hotels' ? '/hotel-erp'
      : ind.id === 'salons' ? '/salon-erp'
      : `${baseRoute}/industry/${ind.id}`;
    
    // Delay navigation to let the click animation (shrink and glow) run
    setTimeout(() => {
      navigate(targetRoute);
    }, 600); // 600ms is perfectly timed for the animation to peak
  };

  return (
    <motion.div 
      ref={cardRef}
      onClick={handleClick}
      style={isLarge ? { scale: cardScale, y: cardY, opacity: cardOpacity } : {}}
      className={`group relative w-full cursor-pointer rounded-[2rem] ${isLarge ? 'overflow-visible' : 'overflow-hidden'} glass-panel brutalist-card dark:bg-[#0a0a0a] dark:border-2 dark:border-gray-800 dark:shadow-none transition-all duration-500 block ${isLarge ? 'h-[24rem] sm:h-[28rem]' : 'h-[15.5rem]'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      animate={clicked ? { 
        scale: 0.85, 
        filter: 'brightness(1.5) contrast(1.2)',
        boxShadow: `0 0 50px ${ind.color}80` 
      } : {}}
      whileHover={!clicked ? (isLarge ? { y: -2 } : { y: -5, scale: 0.99, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }) : undefined}
      whileTap={!clicked ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", mass: 2.5, stiffness: 200, damping: 25 }}
    >
      {/* Background Structural Grid */}
      <div className="absolute inset-0 opacity-[0.2] dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23cbd5e1' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Typography: Left Aligned for Diorama */}
      <motion.div 
        style={isLarge ? { y: textParallaxY } : {}}
        className={`absolute z-30 pointer-events-none transition-colors duration-1000 ${isLarge ? 'top-8 md:top-24 left-6 md:left-12 w-[90%] md:w-[40%] pr-4 md:pr-8' : 'top-6 left-6 right-6'}`}
      >
        <motion.div 
          className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-2 engraved-text dark:text-[inherit]" 
          style={{ color: document.documentElement.classList.contains('dark') ? ind.color : undefined }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
           <span className="w-4 h-[2px]" style={{ backgroundColor: document.documentElement.classList.contains('dark') ? ind.color : 'rgba(20, 10, 5, 0.95)' }}></span> Sector {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </motion.div>
        <motion.h3 
          className="text-4xl lg:text-6xl font-black engraved-text dark:text-white uppercase tracking-tighter group-hover:pl-2 transition-all duration-500 break-words leading-none"
          initial={{ opacity: 0, scale: 1.05, filter: 'brightness(2)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
        >
          {ind.name}
        </motion.h3>
        {isLarge && (
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 md:mt-8 text-base md:text-xl lg:text-2xl font-medium text-[#2C1E16] dark:text-gray-300 drop-shadow-md leading-relaxed"
          >
            {ind.hero}
          </motion.p>
        )}
      </motion.div>

      {/* The Expertly Blended Illustration (Diorama Multi-Layer or Single Image) */}
      <div className={`absolute z-10 pointer-events-none flex items-end ${isLarge ? 'inset-x-0 bottom-0 top-[40%] md:top-0 md:inset-0 md:right-0 md:left-auto w-full md:w-[60%]' : 'inset-0 justify-end'}`}>
        {isLarge ? (
          // Render all 7 Diorama Layers for massive depth, scattered across the right side
          dioramaLayers.map((layer, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 pointer-events-none flex items-end justify-end"
              style={{ y: layerPopY[i], opacity: layerOpacity[i] }}
            >
              <motion.img 
                src={layer.src} 
                alt={`Layer ${i}`}
                style={{ scale: layerScales[i], y: layerParallaxY[i] }}
                className={`absolute transition-all duration-700 mix-blend-normal dark:mix-blend-luminosity ${layer.classes}`}
              />
            </motion.div>
          ))
        ) : (
          ind.image && (
            <motion.img 
              src={ind.image} 
              alt={ind.name}
              className="absolute w-[110%] h-[110%] -right-4 -bottom-4 object-contain object-bottom transition-all duration-700 mix-blend-normal dark:mix-blend-luminosity"
              initial={{ opacity: 0.8, filter: 'grayscale(100%) contrast(150%) brightness(0.85)' }}
              animate={{
                scale: hovered ? 1.05 : 1,
                opacity: hovered ? 1 : 0.8,
                filter: hovered ? `grayscale(0%) drop-shadow(0 20px 30px ${ind.color}60) contrast(110%) brightness(1)` : 'grayscale(100%) drop-shadow(0 0px 0px rgba(0,0,0,0)) contrast(150%) brightness(1.2)',
              }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />
          )
        )}
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
      
      {/* The Craftsman's Touch: Dynamic Ambient Sheen (Light Mode Only) */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay z-40 dark:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 0.2 : 0 }}
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,1), transparent 80%)`
        }}
      />
    </motion.div>
  );
};

export default function IndustryMatrix({ baseRoute = "" }) {
  // We use the baseRoute prop to construct local URLs (e.g. /location/mumbai/industry/hospitals).
  // If baseRoute is empty, it constructs the global URL (e.g. /industry/hospitals).
  const industries = Object.values(INDUSTRY_DATA);

  return (
    <section className="relative w-full min-h-screen bg-transparent dark:bg-[#050505] py-32 border-t border-slate-200 dark:border-gray-800 z-20 overflow-hidden transition-colors duration-1000">
      
      {/* Soft corporate noise overlay (Dark Mode Only) */}
      <div className="absolute inset-0 opacity-0 dark:opacity-30 mix-blend-multiply dark:mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header Section */}
        <div className="mb-24 text-[#2C1E16] dark:text-white transition-colors duration-1000">
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
              <BentoCard ind={ind} index={index} baseRoute={baseRoute} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
