import React from 'react';
import { motion } from 'framer-motion';
import Projects from '../components/Projects';
import CypherText from '../components/CypherText';
import AgencyFooter from '../components/AgencyFooter';

const pageVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, y: -100, transition: { duration: 0.5 } }
};

export default function Work() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen bg-transparent dark:bg-[#050505] transition-colors duration-1000"
    >
      {/* Header Section */}
      <section className="pt-48 pb-32 px-4 sm:px-16 border-b border-slate-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-8 text-slate-900 dark:text-white transition-colors duration-1000">
            <CypherText text="OUR PROOF." speed={15} />
          </h1>
          <p className="text-xl sm:text-2xl font-mono text-slate-600 dark:text-gray-400 max-w-3xl leading-relaxed uppercase tracking-widest transition-colors duration-1000">
            We don't talk about what we can do. We show you the metrics we've generated for our clients.
          </p>
        </div>
      </section>

      {/* Projects Component */}
      <Projects />

      <AgencyFooter />
    </motion.div>
  );
}
