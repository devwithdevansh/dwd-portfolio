import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ResponsiveCamera from '../components/ResponsiveCamera';
import { Environment } from '@react-three/drei';
import Preloader from '../components/Preloader';
import GlowingPulse from '../components/GlowingPulse';
import DNAHelix from '../components/DNAHelix';
import HospitalModelViewer from '../components/HospitalModelViewer';

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
  const [contactName, setContactName] = useState("");
  const [contactHospital, setContactHospital] = useState("");

  const handleWhatsApp = () => {
    const message = `Hi, my name is ${contactName || "[Your Name]"} and I run ${contactHospital || "[Your Hospital / Clinic]"}. We are done struggling with fragmented systems. Let's test Unified Hospital Systems.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919687629341?text=${encodedMessage}`, "_blank");
  };

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
        className="min-h-screen bg-transparent text-slate-900 font-sans relative overflow-x-hidden selection:bg-blue-600 selection:text-white transition-colors duration-500"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Unified Hospital Systems | DWD</title>
          <meta name="description" content="The complete digital solution for modern hospitals. Websites and HMIS." />
        </Helmet>

        {/* Home Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:scale-105 hover:bg-white transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>

        {/* MAIN SCROLLING CONTENT WRAPPER */}
        <div className="relative z-10 bg-slate-50 text-slate-900 rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-colors duration-500">

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

              <div className="lg:w-1/2 w-full h-[400px] lg:h-[600px] relative flex items-center justify-center cursor-grab active:cursor-grabbing">
                 <Suspense fallback={<div className="w-full h-full flex items-center justify-center animate-pulse"><div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div></div>}>
                   <Canvas camera={{ position: [0, 10, 22], fov: 40 }} shadows>
                  <ResponsiveCamera defaultFov={40} mobileFov={65} />
                     {/* Pass your future model URL here: <HospitalModelViewer modelUrl="/models/hospital.glb" /> */}
                     <HospitalModelViewer />
                   </Canvas>
                 </Suspense>
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
        <section id="patient-acquisition" className="relative w-full min-h-screen bg-white text-slate-900 py-32 overflow-hidden selection:bg-blue-600 selection:text-white">
           {/* Ambient Blue Background */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
           <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                 
                 {/* 3D Canvas */}
                 <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative order-2 lg:order-1">
                   <Suspense fallback={<div className="w-full h-full animate-pulse bg-blue-50 rounded-[3rem]" />}>
                     <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ResponsiveCamera defaultFov={45} mobileFov={70} />
                       <ambientLight intensity={0.5} />
                       <directionalLight position={[10, 10, 5]} intensity={1} color="#60a5fa" />
                       <GlowingPulse />
                       <Environment preset="city" />
                     </Canvas>
                   </Suspense>
                 </div>

                 {/* Content */}
                 <div className="w-full lg:w-1/2 order-1 lg:order-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-bold tracking-widest uppercase mb-6">
                       Phase 1: The Front Door
                    </div>
                    <KineticHeading text="Patient Acquisition Engine." className="text-5xl md:text-7xl mb-8" />
                    
                    <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
                      Your website shouldn't just look pretty. It needs to actively funnel patients into your hospital. We build extremely fast, SEO-optimized digital front doors.
                    </p>

                    <div className="space-y-8">
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:border-blue-400 transition-colors">
                            <span className="text-blue-600 font-bold text-xl">01</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Local SEO Dominance</h3>
                            <p className="text-slate-600 leading-relaxed">Programmatic SEO pages for every specialty, ensuring you rank #1 when a patient searches for "cardiologist near me".</p>
                          </div>
                       </div>
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:border-blue-400 transition-colors">
                            <span className="text-blue-600 font-bold text-xl">02</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">WhatsApp Appointment Booking</h3>
                            <p className="text-slate-600 leading-relaxed">Frictionless lead capture. Patients click a button and immediately start booking via automated WhatsApp flows.</p>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </section>


        {/* 4. HOSPITAL OPERATIONS (SOFTWARE / EMERALD THEME) */}
        <section id="hospital-operations" className="relative w-full min-h-screen bg-slate-50 text-slate-900 py-32 overflow-hidden selection:bg-emerald-500 selection:text-white">
           {/* Ambient Emerald Background */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-slate-50" />
           <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none" />

           <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                 
                 {/* Content */}
                 <div className="w-full lg:w-1/2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-bold tracking-widest uppercase mb-6">
                       Phase 2: The Core Engine
                    </div>
                    <KineticHeading text="Hospital Management Software." className="text-5xl md:text-7xl mb-8" />
                    
                    <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
                      Once the patient arrives, the real work begins. We replace fragmented spreadsheets and legacy systems with a lightning-fast, custom HMIS.
                    </p>

                    <div className="space-y-8">
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:border-emerald-400 transition-colors">
                            <span className="text-emerald-600 font-bold text-xl">01</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Automated IPD/OPD Billing</h3>
                            <p className="text-slate-600 leading-relaxed">Stop revenue leakage. Every lab test, ward bed, and doctor consultation is tracked and billed flawlessly.</p>
                          </div>
                       </div>
                       <div className="group flex gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:border-emerald-400 transition-colors">
                            <span className="text-emerald-600 font-bold text-xl">02</span>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Integrated EMR & Pharmacy</h3>
                            <p className="text-slate-600 leading-relaxed">Doctors prescribe on the tablet, and the pharmacy instantly receives the order. No paper, no delays, no mistakes.</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* 3D Canvas */}
                 <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative">
                   <Suspense fallback={<div className="w-full h-full animate-pulse bg-emerald-50 rounded-[3rem]" />}>
                     <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                  <ResponsiveCamera defaultFov={45} mobileFov={70} />
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

        {/* 5. CTA SECTION - REMOVED FOR PARALLAX */}
        </div> {/* End of main scrolling content container */}

        {/* Spacer for Parallax Reveal */}
        <div className="h-screen w-full pointer-events-none" />

        {/* CINEMATIC PARALLAX FOOTER WITH WHATSAPP MAD LIBS */}
        <div className="fixed bottom-0 left-0 w-full h-screen z-0 bg-[#050505] text-white flex flex-col items-center justify-center pt-24 pb-12">
           <section id="contact" className="w-full max-w-5xl px-6 relative z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="relative z-20">
               <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter uppercase text-slate-400">
                 Let's <span className="text-white">Talk.</span>
               </h2>
               
               <p className="text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed lg:leading-snug text-slate-100">
                 Hi, my name is <br className="md:hidden" />
                 <input 
                   type="text" 
                   value={contactName}
                   onChange={(e) => setContactName(e.target.value)}
                   placeholder="YOUR NAME" 
                   className="bg-transparent border-b-4 border-slate-700 focus:border-blue-500 outline-none text-blue-400 placeholder-slate-700 w-full md:w-auto md:min-w-[300px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br className="hidden md:block" />
                 I run <br className="md:hidden" />
                 <input 
                   type="text" 
                   value={contactHospital}
                   onChange={(e) => setContactHospital(e.target.value)}
                   placeholder="YOUR HOSPITAL / CLINIC" 
                   className="bg-transparent border-b-4 border-slate-700 focus:border-blue-500 outline-none text-blue-400 placeholder-slate-700 w-full md:w-auto md:min-w-[400px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br />
                 We are done struggling with fragmented systems. <br /> Let's test Unified Hospital Systems.
               </p>

               <div className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-8">
                 <button 
                   onClick={handleWhatsApp}
                   className="group relative inline-flex items-center justify-center px-10 py-6 bg-white text-black font-black uppercase tracking-widest text-lg md:text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform duration-300 w-full md:w-auto"
                   data-cursor="hover"
                 >
                   <span className="relative z-10 flex items-center gap-3">
                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.76 2.46 15.4 3.25 16.84L2 22L7.3 20.72C8.75 21.53 10.33 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.47 15.68C17.24 16.32 16.3 16.87 15.65 17.02C15.17 17.13 14.47 17.21 12.18 16.27C9.25 15.06 7.37 12.06 7.22 11.87C7.07 11.68 6 10.26 6 8.78C6 7.29 6.77 6.57 7.08 6.25C7.33 5.99 7.76 5.86 8.16 5.86C8.29 5.86 8.41 5.86 8.52 5.87C8.83 5.89 8.99 5.9 9.2 6.4C9.45 6.99 10.05 8.46 10.12 8.61C10.19 8.76 10.26 8.96 10.16 9.16C10.06 9.35 9.98 9.45 9.83 9.63C9.68 9.8 9.51 10 9.39 10.12C9.25 10.27 9.09 10.43 9.27 10.74C9.45 11.05 10.05 12.03 10.93 12.82C11.96 13.75 12.88 14.04 13.22 14.18C13.56 14.32 13.76 14.3 13.96 14.08C14.16 13.86 14.73 13.19 14.93 12.92C15.13 12.65 15.33 12.69 15.63 12.8C15.93 12.91 17.51 13.69 17.81 13.84C18.11 13.99 18.31 14.06 18.38 14.18C18.45 14.94 18.45 14.94 17.47 15.68Z" /></svg>
                     Send to WhatsApp
                   </span>
                   <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <span className="absolute z-10 opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300 flex items-center gap-3">
                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.76 2.46 15.4 3.25 16.84L2 22L7.3 20.72C8.75 21.53 10.33 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.47 15.68C17.24 16.32 16.3 16.87 15.65 17.02C15.17 17.13 14.47 17.21 12.18 16.27C9.25 15.06 7.37 12.06 7.22 11.87C7.07 11.68 6 10.26 6 8.78C6 7.29 6.77 6.57 7.08 6.25C7.33 5.99 7.76 5.86 8.16 5.86C8.29 5.86 8.41 5.86 8.52 5.87C8.83 5.89 8.99 5.9 9.2 6.4C9.45 6.99 10.05 8.46 10.12 8.61C10.19 8.76 10.26 8.96 10.16 9.16C10.06 9.35 9.98 9.45 9.39 10.12C9.25 10.27 9.09 10.43 9.27 10.74C9.45 11.05 10.05 12.03 10.93 12.82C11.96 13.75 12.88 14.04 13.22 14.18C13.56 14.32 13.76 14.3 13.96 14.08C14.16 13.86 14.73 13.19 14.93 12.92C15.13 12.65 15.33 12.69 15.63 12.8C15.93 12.91 17.51 13.69 17.81 13.84C18.11 13.99 18.31 14.06 18.38 14.18C18.45 14.94 18.45 14.94 17.47 15.68Z" /></svg>
                     Send to WhatsApp
                   </span>
                 </button>
                 <div className="text-slate-500 font-mono text-sm">
                   Direct Line:<br />
                   <span className="text-slate-300">+91 9687629341</span>
                 </div>
               </div>
             </div>
           </section>
        </div>

      </motion.div>
    </>
  );
}
