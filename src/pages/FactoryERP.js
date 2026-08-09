import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ResponsiveCamera from '../components/ResponsiveCamera';
import Warehouse3D from '../components/Warehouse3D';
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

export default function FactoryERP() {
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactInstitution, setContactInstitution] = useState("");

  const handleWhatsApp = () => {
    const message = `Hello Devansh! My name is ${contactName || "[Your Name]"} and I run ${contactInstitution || "[Your Factory]"}. We are done running a 21st-century factory on 1990s software. Let's build our tailored engine.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919687629341?text=${encodedMessage}`, "_blank");
  };

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
                className="w-1/5 bg-[#EAB308]"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="relative min-h-screen bg-transparent text-slate-900 font-sans overflow-x-hidden selection:bg-[#EAB308] selection:text-slate-900"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Factory ERP & Digital Architecture | Tailored by DWD</title>
          <meta name="description" content="Stop running your manufacturing on chaotic spreadsheets. Build a tailored enterprise engine with DWD." />
        </Helmet>

        {/* Subtle Close Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-white/50 text-slate-500 hover:text-slate-900 hover:scale-105 hover:shadow-md transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        {/* Modern Navbar */}
        <nav className="fixed top-0 w-full z-40 bg-white/40 backdrop-blur-xl border-b border-white/40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center md:justify-end gap-8">
            <a href="#comparison" className="text-sm font-semibold text-slate-600 hover:text-[#EAB308] transition-colors">The Trap</a>
            <a href="#pillars" className="text-sm font-semibold text-slate-600 hover:text-[#EAB308] transition-colors">The 3 Pillars</a>
            <a href="#contact" className="px-6 py-2.5 bg-[#1E293B] text-[#EAB308] text-sm font-bold rounded-full shadow-lg hover:bg-slate-800 transition-colors">Consultation</a>
          </div>
        </nav>

        {/* MAIN SCROLLING CONTENT */}
        <div className="relative z-10 bg-slate-50 rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          {/* Hero Section with 3D Gear */}
          <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto">
            <div className="md:w-1/2 relative z-10 text-center md:text-left mt-20 md:mt-0" data-cursor="hero" data-cursor-text="SCROLL">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  You built a factory to manufacture at scale. <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                    Not to drown in spreadsheets.
                  </span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-xl font-light leading-relaxed mx-auto md:mx-0">
                  Global B2B buyers evaluate your manufacturing capacity digitally. Stop looking like a local workshop. Build an enterprise-grade footprint.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#comparison" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full text-base shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform" data-cursor="button">
                    Why We Are Different
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="md:w-1/2 h-[500px] w-full relative z-0 mt-12 md:mt-0 cursor-grab active:cursor-grabbing">
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-slate-200 rounded-full" />}>
                 <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                  <ResponsiveCamera defaultFov={45} mobileFov={70} />
                   <ambientLight intensity={0.5} />
                   <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                   <pointLight position={[-5, -5, 5]} intensity={2} color="#EAB308" />
                   <Warehouse3D />
                 </Canvas>
              </Suspense>
            </div>
          </section>

          {/* Edgy Comparison Section */}
          <section id="comparison" className="py-32 px-6 relative z-10 bg-[#050505] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  The <span className="text-red-500 line-through decoration-red-600 decoration-[6px]">Legacy ERP</span> Trap.
                </h2>
                <p className="mt-6 text-xl text-gray-400 font-light max-w-2xl mx-auto">
                  Most vendors sell you a 1990s desktop database and expect you to run a modern factory on it. We build cloud engines that fit your assembly line.
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
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> The Legacy Trap
                  </h3>
                  <ul className="space-y-6">
                    {['Your floor managers are writing updates on whiteboards instead of tablets.', 'You have zero real-time visibility into machine downtime or material shortages.', 'Your B2B website looks like it was built during the dot-com bubble.', 'You lose multi-million rupee contracts because of poor digital perception.'].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-400 font-medium text-lg border-b border-red-900/20 pb-4">
                        <span className="text-red-500 font-black text-xl">×</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* The DWD Way (Yellow/Industrial) */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border border-yellow-500/30 bg-yellow-900/10 p-10 md:p-14 rounded-3xl relative overflow-hidden group hover:bg-yellow-900/20 transition-colors duration-500 shadow-[0_0_50px_rgba(234,179,8,0.05)]"
                  data-cursor="engine" data-cursor-text="✓"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-[#EAB308]" />
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-[#EAB308] mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" /> The Industrial Engine
                  </h3>
                  <ul className="space-y-6">
                    {['Live raw material tracking linked directly to supplier automations.', 'Tablet-friendly floor management for instant batch updates.', 'A highly aggressive global B2B digital showcase that radiates enterprise scale.', 'Direct WhatsApp partnership with the architects who built it.'].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-200 font-medium text-lg border-b border-yellow-500/20 pb-4">
                        <span className="text-yellow-400 font-black text-xl">✓</span> {text}
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
                <KineticHeading text="The 3 Pillars of Scale." />
                <p className="mt-6 text-xl md:text-2xl text-slate-500 font-light max-w-3xl md:mx-auto">
                  We don't build software features. We build digital infrastructure for the three things that actually matter.
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
                    <div className="text-slate-800 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-slate-800" /> Pillar 01
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">The Global <br />B2B Showcase.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">International buyers judge your capacity by your website. If it looks cheap, they won't hand you a multi-million dollar contract.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">We build hyper-optimized corporate platforms featuring interactive industrial catalogs. Downloadable CAD specs, ISO compliance sections, and high-fidelity machine showcases.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-100/50" />
                     <div className="relative w-[85%] h-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col hover:scale-105 transition-transform duration-500 cursor-pointer">
                        <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                           <div className="w-3 h-3 rounded-full bg-amber-400" />
                           <div className="w-3 h-3 rounded-full bg-green-400" />
                           <div className="ml-4 h-3 w-1/3 bg-slate-200 rounded-full" />
                        </div>
                        <div className="flex-1 p-6 flex gap-6">
                           <div className="w-1/3 h-full bg-slate-100 rounded-lg flex items-center justify-center">
                             <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                           </div>
                           <div className="w-2/3 space-y-4 pt-2">
                             <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
                             <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                             <div className="h-3 w-full bg-slate-100 rounded-full" />
                             <div className="mt-4 flex gap-2">
                               <div className="px-4 py-2 bg-slate-900 rounded text-[10px] font-bold text-white uppercase tracking-wider">Download CAD</div>
                             </div>
                           </div>
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
                    <div className="text-yellow-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-yellow-600" /> Pillar 02
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Real-Time <br />Raw Materials.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Production halts because someone forgot to order steel coils. That ends today.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">We engineer unified dashboards that pull data directly from the floor. Set threshold alerts for critical components, automate PO generation, and track yield percentages flawlessly.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 to-orange-50/50" />
                     <div className="relative w-72 bg-[#1E293B] rounded-2xl shadow-2xl p-6 border border-slate-700 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        <div className="flex justify-between items-center mb-6">
                           <div className="text-slate-400 font-mono text-xs uppercase tracking-wider">Inventory Hub</div>
                           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <div className="space-y-6">
                           <div>
                             <div className="flex justify-between text-xs mb-2">
                               <span className="text-white font-bold">Steel Coils (Grade A)</span>
                               <span className="text-red-400 font-bold">12%</span>
                             </div>
                             <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                               <div className="h-full w-[12%] bg-red-500" />
                             </div>
                           </div>
                           <div>
                             <div className="flex justify-between text-xs mb-2">
                               <span className="text-white font-bold">Aluminum Sheets</span>
                               <span className="text-green-400 font-bold">85%</span>
                             </div>
                             <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                               <div className="h-full w-[85%] bg-green-500" />
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
                    <div className="text-blue-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-blue-600" /> Pillar 03
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Production Line <br />Tracking.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Stop tracking massive industrial orders through disjointed WhatsApp messages.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">A central Nervous System for your factory. Know exactly which batch is at the CNC machine, which is in Quality Control, and which is loaded on the truck.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-50/50" />
                     <div className="relative w-[85%] flex gap-4 overflow-hidden px-4">
                        {/* Kanban Columns */}
                        <div className="w-1/3 bg-slate-100 rounded-xl border border-slate-200 p-3 hover:-translate-y-2 transition-transform duration-300">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Assembly</div>
                          <div className="w-full h-16 bg-white rounded shadow-sm border border-slate-200 mb-2 p-2">
                             <div className="h-2 w-1/2 bg-blue-500 rounded mb-2" />
                             <div className="h-1.5 w-full bg-slate-100 rounded" />
                          </div>
                        </div>
                        <div className="w-1/3 bg-slate-100 rounded-xl border border-slate-200 p-3 hover:-translate-y-2 transition-transform duration-300 delay-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">QA Check</div>
                          <div className="w-full h-16 bg-white rounded shadow-sm border border-slate-200 mb-2 p-2 border-l-2 border-l-yellow-500">
                             <div className="h-2 w-1/2 bg-yellow-500 rounded mb-2" />
                             <div className="h-1.5 w-full bg-slate-100 rounded" />
                          </div>
                        </div>
                        <div className="w-1/3 bg-slate-100 rounded-xl border border-slate-200 p-3 hover:-translate-y-2 transition-transform duration-300 delay-200 opacity-50">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Dispatch</div>
                          <div className="w-full h-16 border-2 border-dashed border-slate-300 rounded mb-2" />
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

        {/* Cinematic Parallax Footer with WhatsApp Mad Libs */}
        <div className="fixed bottom-0 left-0 w-full h-[80vh] z-0 bg-[#0F172A] text-white flex flex-col items-center justify-center">
           <section id="contact" className="w-full max-w-5xl px-6 relative z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EAB308]/10 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="relative z-20">
               <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter uppercase text-[#EAB308]">
                 Let's Talk.
               </h2>
               
               <p className="text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed lg:leading-snug text-slate-100">
                 Hi, my name is <br className="md:hidden" />
                 <input 
                   type="text" 
                   value={contactName}
                   onChange={(e) => setContactName(e.target.value)}
                   placeholder="YOUR NAME" 
                   className="bg-transparent border-b-4 border-slate-700 focus:border-[#EAB308] outline-none text-[#EAB308] placeholder-slate-700 w-full md:w-auto md:min-w-[300px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br className="hidden md:block" />
                 I run <br className="md:hidden" />
                 <input 
                   type="text" 
                   value={contactInstitution}
                   onChange={(e) => setContactInstitution(e.target.value)}
                   placeholder="YOUR FACTORY" 
                   className="bg-transparent border-b-4 border-slate-700 focus:border-[#EAB308] outline-none text-[#EAB308] placeholder-slate-700 w-full md:w-auto md:min-w-[400px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br />
                 We are done running on 1990s software. <br /> Let's build our tailored engine.
               </p>

               <div className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-8">
                 <button 
                   onClick={handleWhatsApp}
                   className="group relative inline-flex items-center justify-center px-10 py-6 bg-[#EAB308] text-[#0F172A] font-black uppercase tracking-widest text-lg md:text-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:scale-[1.02] transition-transform duration-300 w-full md:w-auto"
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
