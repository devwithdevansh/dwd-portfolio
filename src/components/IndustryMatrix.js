import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { INDUSTRY_DATA } from '../data/IndustryData';
import CypherText from './CypherText';

// Multi-layered 3D Diorama Assets Configurations for Home Page Bento Grid
const DIORAMA_CONFIGS = {
  hospitals: [
    // 0. Foliage Left
    {
      src: require('../assets/projects/objects/hospital/try/leaves_left.png'),
      classes: 'w-[16%] h-[20%] left-[3%] bottom-[8%] z-[5] drop-shadow-lg',
      depth: 0.2,
      inDelay: 0.08,
      outDelay: 0.02,
      offsetY: 70,
    },
    // 1. Foliage Center
    {
      src: require('../assets/projects/objects/hospital/try/leaves_center.png'),
      classes: 'w-[18%] h-[18%] left-[20%] bottom-[12%] z-[5] drop-shadow-lg',
      depth: 0.25,
      inDelay: 0.10,
      outDelay: 0.03,
      offsetY: 85,
    },
    // 2. Foliage Right
    {
      src: require('../assets/projects/objects/hospital/try/leaves_right.png'),
      classes: 'w-[14%] h-[16%] right-[22%] bottom-[8%] z-[5] drop-shadow-lg',
      depth: 0.3,
      inDelay: 0.12,
      outDelay: 0.04,
      offsetY: 80,
    },
    // 3. Hospital Main Building
    {
      src: require('../assets/projects/objects/hospital/try/hospital.png'),
      classes: 'w-[82%] h-[92%] left-[6%] bottom-[0%] z-[10] drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)]',
      depth: 0.45,
      inDelay: 0.04,
      outDelay: 0.08,
      offsetY: 110,
    },
    // 4. Sign Board
    {
      src: require('../assets/projects/objects/hospital/try/sign_board.png'),
      classes: 'w-[24%] h-[32%] left-[1%] bottom-[0%] z-[15] drop-shadow-2xl',
      depth: 0.65,
      inDelay: 0.14,
      outDelay: 0.10,
      offsetY: 130,
    },
    // 5. Doctor & Patient
    {
      src: require('../assets/projects/objects/hospital/try/doctor.png'),
      classes: 'w-[28%] h-[38%] left-[33%] bottom-[2%] z-[20] drop-shadow-2xl',
      depth: 0.85,
      inDelay: 0.16,
      outDelay: 0.12,
      offsetY: 150,
    },
    // 6. Emergency Ambulance
    {
      src: require('../assets/projects/objects/hospital/try/ambulance.png'),
      classes: 'w-[42%] h-[46%] right-[-4%] bottom-[-2%] z-[22] drop-shadow-2xl',
      depth: 1.0,
      inDelay: 0.18,
      outDelay: 0.14,
      offsetY: 170,
    },
  ],
  hotels: [
    // 0. Background Luxury Resort Villas
    {
      src: require('../assets/projects/objects/hotel/ChatGPT Image Jul 25, 2026, 02_02_06 PM.png'),
      classes: 'w-[90%] h-[82%] right-[-4%] bottom-[0%] z-[5] drop-shadow-xl',
      depth: 0.2,
      inDelay: 0.04,
      outDelay: 0.02,
      offsetY: 70,
    },
    // 1. Grand Hotel Tower Architecture
    {
      src: require('../assets/projects/objects/hotel/ChatGPT Image Jul 25, 2026, 02_01_55 PM.png'),
      classes: 'w-[76%] h-[88%] right-[8%] bottom-[0%] z-[10] drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]',
      depth: 0.45,
      inDelay: 0.08,
      outDelay: 0.06,
      offsetY: 110,
    },
    // 2. Tropical Palms & Pool Deck
    {
      src: require('../assets/projects/objects/hotel/ChatGPT Image Jul 25, 2026, 02_03_10 PM.png'),
      classes: 'w-[88%] h-[56%] right-[-2%] bottom-[0%] z-[15] drop-shadow-xl',
      depth: 0.6,
      inDelay: 0.12,
      outDelay: 0.08,
      offsetY: 130,
    },
    // 3. Illuminated Entrance Pathway & Garden
    {
      src: require('../assets/projects/objects/hotel/ChatGPT Image Jul 25, 2026, 02_02_00 PM.png'),
      classes: 'w-[84%] h-[48%] right-[0%] bottom-[0%] z-[18] drop-shadow-xl',
      depth: 0.75,
      inDelay: 0.15,
      outDelay: 0.10,
      offsetY: 140,
    },
    // 4. Hotel Concierge / Bellboy with Golden Luggage Trolley
    {
      src: require('../assets/projects/objects/hotel/ChatGPT Image Jul 25, 2026, 02_01_35 PM.png'),
      classes: 'w-[32%] h-[48%] left-[10%] bottom-[0%] z-[22] drop-shadow-2xl',
      depth: 0.9,
      inDelay: 0.18,
      outDelay: 0.12,
      offsetY: 160,
    },
    // 5. Luxury Valet Sports Car / Limo Arrival
    {
      src: require('../assets/projects/objects/hotel/ChatGPT Image Jul 25, 2026, 01_37_41 PM.png'),
      classes: 'w-[44%] h-[44%] right-[4%] bottom-[-2%] z-[25] drop-shadow-2xl',
      depth: 1.0,
      inDelay: 0.20,
      outDelay: 0.15,
      offsetY: 175,
    },
  ],
  factories: [
    // 0. Factory Structure Background
    {
      src: require('../assets/projects/objects/Factory/ChatGPT Image Jul 25, 2026, 01_44_09 PM.png'),
      classes: 'w-[95%] h-[85%] right-[-2%] bottom-[0%] z-[5] drop-shadow-lg',
      depth: 0.25,
      inDelay: 0.05,
      outDelay: 0.02,
      offsetY: 70,
    },
    // 1. Heavy Plant Infrastructure
    {
      src: require('../assets/projects/objects/Factory/ChatGPT Image Jul 25, 2026, 01_47_14 PM.png'),
      classes: 'w-[88%] h-[85%] right-[2%] bottom-[0%] z-[10] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]',
      depth: 0.45,
      inDelay: 0.08,
      outDelay: 0.05,
      offsetY: 100,
    },
    // 2. High-Tech Automated Lines & Robotic Arms
    {
      src: require('../assets/projects/objects/Factory/ChatGPT Image Jul 25, 2026, 01_57_26 PM.png'),
      classes: 'w-[80%] h-[60%] right-[0%] bottom-[0%] z-[15] drop-shadow-xl',
      depth: 0.7,
      inDelay: 0.14,
      outDelay: 0.08,
      offsetY: 130,
    },
    // 3. Robotic Unit & Logistics
    {
      src: require('../assets/projects/objects/Factory/ChatGPT Image Jul 25, 2026, 01_42_30 PM.png'),
      classes: 'w-[45%] h-[55%] left-[8%] bottom-[0%] z-[22] drop-shadow-2xl',
      depth: 0.95,
      inDelay: 0.18,
      outDelay: 0.12,
      offsetY: 155,
    },
  ],
  jewelers: [
    // 0. Luxury Velvet Boutique Background
    {
      src: require('../assets/projects/objects/Jwellery/ChatGPT Image Jul 25, 2026, 02_04_43 PM.png'),
      classes: 'w-[95%] h-[85%] right-[-2%] bottom-[0%] z-[5] drop-shadow-lg',
      depth: 0.25,
      inDelay: 0.05,
      outDelay: 0.02,
      offsetY: 70,
    },
    // 1. High-Jewelry Showcase Architecture
    {
      src: require('../assets/projects/objects/Jwellery/ChatGPT Image Jul 25, 2026, 02_04_20 PM.png'),
      classes: 'w-[88%] h-[85%] right-[0%] bottom-[0%] z-[10] drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]',
      depth: 0.45,
      inDelay: 0.08,
      outDelay: 0.05,
      offsetY: 100,
    },
    // 2. Diamond Showcase & Ring Case
    {
      src: require('../assets/projects/objects/Jwellery/ChatGPT Image Jul 25, 2026, 02_04_30 PM.png'),
      classes: 'w-[75%] h-[60%] right-[0%] bottom-[0%] z-[15] drop-shadow-xl',
      depth: 0.7,
      inDelay: 0.14,
      outDelay: 0.08,
      offsetY: 130,
    },
    // 3. Gold Haute-Couture Jewelry Bust
    {
      src: require('../assets/projects/objects/Jwellery/ChatGPT Image Jul 25, 2026, 02_04_09 PM.png'),
      classes: 'w-[42%] h-[55%] left-[8%] bottom-[0%] z-[22] drop-shadow-2xl',
      depth: 0.95,
      inDelay: 0.18,
      outDelay: 0.12,
      offsetY: 155,
    },
  ],
};

