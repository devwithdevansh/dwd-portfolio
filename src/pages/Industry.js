import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SvgMaskText from '../components/SvgMaskText';
import CypherText from '../components/CypherText';
import AgencyFooter from '../components/AgencyFooter';
import { INDUSTRY_DATA } from '../data/IndustryData';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

export default function Industry() {
  const { industry } = useParams();
  
  const data = INDUSTRY_DATA[industry?.toLowerCase()] || INDUSTRY_DATA['enterprise'];
  const [metricValue, setMetricValue] = useState(data.metricDefault);
  
  // Calculate potential lost revenue
  // We multiply by 30 to get a monthly number, except for industries where metric is already monthly.
  const isMonthly = data.metricLabel.toLowerCase().includes('monthly');
  const multiplier = isMonthly ? 1 : 30;
  const lostRevenue = Math.floor(metricValue * multiplier * data.conversionBoost * data.avgTicketSize);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen"
    >
      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col justify-center px-4 sm:px-16 pt-32 pb-16 z-20 mix-blend-difference">
        <h1 className="text-sm font-bold tracking-[0.5em] uppercase mb-16 opacity-50" style={{ color: data.color }}>
          Industry Focus: {data.name}
        </h1>
        
        <h2 className="text-5xl sm:text-7xl lg:text-[7vw] font-black uppercase tracking-tighter leading-none mb-12 max-w-7xl">
          <CypherText text={data.hero} speed={5} delay={300} />
        </h2>
        
        <p className="font-mono text-xl opacity-60 max-w-2xl uppercase tracking-widest leading-loose mb-16">
          We don't take on every client. We build aggressive, high-converting digital assets specifically engineered for {data.name.toLowerCase()} that want to dominate their local market.
        </p>

        <a 
          href="/contact" 
          className="w-max px-12 py-6 border-2 font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black"
          style={{ borderColor: data.color, color: data.color }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = data.color; e.target.style.color = '#000'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = data.color; }}
          data-cursor="hover"
        >
          Dominate Your Market
        </a>
      </section>

      {/* The Industry-Tuned ROI Calculator */}
      <section className="py-32 px-4 sm:px-16 border-t border-gray-800 bg-[#050505] z-20 relative mix-blend-difference">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-8">
            The Cost of <span style={{ color: data.color }}>Bad Design</span>
          </h2>
          <p className="font-mono opacity-60 mb-16 max-w-3xl text-xl">
            A generic website doesn't just look ugly. It actively bleeds trust and revenue every single day. Use the slider below to see how much money you are losing by giving your competitors an edge.
          </p>
          
          <div className="border border-gray-800 p-8 sm:p-16 bg-[#050505]/50 backdrop-blur-md flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full">
              <label className="flex flex-col sm:flex-row justify-between font-mono mb-8 text-xl gap-4">
                <span>{data.metricLabel}</span>
                <span className="font-bold" style={{ color: data.color }}>
                  {metricValue.toLocaleString()} {data.metricUnit}
                </span>
              </label>
              
              <input 
                type="range" 
                min={data.metricStep} 
                max={data.metricMax} 
                step={data.metricStep}
                value={metricValue}
                onChange={(e) => setMetricValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                data-cursor="hover"
              />
              
              <div className="mt-8 p-4 border border-gray-800 font-mono text-sm opacity-50 uppercase tracking-widest leading-loose">
                <p>* Assuming an average ticket size of ₹{data.avgTicketSize.toLocaleString()}</p>
                <p>* Assuming a conservative {data.conversionBoost * 100}% conversion boost with our architecture</p>
              </div>
            </div>
            
            <div className="flex-1 w-full text-center lg:text-right">
              <span className="block font-mono opacity-60 mb-4 uppercase tracking-widest text-sm">Potential Lost Revenue</span>
              <span className="text-6xl sm:text-8xl font-black" style={{ color: '#F43F5E' }}>
                ₹{lostRevenue.toLocaleString()}
              </span>
              <span className="block font-mono opacity-60 mt-4 text-xl">/ month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Proof / Teaser */}
      <section className="py-32 px-4 sm:px-16 border-t border-gray-800 z-20 relative flex flex-col items-center mix-blend-difference">
         <h3 className="text-4xl font-black uppercase tracking-tighter mb-8">We let our work speak.</h3>
         <Link to="/work" className="text-2xl font-mono opacity-60 hover:opacity-100 transition-opacity border-b border-white pb-2" data-cursor="hover">
            View Our Case Studies →
         </Link>
      </section>

      <AgencyFooter />
    </motion.div>
  );
}
