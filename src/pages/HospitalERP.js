import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader';

const blindVariants = {
  initial: { height: "100vh", top: 0 },
  animate: (i) => ({
    height: "0vh",
    top: 0,
    transition: { delay: i * 0.08, duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  }),
  exit: (i) => ({
    height: "100vh",
    top: "auto",
    bottom: 0,
    transition: { delay: (4 - i) * 0.08, duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  })
};

export default function HospitalHub() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [loading]);

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />

      <AnimatePresence>
        {!loading && (
          <div className="fixed inset-0 z-[100] flex pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={blindVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-1/5 bg-slate-900"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="min-h-screen bg-[#050505] text-white font-sans selection:bg-slate-700 relative overflow-hidden"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Hospital Tech & ERP | Antigravity</title>
          <meta name="description" content="Digital solutions for modern hospitals." />
        </Helmet>

        {/* Home Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full shadow-sm border border-white/20 text-slate-300 hover:text-white hover:scale-105 hover:bg-white/20 transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>

        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10 min-h-screen flex flex-col justify-center">
          
          <div className="text-center mb-16 md:mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-6"
            >
              The Complete <br className="md:hidden" /> Digital Hospital.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="text-lg md:text-2xl text-slate-400 font-light max-w-3xl mx-auto"
            >
              To run a successful hospital, you need two things: A powerful engine to <strong className="text-blue-400 font-medium">acquire patients</strong>, and a seamless system to <strong className="text-emerald-400 font-medium">manage them</strong>.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Website / Patient Acquisition Route */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              onClick={() => navigate('/hospital-website')}
              className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 md:p-14 overflow-hidden cursor-pointer hover:border-blue-500/50 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-8 border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Patient Acquisition</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Build a high-conversion digital front door. Dominate local search, showcase your specialists, and instantly book appointments via WhatsApp.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 text-blue-400 font-bold tracking-widest uppercase text-sm group-hover:gap-5 transition-all duration-300">
                  Explore Website Solutions <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </motion.div>

            {/* Software / HMIS Route */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              onClick={() => navigate('/hospital-software')}
              className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 md:p-14 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hospital Operations</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Stop revenue leakage and clinical frustration. Implement a tailored HMIS engine with lightning-fast EMR, IPD/OPD billing, and integrated pharmacy.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 text-emerald-400 font-bold tracking-widest uppercase text-sm group-hover:gap-5 transition-all duration-300">
                  Explore HMIS Solutions <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </>
  );
}
