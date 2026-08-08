import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BusinessBlock3D from '../components/BusinessBlock3D';

export default function BusinessERP() {
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactBusiness, setContactBusiness] = useState('');

  const handleWhatsApp = () => {
    const message = `Hello Devansh! My name is ${contactName || "[Your Name]"} and I run ${contactBusiness || "[Your Business]"}. We are done managing our business on rough registers and WhatsApp chats. Let's build our custom Business engine.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919687629341?text=${encodedMessage}`, "_blank");
  };

  useEffect(() => {
    // Simulate loading to ensure smooth 3D mounting
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="relative min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-cyan-400 selection:text-slate-900"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>Universal Business OS | Tailored by DWD</title>
          <meta name="description" content="A unified software engine for startups, salons, real estate, and boutiques. Stop running your business on paper and WhatsApp." />
        </Helmet>

        {/* Global Back Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-slate-900 hover:scale-105 hover:shadow-md transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        {/* Custom Navigation */}
        <nav className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center md:justify-end gap-8">
            <a href="#comparison" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors">The Problem</a>
            <a href="#pillars" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors">How It Works</a>
            <a href="#contact" className="px-6 py-2.5 bg-slate-900 text-cyan-400 text-sm font-bold rounded-full shadow-lg hover:bg-slate-800 transition-colors">Book Consultation</a>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <div className="relative z-10 bg-white rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
          <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto">
            <div className="md:w-[50%] relative z-10 text-center md:text-left mt-10 md:mt-0 pr-0 md:pr-10" data-cursor="hero" data-cursor-text="SCROLL">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-700 text-xs font-bold tracking-widest uppercase">
                  For Growing Businesses & New Startups
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  Stop running your business on <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">rough registers and messy WhatsApp chats.</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-slate-600 font-light leading-relaxed">
                  Whether you run a <span className="font-semibold text-slate-900">Boutique</span>, <span className="font-semibold text-slate-900">Salon</span>, <span className="font-semibold text-slate-900">Real Estate Agency</span>, <span className="font-semibold text-slate-900">Hardware Store</span>, <span className="font-semibold text-slate-900">Consultancy</span>, or a <span className="font-semibold text-cyan-600">Brand New Startup</span>—you need a system that automatically tallies your daily Galla, tracks Udhaar, manages your Godown, and generates GST bills instantly.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#comparison" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full text-base shadow-xl shadow-slate-900/20 hover:scale-105 transition-transform" data-cursor="button">
                    See How It Works
                  </a>
                  <a href="#contact" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full text-base border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors">
                    Talk to an Expert
                  </a>
                </div>
                
                {/* Niche Pills */}
                <div className="mt-10 flex flex-wrap gap-2 justify-center md:justify-start opacity-70">
                  {['Retail', 'Agencies', 'Logistics', 'Freelancers', 'Event Planners', 'Home Services'].map((niche, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                      {niche}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* The 3D Diorama */}
            <div className="md:w-[50%] h-[50vh] md:h-screen w-full relative -mx-6 md:mx-0 mt-10 md:mt-0" data-cursor="drag" data-cursor-text="DRAG TO ROTATE">
              <BusinessBlock3D />
            </div>
          </section>

          {/* --- THE TRAP VS THE SOLUTION --- */}
          <section id="comparison" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">The Fragmented Nightmare</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">Most small businesses drown in a messy web of disconnected apps.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
                {/* The Trap */}
                <div className="bg-white p-8 md:p-12 rounded-3xl border border-red-100 shadow-xl shadow-red-900/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-xl mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">The "Desi" Old Way</h3>
                  <ul className="space-y-4">
                    {[
                      "Losing track of Udhaar because it's written in a misplaced notebook.",
                      "Tallying daily Cash vs UPI manually at 9 PM every night.",
                      "Scrambling at the end of the month to organize rough bills for GST.",
                      "Relying on staff and worrying about theft or inventory leakage in the Godown.",
                      "Losing regular customer contacts when a staff member leaves or your phone breaks."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The Solution */}
                <div className="bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 -z-10" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-900/30 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-xl mb-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">The DWD Engine</h3>
                  <ul className="space-y-4">
                    {[
                      "Auto-generate GST-ready bills in exactly 2 seconds.",
                      "Instant daily Galla tally showing exact Cash vs UPI splits.",
                      "Automated WhatsApp reminders sent directly for pending Udhaar.",
                      "Live Godown tracking to instantly detect shrinkage or theft.",
                      "A single screen that tells you everything happening in your business, from anywhere."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <span className="text-cyan-400 mt-1">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* --- THE 3 PILLARS (Plain English) --- */}
          <section id="pillars" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">How It Actually Works</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">No confusing tech jargon. Just three core tools built to make your daily life easier.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Pillar 1 */}
                <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:border-cyan-100 transition-all duration-300">
                  <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Billing & GST</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Throw away the calculator. Open your dashboard and see exactly what the daily Galla is. Track exact UPI vs Cash splits, and instantly generate perfect bills ready for your CA.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Godown & Stock</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Whether you sell hardware or clothes, the system tracks every single item. When you make a sale, it subtracts the stock. Prevent employee theft and get alerts before you run out of fast-moving items.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:border-emerald-100 transition-all duration-300">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Customers & Staff</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Track staff attendance and commissions automatically. Plus, securely save all VIP customer details so you can send them WhatsApp offers during Diwali without searching through your phone.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- FOOTER PARALLAX --- */}
        <section id="contact" className="w-full relative z-10 bg-[#0a0f1c] py-32 overflow-hidden rounded-t-[4rem]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-20 max-w-5xl mx-auto px-6">
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
                value={contactBusiness}
                onChange={(e) => setContactBusiness(e.target.value)}
                placeholder="YOUR BUSINESS" 
                className="bg-transparent border-b-4 border-slate-700 focus:border-cyan-400 outline-none text-cyan-400 placeholder-slate-700 w-full md:w-auto md:min-w-[400px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                data-cursor="hover"
              />
              <br />
              We are done managing on rough registers. <br /> Let's build our custom Business engine.
            </p>

            <div className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-8">
              <button 
                onClick={handleWhatsApp}
                className="group relative inline-flex items-center justify-center px-10 py-6 bg-white text-black font-black uppercase tracking-widest text-lg md:text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform duration-300 w-full md:w-auto rounded-xl"
                data-cursor="hover"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.76 2.46 15.4 3.25 16.84L2 22L7.3 20.72C8.75 21.53 10.33 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.47 15.68C17.24 16.32 16.3 16.87 15.65 17.02C15.17 17.13 14.47 17.21 12.18 16.27C9.25 15.06 7.37 12.06 7.22 11.87C7.07 11.68 6 10.26 6 8.78C6 7.29 6.77 6.57 7.08 6.25C7.33 5.99 7.76 5.86 8.16 5.86C8.29 5.86 8.41 5.86 8.52 5.87C8.83 5.89 8.99 5.9 9.2 6.4C9.45 6.99 10.05 8.46 10.12 8.61C10.19 8.76 10.26 8.96 10.16 9.16C10.06 9.35 9.98 9.45 9.83 9.63C9.68 9.8 9.51 10 9.39 10.12C9.25 10.27 9.09 10.43 9.27 10.74C9.45 11.05 10.05 12.03 10.93 12.82C11.96 13.75 12.88 14.04 13.22 14.18C13.56 14.32 13.76 14.3 13.96 14.08C14.16 13.86 14.73 13.19 14.93 12.92C15.13 12.65 15.33 12.69 15.63 12.8C15.93 12.91 17.51 13.69 17.81 13.84C18.11 13.99 18.31 14.06 18.38 14.18C18.45 14.3 18.45 14.94 17.47 15.68Z" /></svg>
                  Send to WhatsApp
                </span>
                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
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

      </motion.div>
    </>
  );
}
