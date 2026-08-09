import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import ResponsiveCamera from '../components/ResponsiveCamera';
import Car3DScene from '../components/Car3DScene';
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
      className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter origin-bottom inline-block transition-colors duration-500"
      style={{ skewX, scaleY }}
    >
      {text}
    </motion.h2>
  );
}

// Curtain blind transition in high-octane crimson red
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

// Detailing & Automotive Service Categories & Items for Quote Terminal
const DETAILING_CATEGORIES = [
  { id: 'ceramic', name: 'Ceramic Coating', icon: '🪞' },
  { id: 'ppf', name: 'Paint Protection (PPF)', icon: '🛡️' },
  { id: 'correction', name: 'Paint Correction', icon: '✨' },
  { id: 'interior', name: 'Interior Spa & Leather', icon: '🏎️' },
];

const DETAILING_SERVICES = [
  { id: 101, category: 'ceramic', name: '9H Nano Ceramic Coating (3-Yr Warranty)', price: 28000, tags: ['Best Seller'] },
  { id: 102, category: 'ceramic', name: '10H Graphene Dual-Layer Shield (5-Yr)', price: 45000, tags: ['Flagship'] },
  { id: 103, category: 'ceramic', name: 'Wheel Rim & Glass Ceramic Hydrophobic', price: 12500, tags: ['Add-On'] },
  { id: 201, category: 'ppf', name: 'TPU Full Body Self-Healing PPF Wrap', price: 110000, tags: ['Ultimate'] },
  { id: 202, category: 'ppf', name: 'Front Bumper + Hood High-Impact PPF', price: 38000, tags: ['Popular'] },
  { id: 203, category: 'ppf', name: 'Matte Stealth Finish PPF Full Conversion', price: 135000, tags: ['Exotic'] },
  { id: 301, category: 'correction', name: 'Stage 3 Heavy Swirl & Scratch Elimination', price: 18500, tags: ['Deep Gloss'] },
  { id: 302, category: 'correction', name: 'Single Stage Gloss Enhancement Polish', price: 8500, tags: ['Fast Turn'] },
  { id: 401, category: 'interior', name: 'Full Interior Deep Steam Spa & Germ Shield', price: 6500, tags: ['Hygiene'] },
  { id: 402, category: 'interior', name: 'Nappa Leather Conditioning & Ceramic Shield', price: 9500, tags: ['Luxury'] },
];

// Workshop Bays Data
const INITIAL_WORKSHOP_BAYS = [
  { id: 'BAY-01', name: 'Ceramic Infrared Oven Bay', vehicle: 'Porsche 911 GT3', status: 'baking', progress: 75, leadTech: 'Vikram S.' },
  { id: 'BAY-02', name: 'PPF Precision Fitment Bay', vehicle: 'BMW M5 Competition', status: 'wrapping', progress: 40, leadTech: 'Arjun K.' },
  { id: 'BAY-03', name: 'Stage 3 Paint Correction Bay', vehicle: 'Mercedes-AMG G63', status: 'polishing', progress: 90, leadTech: 'Rohan P.' },
  { id: 'BAY-04', name: 'VIP Wash & Decontamination', vehicle: 'Audi RS Q8', status: 'washing', progress: 20, leadTech: 'Karan M.' },
];