const getBentoClasses = (index, indId) => {
  // Bespoke Masonry Layout for 11 items (3-column grid)
  if (indId === 'hospitals') return "md:col-span-3 md:row-span-2"; // Hospitals (Full Width Grand Diorama)
  if (indId === 'hotels') return "md:col-span-2 md:row-span-1";    // Hotels (Wide 2-col Luxury Diorama)
  if (indId === 'factories') return "md:col-span-1 md:row-span-1"; // Factories (1 col Multi-Layer)
  if (indId === 'jewelers') return "md:col-span-1 md:row-span-1";  // Jewelers (1 col Multi-Layer)
  if (indId === 'cafes') return "md:col-span-1 md:row-span-1";     // Cafes (1 col)
  if (indId === 'salons') return "md:col-span-2 md:row-span-1";    // Salons (Wide 2-col)
  if (indId === 'enterprise') return "md:col-span-3 md:row-span-1";// Enterprise (Full width bottom)
  return "md:col-span-1 md:row-span-1";
};

// Individual Diorama Layer with Precision In-Out Physics & 3D Parallax
const DioramaLayer = ({ layer, scrollYProgress, mouseSpringX, mouseSpringY, hovered }) => {
  const { depth, inDelay, outDelay, offsetY, src, classes } = layer;

  // Staggered In - Active - Out Animation Curve
  // [0.0 -> inEnd]: Pop in from bottom with staggered rise
  // [inEnd -> outStart]: Settled & active in viewport with continuous parallax
  // [outStart -> 1.0]: Smooth staggered exit upwards
  const inStart = Math.max(0, 0.02 + inDelay * 0.5);
  const inEnd = Math.min(0.35, 0.18 + inDelay * 0.7);
  const outStart = Math.max(0.68, 0.78 - outDelay * 0.5);
  const outEnd = Math.min(0.98, 0.90 + outDelay * 0.4);

  const popY = useTransform(
    scrollYProgress,
    [0, inStart, inEnd, outStart, outEnd, 1],
    [offsetY, offsetY * 0.85, 0, 0, -offsetY * 0.45, -offsetY * 0.75]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, inStart, inEnd, outStart, outEnd, 1],
    [0, 0, 1, 1, 0.15, 0]
  );

  const continuousParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [8 * depth, -30 * depth]
  );

  const continuousScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.94, 1, 1 + depth * 0.05, 0.95]
  );

  // Dynamic mouse depth shift (foreground shifts significantly more than background)
  const mouseShiftX = useTransform(mouseSpringX, (val) => val * (depth * 22));
  const mouseShiftY = useTransform(mouseSpringY, (val) => val * (depth * 15));

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none flex items-end justify-end transform-gpu"
      style={{
        y: popY,
        opacity,
      }}
    >
      <motion.img
        src={src}
        alt="Diorama layer"
        style={{
          y: continuousParallaxY,
          x: mouseShiftX,
          scale: continuousScale,
          translateY: mouseShiftY,
        }}
        className={`absolute pointer-events-none select-none object-contain object-bottom mix-blend-normal dark:mix-blend-luminosity transform-gpu ${classes}`}
        animate={hovered ? {
          filter: `drop-shadow(0 ${15 + depth * 15}px ${20 + depth * 20}px rgba(0,0,0,0.45)) contrast(105%)`,
        } : {
          filter: `drop-shadow(0 ${8 + depth * 8}px ${12 + depth * 12}px rgba(0,0,0,0.3)) contrast(100%)`,
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

const BentoCard = ({ ind, index, baseRoute }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const dioramaLayers = DIORAMA_CONFIGS[ind.id] || null;
  const isDiorama = Boolean(dioramaLayers);
  const isLarge = ind.id === 'hospitals';
  const isWide = ind.id === 'hotels' || ind.id === 'salons';

  // Smooth Springs for Mouse Parallax Tilt
  const mouseSpringConfig = { stiffness: 180, damping: 20, mass: 0.5 };
  const mouseX = useSpring(0, mouseSpringConfig);
  const mouseY = useSpring(0, mouseSpringConfig);

  // Viewport Scroll Tracker with Full In & Out Spectrum
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Card Container Physics (Pop in from bottom, stay active, exit upwards)
  const cardScale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.88, 1, 1, 0.92]);
  const cardY = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [80, 0, 0, -40]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Typography & Text Parallax
  const textParallaxY = useTransform(scrollYProgress, [0, 0.5, 1], [35, 0, -25]);

  // 3D Card Tilt Angles derived from spring-damped mouse coordinates
  const cardRotateX = useTransform(mouseY, [-1, 1], [4, -4]);
  const cardRotateY = useTransform(mouseX, [-1, 1], [-4, 4]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Normalized [-1, 1] relative to card center
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (clicked) return;
    setClicked(true);

    const targetRoute = ind.id === 'schools' ? '/education-erp'
      : ind.id === 'tuition' ? '/tuition-erp'
      : ind.id === 'hospitals' ? '/hospital-erp'
      : ind.id === 'jewelers' ? '/jewelry-erp'
      : ind.id === 'factories' ? '/factory-erp'
      : ind.id === 'hotels' ? '/hotel-erp'
      : ind.id === 'salons' ? '/salon-erp'
      : ind.id === 'gyms' ? '/gym-erp'
      : ind.id === 'enterprise' ? '/business-erp'
      : `${baseRoute}/industry/${ind.id}`;

    setTimeout(() => {
      navigate(targetRoute);
    }, 550);
  };

  // Dynamic card height based on size
  const cardHeightClass = isLarge
    ? 'h-[26rem] sm:h-[32rem]'
    : isWide
    ? 'h-[19rem] sm:h-[22rem]'
    : 'h-[16.5rem]';

  return (
    <motion.div
      ref={cardRef}
      onClick={handleClick}
      style={{
        scale: cardScale,
        y: cardY,
        opacity: cardOpacity,
        rotateX: cardRotateX,
        rotateY: cardRotateY,
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative w-full cursor-pointer rounded-[2.5rem] ${isLarge ? 'overflow-visible' : 'overflow-hidden'} glass-panel brutalist-card dark:bg-[#0a0a0a] dark:border-2 dark:border-gray-800 dark:shadow-none transition-shadow duration-500 block ${cardHeightClass} transform-gpu`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={clicked ? {
        scale: 0.88,
        filter: 'brightness(1.4) contrast(1.2)',
        boxShadow: `0 0 60px ${ind.color}90`,
      } : {}}
      whileHover={!clicked ? {
        y: -4,
        boxShadow: `0 30px 60px -15px ${ind.color}30, 0 10px 25px -5px rgba(0,0,0,0.15)`,
      } : undefined}
      whileTap={!clicked ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', mass: 1.5, stiffness: 220, damping: 20 }}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay rounded-[2.5rem]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23cbd5e1' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      {/* Typography: Left Aligned with Smooth Parallax */}
      <motion.div
        style={{ y: textParallaxY }}
        className={`absolute z-30 pointer-events-none transition-colors duration-1000 ${
          isLarge
            ? 'top-8 md:top-20 left-6 md:left-12 w-[90%] md:w-[42%] pr-4 md:pr-8'
            : isWide
            ? 'top-6 md:top-8 left-6 md:left-10 w-[85%] md:w-[48%] pr-4'
            : 'top-6 left-6 right-6'
        }`}
      >
        <motion.div
          className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-2 engraved-text dark:text-[inherit]"
          style={{ color: document.documentElement.classList.contains('dark') ? ind.color : undefined }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <span
            className="w-4 h-[2px]"
            style={{ backgroundColor: document.documentElement.classList.contains('dark') ? ind.color : 'rgba(20, 10, 5, 0.95)' }}
          />
          Sector {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </motion.div>

        <motion.h3
          className={`${isLarge ? 'text-4xl lg:text-6xl' : isWide ? 'text-3xl lg:text-5xl' : 'text-3xl lg:text-4xl'} font-black engraved-text dark:text-white uppercase tracking-tighter group-hover:pl-2 transition-all duration-500 break-words leading-none`}
          initial={{ opacity: 0, scale: 1.05, filter: 'brightness(2)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.05, ease: 'easeOut' }}
        >
          {ind.name}
        </motion.h3>

        {(isLarge || isWide) && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`mt-3 md:mt-5 ${isLarge ? 'text-base md:text-xl' : 'text-sm md:text-base'} font-medium text-[#2C1E16] dark:text-gray-300 drop-shadow-md leading-relaxed line-clamp-3 md:line-clamp-none`}
          >
            {ind.hero}
          </motion.p>
        )}
      </motion.div>

      {/* The Visual Stage: Multi-Layered Diorama or Fallback Image */}
      <div
        className={`absolute z-10 pointer-events-none flex items-end ${
          isLarge
            ? 'inset-x-0 bottom-0 top-[35%] md:top-0 md:inset-0 md:right-0 md:left-auto w-full md:w-[62%]'
            : isWide
            ? 'inset-x-0 bottom-0 top-[30%] md:top-0 md:inset-0 md:right-0 md:left-auto w-full md:w-[58%]'
            : 'inset-0 justify-end'
        }`}
      >
        {isDiorama ? (
          // Render rich layered 3D diorama
          dioramaLayers.map((layer, i) => (
            <DioramaLayer
              key={i}
              layer={layer}
              scrollYProgress={scrollYProgress}
              mouseSpringX={mouseX}
              mouseSpringY={mouseY}
              hovered={hovered}
            />
          ))
        ) : (
          ind.image && (
            <motion.div
              className="absolute inset-0 flex items-end justify-end pointer-events-none overflow-hidden"
              style={{
                y: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [40, 0, 0, -25]),
                opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
              }}
            >
              <motion.img
                src={ind.image}
                alt={ind.name}
                className="absolute w-[110%] h-[110%] -right-3 -bottom-3 object-contain object-bottom mix-blend-normal dark:mix-blend-luminosity transform-gpu select-none pointer-events-none"
                initial={{ opacity: 0.8, filter: 'grayscale(100%) contrast(140%) brightness(0.9)' }}
                animate={{
                  scale: hovered ? 1.06 : 1,
                  opacity: hovered ? 1 : 0.85,
                  filter: hovered
                    ? `grayscale(0%) drop-shadow(0 20px 30px ${ind.color}60) contrast(110%) brightness(1)`
                    : 'grayscale(100%) drop-shadow(0 0px 0px rgba(0,0,0,0)) contrast(140%) brightness(1.1)',
                }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              />
            </motion.div>
          )
        )}
      </div>

      {/* Forensic Interactive Overlays (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status: Operational</span>
        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: ind.color }}>
          Explore Ecosystem <span className="animate-pulse">_</span>
        </span>
      </div>

      {/* Dynamic Hover Gradient for Light/Dark Theme */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen z-20 rounded-[2.5rem]"
        animate={{ opacity: hovered ? (document.documentElement.classList.contains('dark') ? 0.2 : 0.08) : 0 }}
        style={{ background: `radial-gradient(circle at 80% 80%, ${ind.color}, transparent 70%)` }}
        transition={{ duration: 0.4 }}
      />

      {/* Dynamic Ambient Sheen on Mouse Movement (Light Mode) */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay z-40 dark:hidden rounded-[2.5rem]"
        animate={{ opacity: hovered ? 0.25 : 0 }}
        style={{
          background: `radial-gradient(circle 350px at 70% 60%, rgba(255,255,255,1), transparent 80%)`
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default function IndustryMatrix({ baseRoute = "" }) {
  const industries = Object.values(INDUSTRY_DATA);

  return (
    <section className="relative w-full min-h-screen bg-transparent dark:bg-[#050505] py-32 border-t border-slate-200 dark:border-gray-800 z-20 overflow-hidden transition-colors duration-1000">
      {/* Soft corporate noise overlay (Dark Mode Only) */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-30 mix-blend-multiply dark:mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

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
            <div key={ind.id} className={getBentoClasses(index, ind.id)}>
              <BentoCard ind={ind} index={index} baseRoute={baseRoute} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
