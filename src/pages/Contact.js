import React from 'react';
import { motion } from 'framer-motion';
import ShaderBackground from '../components/ShaderBackground';

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
      <ShaderBackground theme="luxury" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h1 className="text-6xl sm:text-[8vw] font-black uppercase tracking-tighter leading-none mix-blend-difference text-[#F3F4F6] mb-16">
          LET'S <span className="text-transparent [-webkit-text-stroke:2px_#EAB308]">TALK</span>
        </h1>
        
        {/* Conversational Brutalist Form */}
        <div className="max-w-4xl mix-blend-difference">
          <p className="text-3xl sm:text-5xl font-bold leading-relaxed">
            Hi, my name is <br/>
            <input 
              type="text" 
              placeholder="YOUR NAME" 
              className="bg-transparent border-b-4 border-gray-600 focus:border-[#EAB308] outline-none text-[#EAB308] placeholder-gray-600 w-full sm:w-auto mt-4 mb-8"
              data-cursor="hover"
            />
            <br/>
            I represent <br/>
            <input 
              type="text" 
              placeholder="YOUR COMPANY" 
              className="bg-transparent border-b-4 border-gray-600 focus:border-[#EAB308] outline-none text-[#EAB308] placeholder-gray-600 w-full sm:w-auto mt-4 mb-8"
              data-cursor="hover"
            />
            <br/>
            and we want to dominate our industry.
          </p>
          
          <button 
            className="mt-16 px-12 py-6 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-[#EAB308] transition-colors"
            data-cursor="hover"
            onClick={() => alert("This would connect to your backend / email service!")}
          >
            Start the Project
          </button>
        </div>

        {/* Direct Contact */}
        <div className="mt-32 pt-16 border-t border-gray-800 mix-blend-difference pb-32">
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
