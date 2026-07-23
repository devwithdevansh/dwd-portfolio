import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  exit: { opacity: 0, y: 100, transition: { duration: 0.5 } }
};

export default function Contact() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 pt-32 min-h-screen"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h1 className="text-6xl sm:text-[8vw] font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-[#F3F4F6] mb-16 transition-colors duration-1000">
          LET'S <span className="text-transparent [-webkit-text-stroke:2px_#0f172a] dark:[-webkit-text-stroke:2px_#EAB308]">TALK</span>
        </h1>
        
        {/* Conversational Brutalist Form */}
        <div className="max-w-4xl text-slate-900 dark:text-white transition-colors duration-1000">
          <p className="text-3xl sm:text-5xl font-bold leading-relaxed">
            Hi, my name is <br/>
            <input 
              type="text" 
              placeholder="YOUR NAME" 
              className="bg-transparent border-b-4 border-gray-300 dark:border-gray-600 focus:border-slate-900 dark:focus:border-[#EAB308] outline-none text-slate-900 dark:text-[#EAB308] placeholder-gray-400 dark:placeholder-gray-600 w-full sm:w-auto mt-4 mb-8 transition-colors duration-500"
              data-cursor="hover"
            />
            <br/>
            I represent <br/>
            <input 
              type="text" 
              placeholder="YOUR COMPANY" 
              className="bg-transparent border-b-4 border-gray-300 dark:border-gray-600 focus:border-slate-900 dark:focus:border-[#EAB308] outline-none text-slate-900 dark:text-[#EAB308] placeholder-gray-400 dark:placeholder-gray-600 w-full sm:w-auto mt-4 mb-8 transition-colors duration-500"
              data-cursor="hover"
            />
            <br/>
            and we want to dominate our industry.
          </p>
          
          <button 
            className="mt-16 px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.3em] hover:bg-slate-800 dark:hover:bg-[#EAB308] hover:shadow-[12px_12px_0px_#0f172a] dark:hover:shadow-none hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300"
            data-cursor="hover"
            onClick={() => alert("This would connect to your backend / email service!")}
          >
            Start the Project
          </button>
        </div>

        {/* Direct Contact */}
        <div className="mt-32 pt-16 border-t border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white pb-32 transition-colors duration-1000">
          <p className="font-mono opacity-50 uppercase tracking-widest mb-4">Direct Lines</p>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <a href="mailto:devwithdevansh@gmail.com" className="text-2xl font-bold hover:text-[#EAB308]" data-cursor="hover">devwithdevansh@gmail.com</a>
            <a href="tel:+919687629341" className="text-2xl font-bold hover:text-[#EAB308]" data-cursor="hover">+91 9687629341</a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
