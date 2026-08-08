import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import TuitionClass3D from '../components/TuitionClass3D';
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

export default function TuitionERP() {
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactInstitution, setContactInstitution] = useState("");

  const handleWhatsApp = () => {
    const message = `Hello Devansh! My name is ${contactName || "[Your Name]"} and I run ${contactInstitution || "[Your Tuition Center]"}. We are done tracking batches on WhatsApp and want to build our tailored EdTech engine. Let's talk!`;
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
                className="w-1/5 bg-indigo-900"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="relative min-h-screen bg-transparent text-slate-900 font-sans overflow-x-hidden selection:bg-cyan-400 selection:text-indigo-900"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Tuition & Coaching Classes ERP | Tailored by Antigravity</title>
          <meta name="description" content="Upgrade your coaching institute. Build a custom student portal and automate batch management with Antigravity." />
        </Helmet>

        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-white/50 text-slate-500 hover:text-slate-900 hover:scale-105 hover:shadow-md transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        <nav className="fixed top-0 w-full z-40 bg-white/40 backdrop-blur-xl border-b border-white/40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center md:justify-end gap-8">
            <a href="#comparison" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">The Trap</a>
            <a href="#pillars" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">The 3 Pillars</a>
            <a href="#contact" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors">Consultation</a>
          </div>
        </nav>

        <div className="relative z-10 bg-slate-50 rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto">
            <div className="md:w-1/2 relative z-10 text-center md:text-left mt-20 md:mt-0" data-cursor="hero" data-cursor-text="SCROLL">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  You started teaching to educate. <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                    Not to chase fees.
                  </span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-xl font-light leading-relaxed mx-auto md:mx-0">
                  Stop running your coaching institute on WhatsApp groups and messy spreadsheets. Automate attendance, fees, and tests with your own branded EdTech engine.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#comparison" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full text-base shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform" data-cursor="button">
                    Why We Are Different
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="md:w-1/2 h-[600px] w-full relative z-0 mt-12 md:mt-0 cursor-grab active:cursor-grabbing">
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-indigo-100 rounded-full" />}>
                 <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                   <ambientLight intensity={0.5} />
                   <directionalLight position={[10, 10, 5]} intensity={1} />
                   <TuitionClass3D />
                 </Canvas>
              </Suspense>
            </div>
          </section>

          {/* Edgy Comparison Section */}
          <section id="comparison" className="py-32 px-6 relative z-10 bg-[#0a0f1c] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  The <span className="text-red-500 line-through decoration-red-600 decoration-[6px]">WhatsApp</span> Trap.
                </h2>
                <p className="mt-6 text-xl text-slate-400 font-light max-w-2xl mx-auto">
                  Running a professional coaching academy on a chat app makes you look small and leads to operational chaos.
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
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> The Chat App Trap
                  </h3>
                  <ul className="space-y-6">
                    {['PDFs get lost in the chat history instantly.', 'Parents are frustrated with unread messages and spam.', 'You manually track fees in an Excel sheet that crashes.', 'Your brand is indistinguishable from a neighborhood tutor.'].map((text, i) => (
                      <li key={i} className="flex gap-4 text-slate-400 font-medium text-lg border-b border-red-900/20 pb-4">
                        <span className="text-red-500 font-black text-xl">×</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* The Antigravity Way (Indigo/Cyan) */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border border-cyan-500/30 bg-indigo-900/20 p-10 md:p-14 rounded-3xl relative overflow-hidden group hover:bg-indigo-900/40 transition-colors duration-500 shadow-[0_0_50px_rgba(6,182,212,0.1)]"
                  data-cursor="engine" data-cursor-text="✓"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-indigo-500" />
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> The EdTech Engine
                  </h3>
                  <ul className="space-y-6">
                    {['A centralized digital portal for study materials and tests.', 'Parents get automated updates without bothering you.', 'Fee collection and receipt generation runs on autopilot.', 'You establish massive authority as a premium brand.'].map((text, i) => (
                      <li key={i} className="flex gap-4 text-slate-200 font-medium text-lg border-b border-indigo-500/20 pb-4">
                        <span className="text-cyan-400 font-black text-xl">✓</span> {text}
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
                <KineticHeading text="The 3 Pillars of Coaching." />
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
                    <div className="text-cyan-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-cyan-600" /> Pillar 01
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Batch & Fee <br />Automation.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Tracking who paid what across 15 different batches is a nightmare. We make it completely autonomous.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">Our engine handles automated WhatsApp fee reminders, tracks batch attendances flawlessly, and generates digital receipts instantly. You just teach, the system collects.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 to-indigo-50/50" />
                     <div className="relative w-[80%] md:w-72 bg-white rounded-3xl shadow-2xl p-8 flex flex-col justify-center border border-slate-100 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        <div className="flex justify-between items-center mb-6">
                          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                            <span className="font-bold text-cyan-600">JE</span>
                          </div>
                          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Batch Active</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-2">JEE Advanced</div>
                        <div className="flex justify-between mt-4 border-t border-slate-100 pt-4">
                           <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Attendance: <span className="text-cyan-600">92%</span></div>
                        </div>
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
                    <div className="text-indigo-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-indigo-600" /> Pillar 02
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">The Student <br />Portal.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">When students log into a beautiful, personalized portal, they take your classes much more seriously.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">Give them a stunning dashboard to view recorded lectures, attempt online mock tests, and track their performance analytics through radar charts and growth curves.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-end justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-50/50" />
                     <div className="relative w-72 h-64 bg-white rounded-t-3xl shadow-2xl p-6 border-t border-x border-slate-100 hover:-translate-y-4 transition-transform duration-500 cursor-pointer">
                        <div className="flex justify-between items-end mb-8 h-24 border-b border-slate-100 pb-4">
                          <div className="w-8 h-8 bg-indigo-200 rounded-t-md" />
                          <div className="w-8 h-12 bg-indigo-300 rounded-t-md" />
                          <div className="w-8 h-16 bg-indigo-400 rounded-t-md" />
                          <div className="w-8 h-24 bg-indigo-600 rounded-t-md shadow-[0_0_15px_rgba(79,70,229,0.4)]" />
                        </div>
                        <div className="h-3 w-1/3 bg-slate-200 rounded-full mb-2" />
                        <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
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
                    <div className="text-purple-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-purple-600" /> Pillar 03
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Digital Brand <br />Authority.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Parents pay premium fees when they perceive a premium brand.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">We don't just build the backend ERP. We build your front-facing marketing website with Awwwards-tier 3D animations that makes local competitors look like amateurs. Win trust before they even call you.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-fuchsia-50/50" />
                     <div className="relative w-32 h-64 bg-white rounded-[2rem] border-4 border-slate-900 p-2 hover:scale-105 transition-transform duration-500 cursor-pointer shadow-2xl flex flex-col">
                        <div className="w-full h-1/2 bg-slate-100 rounded-xl mb-2 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full border-2 border-purple-200" />
                        </div>
                        <div className="h-2 w-3/4 bg-slate-200 rounded-full mb-1" />
                        <div className="h-1 w-1/2 bg-slate-100 rounded-full mb-4" />
                        <div className="mt-auto h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                           <div className="h-1 w-8 bg-white/50 rounded-full" />
                        </div>
                     </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </section>
        </div>

        {/* Spacer for Parallax Curtain Reveal */}
        <div className="h-[80vh] w-full pointer-events-none" />

        {/* Cinematic Parallax Footer */}
        <div className="fixed bottom-0 left-0 w-full h-[80vh] z-0 bg-[#070b14] text-white flex flex-col items-center justify-center">
           <section id="contact" className="w-full max-w-5xl px-6 relative z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
             
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
                   className="bg-transparent border-b-4 border-slate-700 focus:border-cyan-400 outline-none text-cyan-400 placeholder-slate-700 w-full md:w-auto md:min-w-[300px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br className="hidden md:block" />
                 I run <br className="md:hidden" />
                 <input 
                   type="text" 
                   value={contactInstitution}
                   onChange={(e) => setContactInstitution(e.target.value)}
                   placeholder="YOUR COACHING CENTER" 
                   className="bg-transparent border-b-4 border-slate-700 focus:border-cyan-400 outline-none text-cyan-400 placeholder-slate-700 w-full md:w-auto md:min-w-[400px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br />
                 We are done struggling on WhatsApp. <br /> Let's build our EdTech engine.
               </p>

               <div className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-8">
                 <button 
                   onClick={handleWhatsApp}
                   className="group relative inline-flex items-center justify-center px-10 py-6 bg-white text-black font-black uppercase tracking-widest text-lg md:text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform duration-300 w-full md:w-auto"
                   data-cursor="hover"
                 >
                   <span className="relative z-10 flex items-center gap-3">
                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.76 2.46 15.4 3.25 16.84L2 22L7.3 20.72C8.75 21.53 10.33 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.47 15.68C17.24 16.32 16.3 16.87 15.65 17.02C15.17 17.13 14.47 17.21 12.18 16.27C9.25 15.06 7.37 12.06 7.22 11.87C7.07 11.68 6 10.26 6 8.78C6 7.29 6.77 6.57 7.08 6.25C7.33 5.99 7.76 5.86 8.16 5.86C8.29 5.86 8.41 5.86 8.52 5.87C8.83 5.89 8.99 5.9 9.2 6.4C9.45 6.99 10.05 8.46 10.12 8.61C10.19 8.76 10.26 8.96 10.16 9.16C10.06 9.35 9.98 9.45 9.83 9.63C9.68 9.8 9.51 10 9.39 10.12C9.25 10.27 9.09 10.43 9.27 10.74C9.45 11.05 10.05 12.03 10.93 12.82C11.96 13.75 12.88 14.04 13.22 14.18C13.56 14.32 13.76 14.3 13.96 14.08C14.16 13.86 14.73 13.19 14.93 12.92C15.13 12.65 15.33 12.69 15.63 12.8C15.93 12.91 17.51 13.69 17.81 13.84C18.11 13.99 18.31 14.06 18.38 14.18C18.45 14.3 18.45 14.94 17.47 15.68Z" /></svg>
                     Send to WhatsApp
                   </span>
                   <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <span className="absolute z-10 opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300 flex items-center gap-3">
                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.76 2.46 15.4 3.25 16.84L2 22L7.3 20.72C8.75 21.53 10.33 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.47 15.68C17.24 16.32 16.3 16.87 15.65 17.02C15.17 17.13 14.47 17.21 12.18 16.27C9.25 15.06 7.37 12.06 7.22 11.87C7.07 11.68 6 10.26 6 8.78C6 7.29 6.77 6.57 7.08 6.25C7.33 5.99 7.76 5.86 8.16 5.86C8.29 5.86 8.41 5.86 8.52 5.87C8.83 5.89 8.99 5.9 9.2 6.4C9.45 6.99 10.05 8.46 10.12 8.61C10.19 8.76 10.26 8.96 10.16 9.16C10.06 9.35 9.98 9.45 9.83 9.63C9.68 9.8 9.51 10 9.39 10.12C9.25 10.27 9.09 10.43 9.27 10.74C9.45 11.05 10.05 12.03 10.93 12.82C11.96 13.75 12.88 14.04 13.22 14.18C13.56 14.32 13.76 14.3 13.96 14.08C14.16 13.86 14.73 13.19 14.93 12.92C15.13 12.65 15.33 12.69 15.63 12.8C15.93 12.91 17.51 13.69 17.81 13.84C18.11 13.99 18.31 14.06 18.38 14.18C18.45 14.3 18.45 14.94 17.47 15.68Z" /></svg>
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
