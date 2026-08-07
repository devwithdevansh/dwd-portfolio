import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import CityIndustryList from '../components/CityIndustryList';
import AgencyFooter from '../components/AgencyFooter';
import ProofMarquee from '../components/ProofMarquee';
import { getCityData, getCityCopy, isValidLocation } from '../data/LocationData';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

// Brutalist Scramble Text Effect for Terminal Vibe
const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = '!<>-_\\\\/[]{}—=+*^?#_';
  
  useEffect(() => {
    let iteration = 0;
    let interval = null;
    
    interval = setInterval(() => {
      setDisplayText(text.split('').map((letter, index) => {
        if(index < iteration) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if(iteration >= text.length){
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

export default function CityLanding() {
  const { location } = useParams();
  const isValid = isValidLocation(location);
  const cityData = useMemo(() => getCityData(location), [location]);
  const copy = useMemo(() => getCityCopy(cityData?.name, cityData?.tier), [cityData]);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `DWD Digital Architecture - ${cityData.name}`,
    "image": "https://yourdomain.com/logo.png",
    "description": copy.heroSubtitle,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityData.name,
      "addressCountry": "IN"
    },
    "url": `https://yourdomain.com/location/${location}`
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen bg-transparent dark:bg-[#050505] transition-colors duration-1000 block"
    >
      <Helmet>
        <title>{copy.heroTitle} | Premier Web Design Agency</title>
        <meta name="description" content={copy.heroSubtitle} />
        <link rel="canonical" href={`https://yourdomain.com/location/${location}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Global Escape Hatch (Fixed Top Right) */}
      <div className="fixed top-6 right-6 md:right-12 z-50">
        <Link to="/" className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] px-4 py-3 bg-slate-900 text-white dark:bg-white dark:text-black hover:scale-105 transition-transform flex items-center gap-2">
          <span>Esc</span>
          <span className="w-px h-3 bg-slate-700 dark:bg-gray-300"></span>
          Global Ops
        </Link>
      </div>

      {/* LEFT SIDEBAR: Fixed Vertical Typography */}
      <div className="hidden md:flex flex-col items-center justify-between w-32 lg:w-48 h-screen fixed top-0 left-0 border-r border-slate-300 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] z-40 overflow-hidden">
        
        {/* Radar Scanner Line */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981]"
          animate={{ y: ['0vh', '100vh', '0vh'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <div className="mt-8">
          <span className="text-xs font-mono font-bold text-slate-400 rotate-90 block tracking-widest">
            {cityData.tier === 1 ? 'ALPHA' : cityData.tier === 2 ? 'BETA' : 'GAMMA'}_NODE
          </span>
        </div>

        {/* Vertical Massive Text */}
        <div className="flex-1 flex items-center justify-center -rotate-90 whitespace-nowrap">
          <h2 className="text-[10vh] font-black uppercase tracking-tighter text-slate-100 dark:text-[#111] pointer-events-none select-none">
            {cityData.name}
          </h2>
        </div>

        <div className="mb-8">
          <span className="text-[10px] font-mono font-bold text-emerald-500 animate-pulse tracking-widest">
            LIVE_SYNC
          </span>
        </div>
      </div>

      {/* Mobile Top Header (replaces sidebar on small screens) */}
      <div className="md:hidden w-full px-6 py-8 border-b border-slate-300 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex justify-between items-center z-40 sticky top-0">
        <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
          {cityData.name}
        </h2>
        <span className="text-[10px] font-mono font-bold text-emerald-500 animate-pulse tracking-widest">
          LIVE_SYNC
        </span>
      </div>

      {/* RIGHT CONTENT: Scrollable Funnel */}
      <div className="flex flex-col min-h-screen md:ml-32 lg:ml-48">
        
        {/* Terminal Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-32">
          <div className="max-w-4xl w-full">
            
            <div className="mb-8 flex items-center gap-4">
               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                 LOCAL PROTOCOL INITIATED
               </span>
               <span className="text-[10px] font-mono text-slate-400">
                 LAT/LONG_LOCKED
               </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[6vw] font-black uppercase tracking-tighter leading-[0.9] text-slate-900 dark:text-white mb-10">
              <ScrambleText text={copy.heroTitle} />
            </h1>
            
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 1 }}
              className="pl-6 border-l-2 border-slate-300 dark:border-gray-800"
            >
              <p className="text-lg md:text-2xl font-medium text-slate-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                {copy.heroSubtitle}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="mt-16"
            >
               <a href="#industries" className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white dark:bg-white dark:text-black font-bold uppercase tracking-[0.2em] group hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-colors duration-300">
                 <span>{copy.cta}</span>
                 <span className="w-8 h-px bg-current group-hover:w-12 transition-all"></span>
               </a>
            </motion.div>
            
          </div>
        </section>

        {/* Proof & Social Proof */}
        <div className="border-y border-slate-300 dark:border-gray-800 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
           <ProofMarquee />
        </div>

        {/* The New Industry List Component */}
        <div id="industries">
          <CityIndustryList baseRoute={`/location/${location}`} />
        </div>

        <AgencyFooter />
      </div>
    </motion.div>
  );
}
