import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import GlowingOrb from '../components/GlowingOrb';
import Preloader from '../components/Preloader';

function KineticHeading({ text }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  const skewX = useTransform(skewVelocity, [-1000, 1000], [-3, 3]);
  const scaleY = useTransform(smoothVelocity, [-1000, 1000], [1.1, 0.9]);

  return (
    <motion.h2 
      className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter origin-bottom inline-block"
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

export default function EducationERP() {
  const [loading, setLoading] = useState(true);

  // Prevent scrolling while loading
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
                className="w-1/5 bg-blue-600"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="relative min-h-screen bg-transparent text-slate-900 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Education ERP & School Management System | Tailored by Antigravity</title>
          <meta name="description" content="Stop renting generic ERPs. Build a custom institution management engine with Antigravity." />
        </Helmet>

        {/* Subtle Close Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-white/50 text-slate-500 hover:text-slate-900 hover:scale-105 hover:shadow-md transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        {/* Modern Navbar */}
        <nav className="fixed top-0 w-full z-40 bg-white/40 backdrop-blur-xl border-b border-white/40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center md:justify-end gap-8">
            <a href="#comparison" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">The Trap</a>
            <a href="#pillars" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">The 3 Pillars</a>
            <a href="#contact" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">Consultation</a>
          </div>
        </nav>

        {/* MAIN SCROLLING CONTENT (Has solid background, rounded bottom) */}
        <div className="relative z-10 bg-slate-50 rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          {/* Hero Section with 3D Orb */}
          <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto">
            <div className="md:w-1/2 relative z-10 text-center md:text-left mt-20 md:mt-0" data-cursor="hero" data-cursor-text="SCROLL">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  You started a school to educate. <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                    Not to chase fees.
                  </span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-xl font-light leading-relaxed mx-auto md:mx-0">
                  You are currently spending 60% of your time managing frustrated parents and fixing spreadsheet errors. Stop renting generic ERPs. Build a unified institution.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#comparison" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full text-base shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform" data-cursor="button">
                    Why We Are Different
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="md:w-1/2 h-[500px] w-full relative z-0 mt-12 md:mt-0">
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-blue-100 rounded-full" />}>
                 <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                   <ambientLight intensity={0.5} />
                   <directionalLight position={[10, 10, 5]} intensity={1} />
                   <GlowingOrb />
                 </Canvas>
              </Suspense>
            </div>
          </section>

          {/* Edgy Comparison Section */}
          <section id="comparison" className="py-32 px-6 relative z-10 bg-[#050505] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  The <span className="text-red-500 line-through decoration-red-600 decoration-[6px]">Common ERP</span> Trap.
                </h2>
                <p className="mt-6 text-xl text-gray-400 font-light max-w-2xl mx-auto">
                  Most vendors sell you a boxed subscription and force your school to fit inside it. We build systems that fit your school.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                {/* The Trap (Red/Glitchy) */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="border border-red-900/30 bg-red-950/10 p-10 md:p-14 rounded-3xl relative overflow-hidden group"
                  data-cursor="trap" data-cursor-text="×"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-600/50" />
                  <h3 className="text-3xl font-bold text-red-500 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> The SaaS Trap
                  </h3>
                  <ul className="space-y-6">
                    {['You are forced into generic templates built for everyone else.', 'You must change your daily operations to fit their rigid software.', 'Your school is just another row in a bloated, slow system.', 'Customer support is just a sluggish, automated ticketing queue.'].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-400 font-medium text-lg border-b border-red-900/20 pb-4">
                        <span className="text-red-500 font-black text-xl">×</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* The Antigravity Way (Blue/Pristine) */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border border-blue-500/30 bg-blue-900/10 p-10 md:p-14 rounded-3xl relative overflow-hidden group hover:bg-blue-900/20 transition-colors duration-500 shadow-[0_0_50px_rgba(59,130,246,0.1)]"
                  data-cursor="engine" data-cursor-text="✓"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" /> The Tailored Engine
                  </h3>
                  <ul className="space-y-6">
                    {['Your system is custom-architected for your school\'s unique DNA.', 'The software is meticulously engineered to adapt to your processes.', 'Enterprise-grade, scalable infrastructure built for top-tier institutions.', 'Direct WhatsApp partnership with the engineers who built it.'].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-200 font-medium text-lg border-b border-blue-500/20 pb-4">
                        <span className="text-blue-400 font-black text-xl">✓</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* The 3 Pillars */}
          <section id="pillars" className="py-32 pb-40 px-6 relative z-10 bg-white rounded-b-[4rem] overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="mb-32 md:text-center">
                <KineticHeading text="The 3 Pillars of Transformation." />
                <p className="mt-6 text-xl md:text-2xl text-slate-500 font-light max-w-3xl md:mx-auto">
                  We don't build software features. We build business solutions for the three things that actually matter.
                </p>
              </div>
              
              <div className="space-y-32">
                {/* Pillar 1 */}
                <div className="flex flex-col md:flex-row gap-16 items-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2"
                  >
                    <div className="text-emerald-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-emerald-600" /> Pillar 01
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Fee Orchestration & <br />Revenue Protection.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Schools bleed money through manual receipt errors and awkward fee chasing. We eliminate the friction of getting paid.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">Our tailored engine handles automated WhatsApp reminders, instant UPI reconciliation, and empathetic but firm digital payment portals. We protect your cash flow silently.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-50/50" />
                     <div className="relative w-[80%] md:w-72 bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-center border border-slate-100 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        <div className="flex justify-between items-center mb-6">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Paid</span>
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-2">₹14,50,000</div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Collected This Week</div>
                     </div>
                  </motion.div>
                </div>

                {/* Pillar 2 */}
                <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2"
                  >
                    <div className="text-blue-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-blue-600" /> Pillar 02
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">The Trust Bridge <br />(Parent Experience).</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Parents often feel like they are just paying bills. They don't feel involved. We transform them from "customers" to "partners."</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">A premium, branded Parent Portal providing total transparency on attendance, academic progress, and institutional updates. When parents trust the system, they don't fight the fees.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-end justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-50/50" />
                     <div className="relative w-64 h-64 bg-white rounded-t-3xl shadow-2xl p-6 border-t border-x border-slate-100 hover:-translate-y-4 transition-transform duration-500 cursor-pointer">
                        <div className="h-2 w-1/3 bg-slate-200 rounded-full mb-6 mx-auto" />
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                             <div className="w-10 h-10 rounded-full bg-blue-100" />
                             <div>
                               <div className="h-3 w-20 bg-slate-200 rounded-full mb-2" />
                               <div className="h-2 w-12 bg-slate-200 rounded-full" />
                             </div>
                          </div>
                          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                             <div className="w-10 h-10 rounded-full bg-orange-100" />
                             <div>
                               <div className="h-3 w-24 bg-slate-200 rounded-full mb-2" />
                               <div className="h-2 w-16 bg-slate-200 rounded-full" />
                             </div>
                          </div>
                        </div>
                     </div>
                  </motion.div>
                </div>

                {/* Pillar 3 */}
                <div className="flex flex-col md:flex-row gap-16 items-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2"
                  >
                    <div className="text-orange-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-orange-600" /> Pillar 03
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Administrative Sanity <br />(Unified Engine).</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Your staff is burning out wearing too many hats. Stop making them enter the same data into three different spreadsheets.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">One single source of truth. When a student is admitted, their fee ledger, attendance record, and exam profile are generated instantly. No double-entry. Total operational sanity.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-amber-50/50" />
                     <div className="relative w-[70%] h-[80%] border border-slate-200 rounded-3xl grid grid-cols-2 grid-rows-2 gap-4 p-4 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 ${i % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200" />
                          </div>
                        ))}
                        {/* Connection Lines */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center z-10">
                          <div className="w-4 h-4 bg-slate-900 rounded-full animate-pulse" />
                        </div>
                     </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </section>
        </div> {/* End of main scrolling content */}

        {/* Spacer for Parallax Curtain Reveal */}
        <div className="h-[80vh] w-full pointer-events-none" />

        {/* Cinematic Parallax Footer */}
        <div className="fixed bottom-0 left-0 w-full h-[80vh] z-[-1] bg-[#020202] text-white flex flex-col items-center justify-center">
           <section id="contact" className="text-center w-full max-w-4xl px-6 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
             <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to build an <br />institution?</h2>
             <p className="text-xl md:text-2xl text-slate-400 mb-12 font-light">Stop renting generic software. Start owning your tailored engine.</p>
             <a href="#contact" className="group relative inline-flex items-center justify-center px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300">
               <span className="relative z-10">Book a Consultation</span>
               <div className="absolute inset-0 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
               <span className="absolute z-10 opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300">Book a Consultation</span>
             </a>
           </section>
        </div>

      </motion.div>
    </>
  );
}
