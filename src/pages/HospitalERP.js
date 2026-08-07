import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Sparkles, Environment } from '@react-three/drei';
import Preloader from '../components/Preloader';
import isometricHospital from '../assets/isometric_hospital.png';
import GlowingPulse from '../components/GlowingPulse';
import DNAHelix from '../components/DNAHelix';

function KineticHeading({ text, className }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  const skewX = useTransform(skewVelocity, [-1000, 1000], [-3, 3]);
  const scaleY = useTransform(smoothVelocity, [-1000, 1000], [1.1, 0.9]);

  return (
    <motion.h2 
      className={`font-black tracking-tighter origin-bottom inline-block ${className}`}
      style={{ skewX, scaleY }}
    >
      {text}
    </motion.h2>
  );
}

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
        className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Unified Hospital Systems | Antigravity</title>
          <meta name="description" content="The complete digital solution for modern hospitals. Websites and HMIS." />
        </Helmet>

        {/* Home Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:scale-105 hover:bg-white transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>

        {/* 1. HERO SECTION (The Vision) */}
        <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-300/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-300/30 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[60vh]">
              <div className="lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-8"
                >
                  <div className="flex -space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse delay-75" />
                  </div>
                  <span className="text-sm font-bold tracking-widest text-slate-600 uppercase">Unified Healthcare</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
                >
                  A hospital divided <br className="hidden md:block" />
                  <span className="text-slate-400">cannot scale.</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-xl mb-12"
                >
                  To run a successful hospital, you need two things: A powerful engine to <strong className="text-blue-600 font-bold">acquire patients</strong>, and a seamless system to <strong className="text-emerald-600 font-bold">manage them</strong>. We build both.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.8 }}
                >
                  <a href="#patient-acquisition" className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-xl">
                    Explore The System ↓
                  </a>
                </motion.div>
              </div>

              <div className="lg:w-1/2 w-full h-[400px] lg:h-[600px] relative flex items-center justify-center">
                 <motion.img 
                   src={isometricHospital}
                   alt="3D Isometric Hospital"
                   className="w-[90%] max-w-[600px] object-contain drop-shadow-2xl"
                   animate={{ y: [-15, 15, -15] }}
                   transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 />
              </div>
            </div>
          </div>
        </section>


        {/* 2. THE INTEGRATION GAP */}
        <section className="py-32 bg-white relative">
          <div className="max-w-5xl mx-auto px-6 text-center">
             <KineticHeading text="The Integration Gap." className="text-5xl md:text-7xl text-slate-900" />
             <p className="mt-8 text-xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed">
               Most hospitals buy a generic website from an agency, and clunky legacy software from a vendor. The result? Patients book online but the reception doesn't know. Doctors prescribe tests but the billing desk forgets to charge them.
             </p>
             <div className="w-24 h-1 bg-slate-200 mx-auto mt-12 rounded-full" />
          </div>
        </section>


        {/* 3. PATIENT ACQUISITION (WEBSITE / BLUE THEME) */}
        <section id="patient-acquisition" className="relative w-full min-h-screen bg-[#050505] text-white py-32 overflow-hidden selection:bg-blue-600">
           {/* Ambient Blue Background */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]" />
           <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                 
                 {/* 3D Canvas */}
                 <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative order-2 lg:order-1">
                   <Suspense fallback={<div className="w-full h-full animate-pulse bg-slate-900 rounded-[3rem]" />}>
                     <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                       <ambientLight intensity={0.5} />
                       <directionalLight position={[10, 10, 5]} intensity={1} color="#60a5fa" />
                       <GlowingPulse />
                       <Environment preset="city" />
                     </Canvas>
                   </Suspense>
                 </div>

                 {/* Content */}
                 <div className="w-full lg:w-1/2 order-1 lg:order-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase mb-6">
                       Phase 1: The Front Door
                    </div>
                    <KineticHeading text="Patient Acquisition Engine." className="text-5xl md:text-7xl mb-8" />
                    
                    <p className="text-xl text-slate-400 font-light leading-relaxed mb-12">
                      Your website shouldn't just look pretty. It needs to actively funnel patients into your hospital. We build extremely fast, SEO-optimized digital front doors.
                    </p>

                    <div className="space-y-8">
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors">
                            <span className="text-blue-500 font-bold text-xl">01</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Local SEO Dominance</h3>
                            <p className="text-slate-400 leading-relaxed">Programmatic SEO pages for every specialty, ensuring you rank #1 when a patient searches for "cardiologist near me".</p>
                          </div>
                       </div>
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors">
                            <span className="text-blue-500 font-bold text-xl">02</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Appointment Booking</h3>
                            <p className="text-slate-400 leading-relaxed">Frictionless lead capture. Patients click a button and immediately start booking via automated WhatsApp flows.</p>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </section>


        {/* 4. HOSPITAL OPERATIONS (SOFTWARE / EMERALD THEME) */}
        <section id="hospital-operations" className="relative w-full min-h-screen bg-slate-900 text-white py-32 overflow-hidden selection:bg-emerald-500">
           {/* Ambient Emerald Background */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900" />
           <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                 
                 {/* Content */}
                 <div className="w-full lg:w-1/2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-widest uppercase mb-6">
                       Phase 2: The Core Engine
                    </div>
                    <KineticHeading text="Hospital Management Software." className="text-5xl md:text-7xl mb-8" />
                    
                    <p className="text-xl text-slate-400 font-light leading-relaxed mb-12">
                      Once the patient arrives, the real work begins. We replace fragmented spreadsheets and legacy systems with a lightning-fast, custom HMIS.
                    </p>

                    <div className="space-y-8">
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-emerald-500 transition-colors">
                            <span className="text-emerald-500 font-bold text-xl">01</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Automated IPD/OPD Billing</h3>
                            <p className="text-slate-400 leading-relaxed">Stop revenue leakage. Every lab test, ward bed, and doctor consultation is tracked and billed flawlessly.</p>
                          </div>
                       </div>
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-emerald-500 transition-colors">
                            <span className="text-emerald-500 font-bold text-xl">02</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Integrated EMR & Pharmacy</h3>
                            <p className="text-slate-400 leading-relaxed">Doctors prescribe on the tablet, and the pharmacy instantly receives the order. No paper, no delays, no mistakes.</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* 3D Canvas */}
                 <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative">
                   <Suspense fallback={<div className="w-full h-full animate-pulse bg-slate-800 rounded-[3rem]" />}>
                     <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                       <ambientLight intensity={0.5} />
                       <directionalLight position={[10, 10, 5]} intensity={1} color="#34d399" />
                       <DNAHelix />
                       <Environment preset="city" />
                     </Canvas>
                   </Suspense>
                 </div>

              </div>
           </div>
        </section>

        {/* 5. CTA SECTION */}
        <section className="relative py-32 bg-slate-950 text-center">
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to unify your hospital?</h2>
              <p className="text-xl text-slate-400 mb-12">Book a demo today to see how our combined website and HMIS infrastructure can scale your hospital's operations.</p>
              <button className="px-10 py-5 rounded-full bg-white text-slate-900 font-bold uppercase tracking-widest hover:scale-105 hover:bg-slate-100 transition-all duration-300">
                Book a Demo
              </button>
           </div>
        </section>

      </motion.div>
    </>
  );
}
