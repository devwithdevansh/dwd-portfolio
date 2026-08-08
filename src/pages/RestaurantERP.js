import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Restaurant3DScene from '../components/Restaurant3DScene';
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

// Curtain blind transition in warm cafe orange
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

// Initial Menu Data for POS Billing Simulator
const MENU_CATEGORIES = [
  { id: 'starters', name: 'Starters', icon: '🍕' },
  { id: 'mains', name: 'Main Course', icon: '🍝' },
  { id: 'beverages', name: 'Beverages', icon: '🍹' },
  { id: 'desserts', name: 'Desserts', icon: '🍨' },
];

const MENU_ITEMS = [
  { id: 101, category: 'starters', name: 'Truffle Mushroom Bruschetta', price: 340, tags: ['Chef Special'] },
  { id: 102, category: 'starters', name: 'Crispy Garlic Butter Prawns', price: 420, tags: ['Popular'] },
  { id: 103, category: 'starters', name: 'Stuffed Woodfired Nachos', price: 290, tags: ['Veg'] },
  { id: 201, category: 'mains', name: 'Smoked Woodfired Pepperoni Pizza', price: 590, tags: ['Best Seller'] },
  { id: 202, category: 'mains', name: 'Creamy Pesto Penne Pasta', price: 460, tags: ['Veg'] },
  { id: 203, category: 'mains', name: 'Grilled Norwegian Salmon Bowl', price: 780, tags: ['Premium'] },
  { id: 301, category: 'beverages', name: 'Artisan Cold Brew Vanilla', price: 220, tags: ['Cold'] },
  { id: 302, category: 'beverages', name: 'Fresh Mint Citrus Sparkler', price: 180, tags: ['Refresh'] },
  { id: 303, category: 'beverages', name: 'Bespoke Mango Passion Smoothie', price: 250, tags: ['Fresh'] },
  { id: 401, category: 'desserts', name: 'Belgian Sizzling Dark Chocolate Brownie', price: 320, tags: ['Hot'] },
  { id: 402, category: 'desserts', name: 'Classic Tiramisu Tub', price: 360, tags: ['Authentic'] },
];

// Floor Tables Data (Indoor vs Outdoor)
const INITIAL_TABLES = [
  { id: 'T-01', zone: 'indoor', capacity: 2, status: 'available', currentBill: 0, orderTime: null },
  { id: 'T-02', zone: 'indoor', capacity: 4, status: 'occupied', currentBill: 1240, orderTime: '18 mins' },
  { id: 'T-03', zone: 'indoor', capacity: 6, status: 'kot_active', currentBill: 2180, orderTime: '8 mins' },
  { id: 'T-04', zone: 'indoor', capacity: 4, status: 'available', currentBill: 0, orderTime: null },
  { id: 'T-05', zone: 'indoor', capacity: 2, status: 'billed', currentBill: 890, orderTime: '42 mins' },
  { id: 'T-06', zone: 'indoor', capacity: 8, status: 'available', currentBill: 0, orderTime: null },
  
  { id: 'OUT-01', zone: 'outdoor', capacity: 4, status: 'occupied', currentBill: 1560, orderTime: '25 mins' },
  { id: 'OUT-02', zone: 'outdoor', capacity: 2, status: 'kot_active', currentBill: 920, orderTime: '12 mins' },
  { id: 'OUT-03', zone: 'outdoor', capacity: 4, status: 'available', currentBill: 0, orderTime: null },
  { id: 'OUT-04', zone: 'outdoor', capacity: 6, status: 'available', currentBill: 0, orderTime: null },
  { id: 'OUT-05', zone: 'outdoor', capacity: 2, status: 'reserved', currentBill: 0, orderTime: 'In 30m' },
];

