import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import SalonScene from '../components/SalonScene';
import Preloader from '../components/Preloader';

function KineticHeading({ text, className }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const skewX = useTransform(skewVelocity, [-1000, 1000], [-3, 3]);
  const scaleY = useTransform(smoothVelocity, [-1000, 1000], [1.1, 0.9]);

  return (
    <motion.h2
      className={className || "text-4xl md:text-6xl font-black text-slate-900 tracking-tighter origin-bottom inline-block"}
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

export default function SalonERP() {
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactSalon, setContactSalon] = useState("");

  const handleWhatsApp = () => {
    const message = `Hello Devansh! My name is ${contactName || "[Your Name]"} and I own ${contactSalon || "[Your Studio]"}. We are done with missed appointments and chaotic scheduling. We want to build our tailored Beauty & Grooming Engine. Let's talk!`;
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
                className="w-1/5 bg-indigo-600"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="relative min-h-screen bg-transparent text-slate-900 font-sans overflow-x-hidden selection:bg-indigo-600 selection:text-white"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Salon & Grooming ERP | Tailored by Antigravity</title>
          <meta name="description" content="Stop losing revenue to no-shows and manual scheduling. Build a custom salon and barbershop management engine with Antigravity." />
        </Helmet>

        {/* Close Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-white/50 text-slate-500 hover:text-slate-900 hover:scale-105 hover:shadow-md transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        {/* Navbar */}
        <nav className="fixed top-0 w-full z-40 bg-white/40 backdrop-blur-xl border-b border-white/40">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center md:justify-end gap-8">
            <a href="#comparison" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">The Trap</a>
            <a href="#pillars" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">The 3 Pillars</a>
            <a href="#contact" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors">Consultation</a>
          </div>
        </nav>

        {/* ===== MAIN SCROLLING CONTENT ===== */}
        <div className="relative z-10 bg-slate-50 rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">

          {/* ===== HERO SECTION ===== */}
          <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto">
            {/* Hero Text */}
            <div className="md:w-1/2 relative z-10 text-center md:text-left mt-20 md:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-semibold mb-6">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Salons & Grooming Studios
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  You opened a studio<br className="hidden md:block" />
                  to create style.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                    Not to chase no-shows.
                  </span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-xl font-light leading-relaxed mx-auto md:mx-0">
                  You're currently losing ₹40,000+ a month to missed appointments, manual bookings, and zero client retention. Stop patching it with WhatsApp. Build a system.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#contact" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full text-base shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform">
                    Why We Are Different
                  </a>
                </div>
              </motion.div>
            </div>

            {/* 3D Scene */}
            <div className="md:w-1/2 h-[500px] lg:h-[600px] w-full relative z-0 mt-12 md:mt-0 rounded-[2rem] overflow-hidden border border-indigo-100 shadow-2xl bg-[#f8fafc] cursor-grab active:cursor-grabbing">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-indigo-400 font-semibold text-sm tracking-widest uppercase">Loading Studio...</p>
                  </div>
                </div>
              }>
                <Canvas camera={{ position: [0, 4, 10], fov: 45 }} shadows>
                  <SalonScene />
                </Canvas>
              </Suspense>
            </div>
          </section>

          {/* ===== COMPARISON SECTION ===== */}
          <section id="comparison" className="py-32 px-6 relative z-10 bg-[#0a0a0a] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  The <span className="text-red-500 line-through decoration-red-600 decoration-[6px]">No-Show</span> Trap.
                </h2>
                <p className="mt-6 text-xl text-slate-400 font-light max-w-2xl mx-auto">
                  Every salon and barbershop manages bookings over WhatsApp, suffers ghost appointments, and has no idea who their best clients are.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                {/* The Trap */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="border border-red-900/30 bg-red-950/10 p-10 md:p-14 rounded-3xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-600/50" />
                  <h3 className="text-3xl font-bold text-red-500 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> The Manual Chaos
                  </h3>
                  <ul className="space-y-6">
                    {[
                      'Bookings lost over WhatsApp when you\'re busy with a client.',
                      'No-shows cost you ₹500–₹3,000 per empty chair, every single day.',
                      'Stylists have no visibility into their daily schedules.',
                      'Zero client history — you can\'t remember who loved what service.',
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 text-slate-400 font-medium text-lg border-b border-red-900/20 pb-4">
                        <span className="text-red-500 font-black text-xl">×</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* The Solution */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border border-indigo-500/30 bg-indigo-900/10 p-10 md:p-14 rounded-3xl relative overflow-hidden hover:bg-indigo-900/20 transition-colors duration-500 shadow-[0_0_50px_rgba(99,102,241,0.1)]"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-400" />
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" /> The Studio Engine
                  </h3>
                  <ul className="space-y-6">
                    {[
                      'A branded booking portal that captures clients 24/7, even at midnight.',
                      'Automated WhatsApp reminders that slash no-show rates by 80%.',
                      'Stylist dashboards showing daily appointments, client notes, and earnings.',
                      'A loyalty engine that turns every client into a repeat VIP customer.',
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 text-slate-200 font-medium text-lg border-b border-indigo-500/20 pb-4">
                        <span className="text-indigo-400 font-black text-xl">✓</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ===== THE 3 PILLARS ===== */}
          <section id="pillars" className="py-32 pb-40 px-6 relative z-10 bg-white rounded-b-[4rem] overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="mb-32 md:text-center">
                <KineticHeading text="The 3 Pillars of Your Beauty Empire." />
                <p className="mt-6 text-xl md:text-2xl text-slate-500 font-light max-w-3xl md:mx-auto">
                  We build the infrastructure that turns a single studio into a scalable, automated brand.
                </p>
              </div>

              <div className="space-y-32">
                {/* Pillar 1 — Smart Booking */}
                <div className="flex flex-col md:flex-row gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="md:w-1/2"
                  >
                    <div className="text-indigo-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-indigo-600" /> Pillar 01
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Zero No-Shows.<br />Full Chairs.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Your clients book on Instagram at 11 PM. Your WhatsApp is silent. You lose the booking.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">We build a 24/7 branded booking portal with real-time slot availability, automated WhatsApp & SMS confirmations, and smart pre-payment deposits that guarantee every appointment is real.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-indigo-50 rounded-[3rem] border border-indigo-100 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 to-violet-50/60" />
                    <div className="relative w-64 bg-white rounded-3xl shadow-2xl p-6 border border-indigo-50 hover:scale-105 transition-transform duration-500 cursor-pointer">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-lg">✦</div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Arjun Patel</p>
                          <p className="text-indigo-500 text-xs font-semibold">Haircut & Styling — 2:00 PM</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">✓ Confirmed</span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">₹500 Deposit</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full">
                        <div className="h-1 bg-indigo-500 rounded-full w-3/4" />
                      </div>
                      <p className="text-slate-400 text-xs mt-2">Reminder sent 24h before ✓</p>
                    </div>
                  </motion.div>
                </div>

                {/* Pillar 2 — Stylist Management */}
                <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="md:w-1/2"
                  >
                    <div className="text-violet-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-violet-600" /> Pillar 02
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Stylist Superpowers.<br />Real-Time.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Your team is flying blind. They learn about their next client from a sticky note on the mirror.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">Each stylist gets a personal dashboard — their daily schedule, client history, preferred services, and commission tracker. Fully automated, fully branded to your studio.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-violet-50 rounded-[3rem] border border-violet-100 shadow-inner relative overflow-hidden flex items-end justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-indigo-50/50" />
                    <div className="relative w-64 h-64 bg-white rounded-t-3xl shadow-2xl p-6 border-t border-x border-violet-100 hover:-translate-y-4 transition-transform duration-500 cursor-pointer">
                      <p className="font-black text-slate-900 mb-4">Rahul's Dashboard</p>
                      <div className="space-y-3">
                        {['10:00 — Hair Cut & Wash', '12:30 — Beard Trim & Spa ₹900', '3:00 PM — Keratin Treatment'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-violet-50 rounded-xl text-sm">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-slate-700 font-medium">{item}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-violet-100 flex justify-between">
                          <span className="text-xs text-slate-400">Today's Earnings</span>
                          <span className="text-sm font-black text-indigo-600">₹8,200</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Pillar 3 — Loyalty & Retention */}
                <div className="flex flex-col md:flex-row gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="md:w-1/2"
                  >
                    <div className="text-blue-600 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-blue-600" /> Pillar 03
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Clients Who Return.<br />Again & Again.</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">Acquiring a new client costs 5x more than retaining one. Yet most studios have no retention system at all.</p>
                    <p className="mt-4 text-slate-500 leading-relaxed">We build a fully automated loyalty engine — custom points, VIP membership tiers, birthday offers, and win-back campaigns for lapsed clients. Your revenue grows even while you sleep.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-blue-50 rounded-[3rem] border border-blue-100 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-50/50" />
                    <div className="relative w-[80%] bg-white rounded-3xl shadow-2xl p-8 border border-blue-50 hover:scale-105 transition-transform duration-500 cursor-pointer">
                      <p className="font-bold text-slate-500 text-xs uppercase tracking-widest mb-1">Rohan Mehta · VIP Gold</p>
                      <p className="font-black text-slate-900 text-2xl mb-3">850 Style Points ✦</p>
                      <div className="h-2 bg-slate-100 rounded-full mb-4">
                        <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full w-[85%]" />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 p-3 bg-indigo-50 rounded-2xl text-center">
                          <p className="font-black text-indigo-600 text-lg">12</p>
                          <p className="text-slate-500 text-xs">Visits</p>
                        </div>
                        <div className="flex-1 p-3 bg-blue-50 rounded-2xl text-center">
                          <p className="font-black text-blue-600 text-lg">₹26k</p>
                          <p className="text-slate-500 text-xs">Spent</p>
                        </div>
                        <div className="flex-1 p-3 bg-violet-50 rounded-2xl text-center">
                          <p className="font-black text-violet-600 text-lg">5★</p>
                          <p className="text-slate-500 text-xs">Rating</p>
                        </div>
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

        {/* ===== CONTACT / FORM SECTION ===== */}
        <div className="fixed bottom-0 left-0 w-full h-[80vh] z-0 bg-[#050505] text-white flex flex-col items-center justify-center">
          <section id="contact" className="w-full max-w-5xl px-6 relative z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-20">
              <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter uppercase text-slate-400">
                Let's <span className="text-white">Build It.</span>
              </h2>

              <p className="text-2xl md:text-4xl lg:text-5xl font-bold leading-relaxed lg:leading-snug text-slate-100">
                Hi, my name is{' '}
                <br className="md:hidden" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="YOUR NAME"
                  className="bg-transparent border-b-4 border-slate-700 focus:border-indigo-500 outline-none text-indigo-400 placeholder-slate-700 w-full md:w-auto md:min-w-[280px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                />
                <br className="hidden md:block" />
                and I own{' '}
                <br className="md:hidden" />
                <input
                  type="text"
                  value={contactSalon}
                  onChange={(e) => setContactSalon(e.target.value)}
                  placeholder="YOUR STUDIO NAME"
                  className="bg-transparent border-b-4 border-slate-700 focus:border-indigo-500 outline-none text-indigo-400 placeholder-slate-700 w-full md:w-auto md:min-w-[380px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                />
                <br />
                We are done with no-shows and manual chaos.{' '}
                <br />Let's build our tailored Beauty Engine.
              </p>

              <div className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-8">
                <button
                  onClick={handleWhatsApp}
                  className="group relative inline-flex items-center justify-center px-10 py-6 bg-white text-black font-black uppercase tracking-widest text-lg md:text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform duration-300 w-full md:w-auto overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.76 2.46 15.4 3.25 16.84L2 22L7.3 20.72C8.75 21.53 10.33 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.47 15.68C17.24 16.32 16.3 16.87 15.65 17.02C15.17 17.13 14.47 17.21 12.18 16.27C9.25 15.06 7.37 12.06 7.22 11.87C7.07 11.68 6 10.26 6 8.78C6 7.29 6.77 6.57 7.08 6.25C7.33 5.99 7.76 5.86 8.16 5.86C8.29 5.86 8.41 5.86 8.52 5.87C8.83 5.89 8.99 5.9 9.2 6.4C9.45 6.99 10.05 8.46 10.12 8.61C10.19 8.76 10.26 8.96 10.16 9.16C10.06 9.35 9.98 9.45 9.83 9.63C9.68 9.8 9.51 10 9.39 10.12C9.25 10.27 9.09 10.43 9.27 10.74C9.45 11.05 10.05 12.03 10.93 12.82C11.96 13.75 12.88 14.04 13.22 14.18C13.56 14.32 13.76 14.3 13.96 14.08C14.16 13.86 14.73 13.19 14.93 12.92C15.13 12.65 15.33 12.69 15.63 12.8C15.93 12.91 17.51 13.69 17.81 13.84C18.11 13.99 18.31 14.06 18.38 14.18C18.45 14.3 18.45 14.94 17.47 15.68Z" /></svg>
                    Send to WhatsApp
                  </span>
                  <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute z-10 opacity-0 group-hover:opacity-100 text-white transition-opacity duration-300 flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.76 2.46 15.4 3.25 16.84L2 22L7.3 20.72C8.75 21.53 10.33 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.47 15.68C17.24 16.32 16.3 16.87 15.65 17.02C15.17 17.13 14.47 17.21 12.18 16.27C9.25 15.06 7.37 12.06 7.22 11.87C7.07 11.68 6 10.26 6 8.78C6 7.29 6.77 6.57 7.08 6.25C7.33 5.99 7.76 5.86 8.16 5.86C8.29 5.86 8.41 5.86 8.52 5.87C8.83 5.89 8.99 5.9 9.2 6.4C9.45 6.99 10.05 8.46 10.12 8.61C10.19 8.76 10.26 8.96 10.16 9.16C10.06 9.35 9.98 9.45 9.83 9.63C9.68 9.8 9.51 10 9.39 10.12C9.25 10.27 9.09 10.43 9.27 10.74C9.45 11.05 10.05 12.03 10.93 12.82C11.96 13.75 12.88 14.04 13.22 14.18C13.56 14.32 13.76 14.3 13.96 14.08C14.16 13.86 14.73 13.19 14.93 12.92C15.13 12.65 15.33 12.69 15.63 12.8C15.93 12.91 17.51 13.69 17.81 13.84C18.11 13.99 18.31 14.06 18.38 14.18C18.45 14.3 18.45 14.94 17.47 15.68Z" /></svg>
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