export default function CarERP() {
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactStudio, setContactStudio] = useState("");

  // PC Monitor UI Active View State ('quote' | 'bays' | 'tracker' | 'roi')
  const [pcActiveTab, setPcActiveTab] = useState('quote');

  const handleWhatsApp = () => {
    const message = `Hello! My name is ${contactName || "[Your Name]"} and I run ${contactStudio || "[Your Automotive Studio / Garage]"}. We are done losing high-ticket detailing clients to cheap templates. Let's test ApexDrive OS!`;
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

  // State for Quote Builder Terminal
  const [activeCategory, setActiveCategory] = useState('ceramic');
  const [quoteItems, setQuoteItems] = useState([
    { id: 101, name: '9H Nano Ceramic Coating (3-Yr Warranty)', price: 28000, qty: 1 },
    { id: 401, name: 'Full Interior Deep Steam Spa & Germ Shield', price: 6500, qty: 1 },
  ]);
  const [clientVehicle, setClientVehicle] = useState('Fortuner Legender / SUV');
  const [quoteModal, setQuoteModal] = useState(false);

  // State for ROI Calculator
  const [weeklyLostLeads, setWeeklyLostLeads] = useState(12);
  const [avgJobTicket, setAvgJobTicket] = useState(35000);

  // Helper calculations for Quote Builder
  const quoteSubtotal = quoteItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gstTax = Math.round(quoteSubtotal * 0.18);
  const grandTotal = quoteSubtotal + gstTax;

  // Cart operations
  const addToQuote = (item) => {
    setQuoteItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQuoteQty = (id, delta) => {
    setQuoteItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // ROI Calculator Calculations
  const monthlyRevenueLoss = weeklyLostLeads * 4 * avgJobTicket;
  const yearlyRevenueLoss = monthlyRevenueLoss * 12;

  // JSON-LD Schema for SEO
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ApexDrive OS - Enterprise Automotive & Detailing Management Engine",
    "operatingSystem": "Web, Android, iOS, Windows, macOS",
    "applicationCategory": "BusinessApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "192"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Enterprise-grade bespoke Automotive, Car Detailing & Workshop OS featuring instant high-ticket quote engine, live workshop bay tracker, and direct VIP booking system."
  };

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />

      {/* Signature High-Octane Crimson Curtain Transition */}
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
                className="w-1/5 bg-rose-600"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="relative min-h-screen bg-transparent text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-rose-600 selection:text-white transition-colors duration-500"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>ApexDrive OS | High-Ticket Automotive & Car Detailing Management Engine</title>
          <meta name="description" content="Stop losing ₹50,000 ceramic coating & PPF leads to cheap website templates. Build an enterprise automotive digital showroom with ApexDrive OS." />
          <meta name="keywords" content="car detailing software, ceramic coating booking app, PPF quote software, workshop bay manager, automotive garage ERP, car wash billing system" />
          <script type="application/ld+json">
            {JSON.stringify(jsonLdSchema)}
          </script>
        </Helmet>

        {/* Floating Close Button */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:scale-105 hover:shadow-md transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        {/* Modern Glass Navbar */}
        <nav className="fixed top-0 w-full z-40 bg-white/40 dark:bg-slate-950/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-800/60 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center md:justify-end gap-8">
            <a href="#comparison" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">The Trap</a>
            <a href="#pillars" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">The 3 Pillars</a>
            <a href="#pc-demo" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Interactive Terminal</a>
            <a href="#contact" className="px-6 py-2.5 bg-rose-600 text-white text-sm font-bold rounded-full shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-colors">Consultation</a>
          </div>
        </nav>

        {/* MAIN SCROLLING CONTENT WRAPPER */}
        <div className="relative z-10 bg-slate-50 dark:bg-[#0c0c0e] text-slate-900 dark:text-white rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-colors duration-500">
          
          {/* HERO SECTION WITH 3D AUTOMOTIVE ALLOY WHEEL */}
          <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto">
            <div className="md:w-1/2 relative z-10 text-center md:text-left mt-20 md:mt-0" data-cursor="hero" data-cursor-text="SCROLL">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/90 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  ApexDrive OS • High-Ticket Automotive Engine
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                  Clients pay for perfection. <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-600 to-amber-500">
                    Your website should match.
                  </span>
                </h1>

                <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl font-light leading-relaxed mx-auto md:mx-0">
                  If your digital presence looks cheap, nobody will trust you with a ₹1,00,000 PPF or Ceramic Coating job. Replace generic templates with an enterprise digital showroom.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#comparison" className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-full text-base shadow-xl shadow-slate-900/20 dark:shadow-none hover:scale-105 transition-transform" data-cursor="button">
                    Why We Are Different
                  </a>
                  <a href="#pc-demo" className="px-8 py-4 bg-rose-600 text-white font-bold rounded-full text-base shadow-xl shadow-rose-600/30 hover:scale-105 transition-transform" data-cursor="button">
                    Launch Interactive POS
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="md:w-1/2 h-[550px] md:h-[620px] w-full relative z-0 mt-8 md:mt-0">
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-rose-100 dark:bg-rose-950/40 rounded-full" />}>
                 <Canvas camera={{ position: [0, 0, 5.8], fov: 42 }}>
                  <ResponsiveCamera defaultFov={42} mobileFov={67} />
                   <Car3DScene />
                 </Canvas>
              </Suspense>
            </div>
          </section>

          {/* EDGY COMPARISON SECTION */}
          <section id="comparison" className="py-32 px-6 relative z-10 bg-[#050505] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  The <span className="text-red-500 line-through decoration-red-600 decoration-[6px]">Cheap Template</span> Trap.
                </h2>
                <p className="mt-6 text-xl text-gray-400 font-light max-w-2xl mx-auto">
                  High-net-worth car owners judge your craftsmanship by your digital finish. Generic WordPress templates kill your luxury perception instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                {/* The Trap */}
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
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> The Cheap Template
                  </h3>
                  <ul className="space-y-6">
                    {[
                      'Slow, clunky mobile loading loses impatient supercar owners.',
                      'No instant quote engine—clients leave before you answer your phone.',
                      'Zero live workshop bay tracking; customers call 10 times a day for updates.',
                      'Surrendering 20% margin to third-party car service aggregators.'
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-400 font-medium text-lg border-b border-red-900/20 pb-4">
                        <span className="text-red-500 font-black text-xl">×</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* The ApexDrive Way */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border border-rose-500/30 bg-rose-950/20 p-10 md:p-14 rounded-3xl relative overflow-hidden group hover:bg-rose-900/30 transition-colors duration-500 shadow-[0_0_50px_rgba(225,29,72,0.15)]"
                  data-cursor="engine" data-cursor-text="✓"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-400" />
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-rose-400 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.8)]" /> ApexDrive OS
                  </h3>
                  <ul className="space-y-6">
                    {[
                      'Custom-built 3D digital showroom that justifies ₹1,50,000+ PPF packages.',
                      'Instant 10-second ceramic & detailing quote builder with live GST invoice.',
                      'Live Workshop Bay tracker sending automated WhatsApp photo updates.',
                      'Direct VIP booking system eliminating third-party lead brokers.'
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-200 font-medium text-lg border-b border-rose-500/20 pb-4">
                        <span className="text-rose-400 font-black text-xl">✓</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* THE 3 PILLARS */}
          <section id="pillars" className="py-32 pb-40 px-6 relative z-10 bg-white dark:bg-[#08080a] text-slate-900 dark:text-white overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
              <div className="mb-32 md:text-center">
                <KineticHeading text="The 3 Pillars of Automotive Scale." />
                <p className="mt-6 text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light max-w-3xl md:mx-auto">
                  We don't build basic brochure websites. We architect high-converting digital showrooms for elite automotive studios.
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
                    <div className="text-rose-600 dark:text-rose-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-rose-600 dark:bg-rose-400" /> Pillar 01
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Digital Ceramic Showroom & <br />Instant Quote Engine.</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">High-ticket clients hate filling long contact forms and waiting 2 days for a price quote. Our engine builds instant 10-second package estimates.</p>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">Automate 9H Ceramic Coating, PPF Full Wraps, and Paint Correction packages with live GST calculations and instant PDF quotes.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 dark:bg-slate-900/60 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 dark:from-rose-950/20 to-red-50/50 dark:to-red-950/20" />
                     <div className="relative w-[80%] md:w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 flex flex-col justify-center border border-slate-100 dark:border-slate-800 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        <div className="flex justify-between items-center mb-6">
                          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                            <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800/40">Verified</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">Full PPF Stealth Wrap</div>
                        <div className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Instant Quote Engine ₹1,35,000</div>
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
                    <div className="text-amber-600 dark:text-amber-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-amber-600 dark:bg-amber-400" /> Pillar 02
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Live Workshop Bay & <br />Service Status Tracker.</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Car owners leave their ₹1 Crore+ vehicles with you for days. Eliminate anxiety with real-time workshop progress feeds.</p>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">Automated WhatsApp photo updates when their vehicle moves from Decontamination Bay to Paint Correction to Ceramic Infrared Oven.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 dark:bg-slate-900/60 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner relative overflow-hidden flex items-end justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 dark:from-amber-950/20 to-orange-50/50 dark:to-orange-950/20" />
                     <div className="relative w-64 h-64 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 border-t border-x border-slate-100 dark:border-slate-800 hover:-translate-y-4 transition-transform duration-500 cursor-pointer">
                        <div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 mx-auto" />
                        <div className="space-y-4 font-mono text-xs">
                          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                             <div className="font-bold text-slate-900 dark:text-slate-100">Porsche 911 GT3</div>
                             <span className="text-amber-600 dark:text-amber-400 font-black">75% OVEN</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                             <div className="font-bold text-slate-900 dark:text-slate-100">BMW M5 Competition</div>
                             <span className="text-emerald-600 dark:text-emerald-400 font-black">PPF WRAPPING</span>
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
                    <div className="text-rose-600 dark:text-rose-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-rose-600 dark:bg-rose-400" /> Pillar 03
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Direct VIP Booking & <br />Annual Maintenance System.</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Turn one-time detailing jobs into recurring annual maintenance contracts (AMC). Keep 100% of lead profits.</p>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">Direct WhatsApp booking funnel and automated ceramic maintenance inspection reminders every 6 months.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 dark:bg-slate-900/60 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 dark:from-rose-950/20 to-amber-50/50 dark:to-amber-950/20" />
                     <div className="relative w-[70%] h-[80%] border border-slate-200 dark:border-slate-800 rounded-3xl grid grid-cols-2 grid-rows-2 gap-4 p-4 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 ${i % 2 === 0 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-300">VIP</div>
                          </div>
                        ))}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center z-10">
                          <div className="w-4 h-4 bg-rose-600 rounded-full animate-pulse" />
                        </div>
                     </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </section>

          {/* INTERACTIVE DESKTOP PC / POS MACHINE FRAME */}
          <section id="pc-demo" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-900 dark:bg-[#050507] text-white rounded-b-[4rem] transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
              
              {/* SECTION HEADER */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-rose-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  [ CLIENT INTERACTIVE WORKSHOP TERMINAL DEMO ]
                </div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
                  Test the Workshop OS in Real-Time.
                </h2>
                <p className="mt-4 text-base sm:text-xl text-slate-400 font-light">
                  Use the touch controls on this desktop workshop terminal to build high-ticket detailing estimates, track workshop bays, and calculate lost revenue.
                </p>
              </div>

              {/* DESKTOP MONITOR DEVICE FRAME */}
              <div className="relative max-w-6xl mx-auto">
                
                {/* Outer PC Display Casing */}
                <div className="bg-slate-950 border-4 sm:border-8 border-slate-800 rounded-xl sm:rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden relative border-t-slate-700">
                  
                  {/* Top PC Window Title Bar */}
                  <div className="bg-slate-900 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="ml-3 text-[10px] sm:text-xs font-mono text-slate-400 hidden sm:inline-block">
                        APEXDRIVE_AUTO_OS_v4.8 // WORKSHOP BAY TERMINAL #01
                      </span>
                    </div>

                    {/* Live System Indicator */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[10px] sm:text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400 font-bold">TERMINAL ONLINE</span>
                      <span className="text-slate-500">| 4 BAYS ACTIVE</span>
                    </div>
                  </div>

                  {/* Monitor Navigation Tabs Bar */}
                  <div className="bg-slate-900/90 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setPcActiveTab('quote')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'quote' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>🏎️</span> 1. High-Ticket Quote Builder
                    </button>
                    <button
                      onClick={() => setPcActiveTab('bays')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'bays' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>🛠️</span> 2. Live Workshop Bays
                    </button>
                    <button
                      onClick={() => setPcActiveTab('tracker')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'tracker' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>📱</span> 3. Client VIP Tracker
                    </button>
                    <button
                      onClick={() => setPcActiveTab('roi')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'roi' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>📊</span> 4. Lost Revenue ROI
                    </button>
                  </div>

                  {/* PC Screen Content Area */}
                  <div className="p-4 sm:p-8 bg-slate-900 min-h-[550px] relative text-slate-900 font-sans">
                    
                    {/* TAB 1: HIGH-TICKET QUOTE BUILDER TERMINAL */}
                    {pcActiveTab === 'quote' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Service Item Selector (7 cols) */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {DETAILING_CATEGORIES.map(cat => (
                              <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                              >
                                <span>{cat.icon}</span> {cat.name}
                              </button>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {DETAILING_SERVICES
                              .filter(item => item.category === activeCategory)
                              .map(item => (
                                <motion.div
                                  key={item.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{item.name}</h4>
                                      <span className="text-[9px] font-bold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded whitespace-nowrap">{item.tags[0]}</span>
                                    </div>
                                    <div className="text-base font-black text-slate-900 mb-3">₹{item.price.toLocaleString('en-IN')}</div>
                                  </div>
                                  <button onClick={() => addToQuote(item)} className="w-full py-2 bg-white hover:bg-rose-600 hover:text-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">
                                    <span>+ Add to Package</span>
                                  </button>
                                </motion.div>
                              ))}
                          </div>
                        </div>

                        {/* Quote Ledger (5 cols) */}
                        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                          <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-200">
                            <div>
                              <h3 className="font-black text-lg text-slate-900">Estimate Ledger</h3>
                              <p className="text-[10px] text-slate-500">Quote #{Math.floor(2000 + Math.random() * 8000)}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <label htmlFor="vehicle-model-select" className="text-xs font-bold text-slate-600">Vehicle:</label>
                              <select
                                id="vehicle-model-select"
                                value={clientVehicle}
                                onChange={(e) => setClientVehicle(e.target.value)}
                                className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                              >
                                <option value="Fortuner Legender / SUV">Fortuner Legender (SUV)</option>
                                <option value="Porsche 911 GT3 (Sports)">Porsche 911 GT3 (Sports)</option>
                                <option value="BMW M5 Competition (Sedan)">BMW M5 (Sedan)</option>
                                <option value="Mercedes G63 AMG (Luxury SUV)">Mercedes G63 (Luxury)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
                            {quoteItems.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                                <div className="flex-1 pr-2">
                                  <div className="font-bold text-slate-900">{item.name}</div>
                                  <div className="text-[10px] text-slate-500">₹{item.price.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-1.5 py-0.5">
                                    <button onClick={() => updateQuoteQty(item.id, -1)} className="font-bold text-slate-500 hover:text-red-600 px-1">-</button>
                                    <span className="font-bold text-slate-900 text-xs">{item.qty}</span>
                                    <button onClick={() => updateQuoteQty(item.id, 1)} className="font-bold text-slate-500 hover:text-rose-600 px-1">+</button>
                                  </div>
                                  <span className="font-black text-slate-900 w-16 text-right">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-1.5 pt-3 border-t border-slate-200 text-xs mb-4">
                            <div className="flex justify-between text-slate-600"><span>Subtotal Package:</span><span className="font-bold text-slate-900">₹{quoteSubtotal.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between text-slate-600"><span>GST Tax (18%):</span><span className="font-bold text-slate-900">₹{gstTax.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-200"><span>Est. Total:</span><span className="text-rose-600">₹{grandTotal.toLocaleString('en-IN')}</span></div>
                          </div>

                          <button onClick={() => setQuoteModal(true)} disabled={quoteItems.length === 0} className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-rose-600/30 transition-all">
                            <span>📄 Print PDF & Dispatch WhatsApp Quote</span>
                          </button>
                        </div>

                      </motion.div>
                    )}

                    {/* TAB 2: LIVE WORKSHOP BAYS */}
                    {pcActiveTab === 'bays' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 text-white p-6 rounded-3xl shadow-xl font-mono">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                          <div>
                            <h3 className="text-xl font-black text-rose-400">WORKSHOP BAY LIVE MONITOR</h3>
                            <p className="text-xs text-slate-400">Real-Time Detailing & PPF Progress</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold animate-pulse">
                            🏎️ 4 BAYS ACTIVE
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {INITIAL_WORKSHOP_BAYS.map((bay) => (
                            <div key={bay.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                              <div className="flex justify-between border-b border-slate-800 pb-2">
                                <div>
                                  <span className="font-bold text-rose-400 text-sm">{bay.id}</span>
                                  <div className="text-xs font-bold text-slate-200">{bay.vehicle}</div>
                                </div>
                                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded border border-rose-500/30 h-fit uppercase">{bay.status}</span>
                              </div>
                              
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-slate-400">
                                  <span>Progress:</span>
                                  <span className="font-bold text-white">{bay.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div className="bg-gradient-to-r from-rose-600 to-amber-400 h-full rounded-full transition-all" style={{ width: `${bay.progress}%` }} />
                                </div>
                              </div>

                              <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                                <span>Station: {bay.name}</span>
                                <span>Lead Tech: {bay.leadTech}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: CLIENT VIP TRACKER */}
                    {pcActiveTab === 'tracker' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl text-slate-900">
                        <div className="max-w-xl mx-auto space-y-6">
                          <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">VIP Client Mobile View</div>
                              <div className="text-lg font-black">Porsche 911 GT3 - Ceramic 10H Shield</div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full">Stage 3 / 4</span>
                          </div>

                          <div className="space-y-4">
                            {[
                              { stage: '1. Decontamination & Iron Removal', status: 'Completed', time: '10:30 AM', color: 'text-emerald-600' },
                              { stage: '2. Stage 3 Heavy Scratch Paint Correction', status: 'Completed', time: '02:15 PM', color: 'text-emerald-600' },
                              { stage: '3. 10H Graphene Ceramic Coating Application', status: 'In Progress (75%)', time: 'Now', color: 'text-rose-600 font-bold' },
                              { stage: '4. Infrared Curing Oven & Final Inspection', status: 'Scheduled', time: '06:00 PM', color: 'text-slate-400' },
                            ].map((step, i) => (
                              <div key={i} className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">{i + 1}</div>
                                <div className="flex-1">
                                  <div className="font-bold text-slate-900 text-sm">{step.stage}</div>
                                  <div className={`text-xs ${step.color}`}>{step.status}</div>
                                </div>
                                <span className="text-xs font-mono text-slate-400">{step.time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 4: LOST REVENUE ROI CALCULATOR */}
                    {pcActiveTab === 'roi' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl text-slate-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Weekly Lost High-Ticket Inquiries:</span><span className="text-rose-600 font-black">{weeklyLostLeads} leads/week</span>
                              </div>
                              <input type="range" min="2" max="50" step="1" value={weeklyLostLeads} onChange={(e) => setWeeklyLostLeads(Number(e.target.value))} className="w-full accent-rose-500" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Avg Job Ticket (Ceramic/PPF):</span><span className="text-rose-600 font-black">₹{avgJobTicket.toLocaleString('en-IN')}</span>
                              </div>
                              <input type="range" min="10000" max="150000" step="5000" value={avgJobTicket} onChange={(e) => setAvgJobTicket(Number(e.target.value))} className="w-full accent-rose-500" />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
                              <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Annual Lost Revenue</div>
                              <div className="text-3xl font-black text-red-600">₹{yearlyRevenueLoss.toLocaleString('en-IN')}</div>
                              <p className="text-xs text-red-700 mt-1">Losing ₹{monthlyRevenueLoss.toLocaleString('en-IN')}/month to competitors with modern digital showrooms.</p>
                            </div>
                            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200">
                              <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-1">ApexDrive Direct Conversion Gain</div>
                              <div className="text-xl font-black text-slate-900">High-Ticket Customer Capture</div>
                              <p className="text-xs text-slate-600 mt-1">Convert inquiries into booked ₹50,000+ jobs.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>

                </div>

                {/* PC Metallic Monitor Stand Base */}
                <div className="w-36 sm:w-56 h-7 bg-gradient-to-b from-slate-700 to-slate-900 rounded-b-2xl mx-auto shadow-2xl border-t border-slate-600" />
              </div>

            </div>
          </section>

          {/* QUOTE MODAL SIMULATION */}
          <AnimatePresence>
            {quoteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl text-slate-900 font-sans relative">
                  <div className="text-center border-b pb-4 mb-4">
                    <div className="text-2xl font-black text-slate-900">APEXDRIVE AUTOMOTIVE</div>
                    <div className="text-xs text-slate-500">Official Package Estimate</div>
                    <div className="text-xs font-bold text-rose-600 mt-1">Vehicle: {clientVehicle}</div>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    {quoteItems.map(item => (
                      <div key={item.id} className="flex justify-between"><span>{item.name}</span><span className="font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span></div>
                    ))}
                  </div>
                  <div className="border-t pt-3 space-y-1 text-xs text-slate-600 mb-6">
                    <div className="flex justify-between"><span>Subtotal:</span><span>₹{quoteSubtotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>GST (18%):</span><span>₹{gstTax.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t"><span>Est. Total:</span><span className="text-rose-600">₹{grandTotal.toLocaleString('en-IN')}</span></div>
                  </div>
                  <button onClick={() => setQuoteModal(false)} className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition-all">Done / Print Estimate</button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div> {/* End of main scrolling content container */}

        {/* Spacer for Parallax Reveal */}
        <div className="h-[80vh] w-full pointer-events-none" />

        {/* CINEMATIC PARALLAX FOOTER WITH WHATSAPP MAD LIBS */}
        <div className="fixed bottom-0 left-0 w-full h-[80vh] z-0 bg-[#050505] text-white flex flex-col items-center justify-center">
           <section id="contact" className="w-full max-w-5xl px-6 relative z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
             
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
                   className="bg-transparent border-b-4 border-slate-700 focus:border-rose-500 outline-none text-rose-400 placeholder-slate-700 w-full md:w-auto md:min-w-[300px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br className="hidden md:block" />
                 I run <br className="md:hidden" />
                 <input 
                   type="text" 
                   value={contactStudio}
                   onChange={(e) => setContactStudio(e.target.value)}
                   placeholder="YOUR DETAILING STUDIO / GARAGE" 
                   className="bg-transparent border-b-4 border-slate-700 focus:border-rose-500 outline-none text-rose-400 placeholder-slate-700 w-full md:w-auto md:min-w-[400px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br />
                 We are done losing high-ticket clients. <br /> Let's test ApexDrive OS.
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