export default function RestaurantERP() {
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState("");
  const [contactRestaurant, setContactRestaurant] = useState("");

  // PC Monitor UI Active View State ('pos' | 'floor' | 'kot' | 'roi')
  const [pcActiveTab, setPcActiveTab] = useState('pos');

  const handleWhatsApp = () => {
    const message = `Hello Devansh! My name is ${contactName || "[Your Name]"} and I run ${contactRestaurant || "[Your Cafe / Restaurant]"}. We are done renting generic software and want to build our tailored engine. Let's talk!`;
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

  // Interactive State for Floor / Table Management Simulator
  const [activeZone, setActiveZone] = useState('indoor');
  const [outdoorSurchargePct, setOutdoorSurchargePct] = useState(10);
  const [tables] = useState(INITIAL_TABLES);
  const [selectedTableId, setSelectedTableId] = useState('T-02');

  // Interactive State for POS Billing Simulator
  const [activeCategory, setActiveCategory] = useState('mains');
  const [cart, setCart] = useState([
    { id: 201, name: 'Smoked Woodfired Pepperoni Pizza', price: 590, qty: 1, zone: 'indoor' },
    { id: 301, name: 'Artisan Cold Brew Vanilla', price: 220, qty: 2, zone: 'indoor' },
  ]);
  const [posTableId, setPosTableId] = useState('T-02');
  const [kotModal, setKotModal] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);

  // Interactive State for Aggregator Loss ROI Calculator
  const [dailyOrders, setDailyOrders] = useState(60);
  const [avgTicket, setAvgTicket] = useState(650);
  const [aggregatorCutPct, setAggregatorCutPct] = useState(25);

  // Helper calculations for POS
  const selectedTable = tables.find(t => t.id === posTableId) || tables[0];
  const isPosOutdoor = selectedTable.zone === 'outdoor';
  
  const subtotalBase = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const seatingSurcharge = isPosOutdoor ? Math.round(subtotalBase * (outdoorSurchargePct / 100)) : 0;
  const gstTax = Math.round((subtotalBase + seatingSurcharge) * 0.05);
  const grandTotal = subtotalBase + seatingSurcharge + gstTax;

  // Cart operations
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // ROI Calculator Calculations
  const dailyLoss = Math.round(dailyOrders * avgTicket * (aggregatorCutPct / 100));
  const monthlyLoss = dailyLoss * 30;
  const yearlyLoss = monthlyLoss * 12;

  // JSON-LD Schema for SEO
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FlavorFlow Enterprise POS & Restaurant Management Engine",
    "operatingSystem": "Web, Android, iOS, Windows, macOS",
    "applicationCategory": "BusinessApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "154"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Enterprise-grade bespoke Cafe & Restaurant POS software featuring Kitchen Order Tickets (KOT), Indoor vs Outdoor Differential Table Pricing, and Direct WhatsApp Ordering Engine."
  };

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />

      {/* Signature Cafe Orange Curtain Transition */}
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
                className="w-1/5 bg-orange-600"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1, transition: { duration: 0.1 } }}
        exit={{ opacity: 0, transition: { delay: 0.5, duration: 0.1 } }}
        className="relative min-h-screen bg-transparent text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-orange-600 selection:text-white transition-colors duration-500"
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Helmet>
          <title>FlavorFlow POS | Next-Gen Cafe & Restaurant Management Engine</title>
          <meta name="description" content="Stop renting generic POS apps. Build a high-performance, tailored cafe & restaurant POS engine." />
          <meta name="keywords" content="restaurant POS software, cafe management software, petpooja alternative, indoor outdoor table pricing, kitchen order ticket KOT, restaurant billing system, direct whatsapp ordering" />
          <script type="application/ld+json">
            {JSON.stringify(jsonLdSchema)}
          </script>
        </Helmet>

        {/* Floating Close Button with Dark Mode Support */}
        <Link to="/" className="fixed top-8 left-8 z-50 flex items-center justify-center w-12 h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:scale-105 hover:shadow-md transition-all duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </Link>

        {/* Modern Glass Navbar with Light & Dark Theme Support */}
        <nav className="fixed top-0 w-full z-40 bg-white/40 dark:bg-slate-950/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-800/60 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center md:justify-end gap-8">
            <a href="#comparison" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">The Trap</a>
            <a href="#pillars" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">The 3 Pillars</a>
            <a href="#pc-demo" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Interactive POS Terminal</a>
            <a href="#contact" className="px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-full shadow-lg shadow-orange-600/30 hover:bg-orange-700 transition-colors">Consultation</a>
          </div>
        </nav>

        {/* MAIN SCROLLING CONTENT WRAPPER WITH LIGHT & DARK MODE SUPPORT */}
        <div className="relative z-10 bg-slate-50 dark:bg-[#0c0c0e] text-slate-900 dark:text-white rounded-b-[4rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-colors duration-500">
          
          {/* HERO SECTION WITH 3D ORB */}
          <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto">
            <div className="md:w-1/2 relative z-10 text-center md:text-left mt-20 md:mt-0" data-cursor="hero" data-cursor-text="SCROLL">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                  Bespoke Restaurant POS & Floor Engine
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
                  You started a cafe to craft great food. <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500">
                    Not to chase bills.
                  </span>
                </h1>

                <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl font-light leading-relaxed mx-auto md:mx-0">
                  You are currently spending 60% of your time managing frustrated diners and paper KOT errors. Stop renting generic POS apps. Build a unified restaurant engine.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#comparison" className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-full text-base shadow-xl shadow-slate-900/20 dark:shadow-none hover:scale-105 transition-transform" data-cursor="button">
                    Why We Are Different
                  </a>
                  <a href="#pc-demo" className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full text-base shadow-xl shadow-orange-600/30 hover:scale-105 transition-transform" data-cursor="button">
                    Launch Interactive POS
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="md:w-1/2 h-[550px] md:h-[620px] w-full relative z-0 mt-8 md:mt-0" style={{ background: '#0a0f1e' }}>
              <Suspense fallback={<div className="w-full h-full animate-pulse bg-orange-100 dark:bg-orange-950/40 rounded-full" />}>
                 <Canvas camera={{ position: [0.5, 5.5, 12.5], fov: 65 }} shadows gl={{ alpha: false, antialias: true }} style={{ background: '#0a0f1e' }}>
                   <color attach="background" args={['#0a0f1e']} />
                   <fog attach="fog" args={['#0a0f1e', 14, 28]} />
                   <Restaurant3DScene />
                 </Canvas>
              </Suspense>
            </div>
          </section>

          {/* EDGY COMPARISON SECTION (CINEMATIC DARK SEAMLESS) */}
          <section id="comparison" className="py-32 px-6 relative z-10 bg-[#050505] text-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  The <span className="text-red-500 line-through decoration-red-600 decoration-[6px]">Common POS</span> Trap.
                </h2>
                <p className="mt-6 text-xl text-gray-400 font-light max-w-2xl mx-auto">
                  Most vendors sell you a boxed subscription and force your restaurant to fit inside it. We build systems that fit your cafe.
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
                    {[
                      'Cloud POS crashes during Sunday dinner peak hours.',
                      'Rigid menu structures force you to change your daily specials workflow.',
                      'Aggregator platforms bleed 25-30% of your delivery profit margin.',
                      'Customer support is just a sluggish, automated ticketing queue.'
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-400 font-medium text-lg border-b border-red-900/20 pb-4">
                        <span className="text-red-500 font-black text-xl">×</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* The Tailored Engine (Orange Theme) */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border border-orange-500/30 bg-orange-950/20 p-10 md:p-14 rounded-3xl relative overflow-hidden group hover:bg-orange-900/30 transition-colors duration-500 shadow-[0_0_50px_rgba(249,115,22,0.15)]"
                  data-cursor="engine" data-cursor-text="✓"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-8 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" /> The Tailored Engine
                  </h3>
                  <ul className="space-y-6">
                    {[
                      'Your POS is custom-architected for your restaurant\'s unique DNA.',
                      'Custom indoor AC vs outdoor terrace seating differential price automation.',
                      'Direct WhatsApp & QR ordering engine saving 100% of aggregator cuts.',
                      'Direct WhatsApp partnership with the engineers who built it.'
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 text-gray-200 font-medium text-lg border-b border-orange-500/20 pb-4">
                        <span className="text-orange-400 font-black text-xl">✓</span> {text}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </section>

          {/* THE 3 PILLARS WITH LIGHT & DARK MODE SUPPORT */}
          <section id="pillars" className="py-32 pb-40 px-6 relative z-10 bg-white dark:bg-[#08080a] text-slate-900 dark:text-white overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
              <div className="mb-32 md:text-center">
                <KineticHeading text="The 3 Pillars of Transformation." />
                <p className="mt-6 text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light max-w-3xl md:mx-auto">
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
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-emerald-600 dark:bg-emerald-400" /> Pillar 01
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Multi-Zone Floor & <br />Differential Seating.</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Cafes bleed revenue by charging identical rates for high-maintenance terrace ambiance versus indoor standard seating. We automate differential floor pricing.</p>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">Our floor engine manages real-time indoor AC vs outdoor garden table availability, seating timers, and zone surcharge rules automatically.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 dark:bg-slate-900/60 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 dark:from-emerald-950/20 to-teal-50/50 dark:to-teal-950/20" />
                     <div className="relative w-[80%] md:w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 flex flex-col justify-center border border-slate-100 dark:border-slate-800 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        <div className="flex justify-between items-center mb-6">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">Paid</span>
                        </div>
                        <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">Outdoor Terrace</div>
                        <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dynamic Ambiance Rate +10%</div>
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
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Kitchen Order Tickets <br />(KOT Zero-Lag).</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Paper ticket delays and illegible handwriting lead to wrong orders and angry patrons. We digitize the kitchen dispatch.</p>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">Instant KOT routing from waitstaff tablets to kitchen display monitors under 120ms. Zero dropped tickets, zero misread items, total kitchen harmony.</p>
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
                             <div className="font-bold text-slate-900 dark:text-slate-100">[ 2x ] Woodfired Pizza</div>
                             <span className="text-amber-600 dark:text-amber-400 font-black">FIRE</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                             <div className="font-bold text-slate-900 dark:text-slate-100">[ 1x ] Cold Brew</div>
                             <span className="text-emerald-600 dark:text-emerald-400 font-black">READY</span>
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
                    <div className="text-orange-600 dark:text-orange-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-orange-600 dark:bg-orange-400" /> Pillar 03
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">Aggregator Independence <br />(Direct WhatsApp Engine).</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Delivery platforms take up to 30% cut of your hard-earned revenue. Stop surrendering your profit margins.</p>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">Direct QR table ordering & WhatsApp customer engagement system. Diners scan, order, and pay directly to your account with zero commission cuts.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 w-full h-80 bg-slate-50 dark:bg-slate-900/60 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner relative overflow-hidden flex items-center justify-center"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 dark:from-orange-950/20 to-amber-50/50 dark:to-amber-950/20" />
                     <div className="relative w-[70%] h-[80%] border border-slate-200 dark:border-slate-800 rounded-3xl grid grid-cols-2 grid-rows-2 gap-4 p-4 hover:scale-105 transition-transform duration-500 cursor-pointer">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 ${i % 2 === 0 ? 'bg-orange-500' : 'bg-amber-500'}`} />
                            <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-300">QR</div>
                          </div>
                        ))}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center z-10">
                          <div className="w-4 h-4 bg-slate-900 dark:bg-white rounded-full animate-pulse" />
                        </div>
                     </div>
                  </motion.div>
                </div>

              </div>
            </div>
          </section>

          {/* ULTRA-SLEEK INTERACTIVE DESKTOP PC / POS MACHINE FRAME */}
          <section id="pc-demo" className="py-24 sm:py-32 px-4 sm:px-6 relative z-10 bg-slate-900 dark:bg-[#050507] text-white rounded-b-[4rem] transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
              
              {/* SECTION HEADER */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="text-orange-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  [ CLIENT INTERACTIVE POS MACHINE DEMO ]
                </div>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
                  Test the Restaurant POS in Real-Time.
                </h2>
                <p className="mt-4 text-base sm:text-xl text-slate-400 font-light">
                  Use the touch controls on this desktop POS monitor frame to manage floor tables, build customer bills, dispatch KOT tickets, and calculate aggregator savings.
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
                        FLAVORFLOW_POS_ENGINE_v4.2 // MAIN COUNTER TERMINAL
                      </span>
                    </div>

                    {/* Live System Time Indicator */}
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[10px] sm:text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-400 font-bold">POS ACTIVE</span>
                      <span className="text-slate-500">| 120ms KOT</span>
                    </div>
                  </div>

                  {/* Monitor Navigation Tabs Bar inside PC Screen */}
                  <div className="bg-slate-900/90 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setPcActiveTab('pos')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'pos' ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>🧾</span> 1. Live POS & Billing
                    </button>
                    <button
                      onClick={() => setPcActiveTab('floor')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'floor' ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>🪑</span> 2. Floor & Outdoor Surcharge
                    </button>
                    <button
                      onClick={() => setPcActiveTab('kot')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'kot' ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>🔥</span> 3. Chef KOT Station
                    </button>
                    <button
                      onClick={() => setPcActiveTab('roi')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${pcActiveTab === 'roi' ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <span>📊</span> 4. Aggregator Profit ROI
                    </button>
                  </div>

                  {/* PC Screen Content Area */}
                  <div className="p-4 sm:p-8 bg-slate-900 min-h-[550px] relative text-slate-900 font-sans">
                    
                    {/* TAB 1: LIVE POS & BILLING TERMINAL */}
                    {pcActiveTab === 'pos' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Menu Item Selector (7 cols) */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {MENU_CATEGORIES.map(cat => (
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
                            {MENU_ITEMS
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
                                      <span className="text-[9px] font-bold uppercase bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded whitespace-nowrap">{item.tags[0]}</span>
                                    </div>
                                    <div className="text-base font-black text-slate-900 mb-3">₹{item.price}</div>
                                  </div>
                                  <button onClick={() => addToCart(item)} className="w-full py-2 bg-white hover:bg-orange-600 hover:text-white border border-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">
                                    <span>+ Add to Order</span>
                                  </button>
                                </motion.div>
                              ))}
                          </div>
                        </div>

                        {/* Cart & Billing Ledger (5 cols) */}
                        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                          <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-200">
                            <div>
                              <h3 className="font-black text-lg text-slate-900">Active Bill</h3>
                              <p className="text-[10px] text-slate-500">POS Ticket #{Math.floor(1000 + Math.random() * 9000)}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <label htmlFor="pos-table-select-final" className="text-xs font-bold text-slate-600">Table:</label>
                              <select
                                id="pos-table-select-final"
                                value={posTableId}
                                onChange={(e) => setPosTableId(e.target.value)}
                                className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                {tables.map(t => (
                                  <option key={t.id} value={t.id}>{t.id} ({t.zone})</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mb-4">
                            {cart.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                                <div className="flex-1 pr-2">
                                  <div className="font-bold text-slate-900">{item.name}</div>
                                  <div className="text-[10px] text-slate-500">₹{item.price} each</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-1.5 py-0.5">
                                    <button onClick={() => updateCartQty(item.id, -1)} className="font-bold text-slate-500 hover:text-red-600 px-1">-</button>
                                    <span className="font-bold text-slate-900 text-xs">{item.qty}</span>
                                    <button onClick={() => updateCartQty(item.id, 1)} className="font-bold text-slate-500 hover:text-orange-600 px-1">+</button>
                                  </div>
                                  <span className="font-black text-slate-900 w-12 text-right">₹{item.price * item.qty}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-1.5 pt-3 border-t border-slate-200 text-xs mb-4">
                            <div className="flex justify-between text-slate-600"><span>Base Subtotal:</span><span className="font-bold text-slate-900">₹{subtotalBase}</span></div>
                            {isPosOutdoor && <div className="flex justify-between text-orange-600 font-medium"><span>Outdoor Surcharge ({outdoorSurchargePct}%):</span><span className="font-bold">+₹{seatingSurcharge}</span></div>}
                            <div className="flex justify-between text-slate-600"><span>GST Tax (5%):</span><span className="font-bold text-slate-900">₹{gstTax}</span></div>
                            <div className="flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-200"><span>Grand Total:</span><span className="text-orange-600">₹{grandTotal}</span></div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setKotModal(true)} disabled={cart.length === 0} className="py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-md transition-all">
                              <span>🔥 Fire KOT</span>
                            </button>
                            <button onClick={() => setReceiptModal(true)} disabled={cart.length === 0} className="py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-orange-600/30 transition-all">
                              <span>💳 Settle Bill</span>
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    )}

                    {/* TAB 2: FLOOR & OUTDOOR DIFFERENTIAL SURCHARGE */}
                    {pcActiveTab === 'floor' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl">
                        <div className="bg-slate-900 text-white p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setActiveZone('indoor')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeZone === 'indoor' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>
                              🏠 Indoor AC Hall
                            </button>
                            <button onClick={() => setActiveZone('outdoor')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeZone === 'outdoor' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>
                              🌿 Outdoor Terrace (+{outdoorSurchargePct}%)
                            </button>
                          </div>

                          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl">
                            <label htmlFor="pc-surcharge-range-final" className="text-xs font-semibold text-slate-300">
                              Outdoor Premium: <span className="text-orange-400 font-bold">+{outdoorSurchargePct}%</span>
                            </label>
                            <input
                              id="pc-surcharge-range-final"
                              type="range"
                              min="0"
                              max="25"
                              step="5"
                              value={outdoorSurchargePct}
                              onChange={(e) => setOutdoorSurchargePct(Number(e.target.value))}
                              className="w-28 accent-orange-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {tables
                            .filter(t => t.zone === activeZone)
                            .map((table) => {
                              const isSelected = selectedTableId === table.id;
                              let statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-300';
                              let statusText = 'Available';

                              if (table.status === 'occupied') { statusBg = 'bg-orange-50 text-orange-700 border-orange-300'; statusText = 'Occupied'; }
                              else if (table.status === 'kot_active') { statusBg = 'bg-amber-50 text-amber-700 border-amber-300'; statusText = 'KOT Active'; }
                              else if (table.status === 'billed') { statusBg = 'bg-purple-50 text-purple-700 border-purple-300'; statusText = 'Billed'; }

                              return (
                                <div
                                  key={table.id}
                                  onClick={() => { setSelectedTableId(table.id); setPosTableId(table.id); }}
                                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-orange-600 bg-orange-50/50 shadow-md ring-2 ring-orange-400/30' : 'border-slate-200 bg-white'}`}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-black text-lg text-slate-900">{table.id}</span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusBg}`}>{statusText}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-medium">👥 {table.capacity} Seats</div>
                                  <div className="mt-3 pt-2 border-t flex justify-between text-xs">
                                    <span className="text-slate-400">Total:</span>
                                    <span className="font-bold text-slate-900">
                                      {table.currentBill > 0 ? `₹${table.currentBill + (table.zone === 'outdoor' ? Math.round(table.currentBill * (outdoorSurchargePct/100)) : 0)}` : '₹0'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: CHEF KOT STATION */}
                    {pcActiveTab === 'kot' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 text-white p-6 rounded-3xl shadow-xl font-mono">
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                          <div>
                            <h3 className="text-xl font-black text-amber-400">CHEF KITCHEN DISPLAY SYSTEM</h3>
                            <p className="text-xs text-slate-400">Real-Time Kitchen Orders Feed (120ms Latency)</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
                            🔥 LIVE DISPATCH ACTIVE
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-2xl space-y-3">
                            <div className="flex justify-between border-b border-amber-500/20 pb-2">
                              <span className="font-bold text-amber-300">T-03 (Indoor AC)</span>
                              <span className="text-xs bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded">Order #1042 • 8 mins ago</span>
                            </div>
                            <div className="space-y-1 text-xs text-slate-200">
                              <div className="flex justify-between"><span>[ 1x ] Truffle Mushroom Bruschetta</span><span className="text-amber-400 font-bold">PREPARING</span></div>
                              <div className="flex justify-between"><span>[ 2x ] Smoked Woodfired Pepperoni Pizza</span><span className="text-amber-400 font-bold">IN OVEN</span></div>
                            </div>
                          </div>

                          <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-2xl space-y-3">
                            <div className="flex justify-between border-b border-emerald-500/20 pb-2">
                              <span className="font-bold text-emerald-300">OUT-02 (Outdoor Terrace)</span>
                              <span className="text-xs bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">Order #1039 • 12 mins ago</span>
                            </div>
                            <div className="space-y-1 text-xs text-slate-200">
                              <div className="flex justify-between"><span>[ 2x ] Artisan Cold Brew Vanilla</span><span className="text-emerald-400 font-bold">READY TO SERVE</span></div>
                              <div className="flex justify-between"><span>[ 1x ] Stuffed Woodfired Nachos</span><span className="text-emerald-400 font-bold">READY TO SERVE</span></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 4: AGGREGATOR PROFIT ROI CALCULATOR */}
                    {pcActiveTab === 'roi' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl text-slate-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Daily Orders:</span><span className="text-orange-600 font-black">{dailyOrders} orders/day</span>
                              </div>
                              <input type="range" min="10" max="300" step="5" value={dailyOrders} onChange={(e) => setDailyOrders(Number(e.target.value))} className="w-full accent-orange-500" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Avg Bill Size:</span><span className="text-orange-600 font-black">₹{avgTicket}</span>
                              </div>
                              <input type="range" min="200" max="2000" step="50" value={avgTicket} onChange={(e) => setAvgTicket(Number(e.target.value))} className="w-full accent-orange-500" />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Aggregator Cut %:</span><span className="text-red-600 font-black">{aggregatorCutPct}% cut</span>
                              </div>
                              <input type="range" min="15" max="35" step="1" value={aggregatorCutPct} onChange={(e) => setAggregatorCutPct(Number(e.target.value))} className="w-full accent-red-500" />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
                              <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Annual Aggregator Loss</div>
                              <div className="text-3xl font-black text-red-600">₹{yearlyLoss.toLocaleString('en-IN')}</div>
                              <p className="text-xs text-red-700 mt-1">Bleeding ₹{monthlyLoss.toLocaleString('en-IN')}/month to third-party apps.</p>
                            </div>
                            <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200">
                              <div className="text-[10px] font-bold text-orange-700 uppercase tracking-wider mb-1">Direct QR & WhatsApp Savings</div>
                              <div className="text-xl font-black text-slate-900">Keep 100% Revenue</div>
                              <p className="text-xs text-slate-600 mt-1">Zero commission cuts on direct customer orders.</p>
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

          {/* KOT MODAL SIMULATION */}
          <AnimatePresence>
            {kotModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-amber-50 border-2 border-amber-400 p-8 rounded-3xl max-w-md w-full shadow-2xl text-slate-900 font-mono relative">
                  <div className="text-center border-b-2 border-dashed border-slate-400 pb-4 mb-4">
                    <div className="text-xs font-bold text-amber-800 uppercase tracking-widest">[ KITCHEN ORDER TICKET (KOT) ]</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">CHEF STATION #01</div>
                    <div className="text-xs text-slate-600 mt-1">Table: <span className="font-bold text-slate-900">{posTableId}</span> ({selectedTable.zone.toUpperCase()})</div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm font-bold border-b border-amber-200/60 pb-1">
                        <span>[ {item.qty}x ] {item.name}</span>
                        <span className="text-xs text-amber-800">FIRE</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-200/60 p-3 rounded-xl text-xs text-amber-900 mb-6 font-sans font-medium text-center">
                    ✅ Dispatched to Kitchen Display Screen in 120ms.
                  </div>
                  <button onClick={() => setKotModal(false)} className="w-full py-3 bg-slate-900 text-white font-sans font-bold rounded-xl text-xs hover:bg-slate-800 transition-all">Close Ticket Preview</button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* RECEIPT MODAL SIMULATION */}
          <AnimatePresence>
            {receiptModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl text-slate-900 font-sans relative">
                  <div className="text-center border-b pb-4 mb-4">
                    <div className="text-2xl font-black text-slate-900">THE ARTISAN CAFE</div>
                    <div className="text-xs text-slate-500">Tax Invoice / Receipt</div>
                    <div className="text-xs font-bold text-orange-600 mt-1">Table: {posTableId} ({selectedTable.zone.toUpperCase()})</div>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between"><span>{item.qty}x {item.name}</span><span className="font-bold">₹{item.price * item.qty}</span></div>
                    ))}
                  </div>
                  <div className="border-t pt-3 space-y-1 text-xs text-slate-600 mb-6">
                    <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotalBase}</span></div>
                    {isPosOutdoor && <div className="flex justify-between text-orange-600"><span>Outdoor Fee ({outdoorSurchargePct}%):</span><span>+₹{seatingSurcharge}</span></div>}
                    <div className="flex justify-between"><span>GST (5%):</span><span>₹{gstTax}</span></div>
                    <div className="flex justify-between font-black text-slate-900 text-base pt-2 border-t"><span>Paid Total:</span><span className="text-orange-600">₹{grandTotal}</span></div>
                  </div>
                  <button onClick={() => setReceiptModal(false)} className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl text-xs hover:bg-orange-700 transition-all">Done / Next Bill</button>
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
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
             
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
                   className="bg-transparent border-b-4 border-slate-700 focus:border-orange-500 outline-none text-orange-400 placeholder-slate-700 w-full md:w-auto md:min-w-[300px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br className="hidden md:block" />
                 I run <br className="md:hidden" />
                 <input 
                   type="text" 
                   value={contactRestaurant}
                   onChange={(e) => setContactRestaurant(e.target.value)}
                   placeholder="YOUR CAFE / RESTAURANT" 
                   className="bg-transparent border-b-4 border-slate-700 focus:border-orange-500 outline-none text-orange-400 placeholder-slate-700 w-full md:w-auto md:min-w-[400px] mx-0 md:mx-4 mt-4 md:mt-0 mb-8 md:mb-0 transition-colors duration-500"
                   data-cursor="hover"
                 />
                 <br />
                 We are done renting generic software. <br /> Let's build our tailored engine.
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
