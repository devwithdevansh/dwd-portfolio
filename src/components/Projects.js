import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECT_DATA = [
  {
    id: 'proj-1',
    title: 'Ethereal Space',
    category: 'Web Design / WebGL',
    year: '2026',
    color: '#EAB308', // Yellow
    description: 'A completely immersive 3D experience built with React Three Fiber and GSAP. Pushing the boundaries of browser rendering.',
  },
  {
    id: 'proj-2',
    title: 'Neon Brutal',
    category: 'E-Commerce / Shopify',
    year: '2025',
    color: '#06B6D4', // Cyan
    description: 'An aggressive, highly-converting e-commerce template featuring stark contrasts and heavy typographic hierarchy.',
  },
  {
    id: 'proj-3',
    title: 'Minimalist Void',
    category: 'Brand Identity',
    year: '2025',
    color: '#A855F7', // Purple
    description: 'Stripping away everything non-essential to leave only pure, unadulterated aesthetic value.',
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section className="relative w-full bg-[#050505] text-[#F3F4F6] py-32 z-20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-16 opacity-50 border-b border-gray-800 pb-4">
          Selected Works
        </h2>

        {/* The Brutalist List */}
        <div className="flex flex-col border-t border-gray-800">
          {PROJECT_DATA.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`container-${project.id}`}
              onClick={() => setSelectedProject(project)}
              className="group flex flex-col sm:flex-row justify-between items-start sm:items-center py-12 border-b border-gray-800 cursor-pointer relative overflow-hidden"
              data-cursor="hover"
            >
              {/* Background fill on hover (desktop only via css) */}
              <div className="absolute inset-0 bg-[#111111] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />
              
              <div className="relative z-10 flex flex-col">
                <motion.h3 
                  layoutId={`title-${project.id}`}
                  className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mix-blend-difference"
                >
                  {project.title}
                </motion.h3>
                <motion.p 
                  layoutId={`category-${project.id}`}
                  className="text-xl sm:text-2xl mt-2 font-mono opacity-60 mix-blend-difference"
                >
                  {project.category}
                </motion.p>
              </div>

              <motion.div 
                layoutId={`year-${project.id}`}
                className="relative z-10 mt-4 sm:mt-0 text-2xl font-bold mix-blend-difference"
              >
                {project.year}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The Morphing Full-Screen Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            layoutId={`container-${selectedProject.id}`}
            className="fixed inset-0 z-[100] flex flex-col bg-[#0f0f0f] text-[#F3F4F6] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {/* Massive Header inside the expanded view */}
            <div className="p-8 sm:p-16 border-b border-gray-800 flex justify-between items-start">
              <div className="flex flex-col">
                <motion.h3 
                  layoutId={`title-${selectedProject.id}`}
                  className="text-6xl sm:text-[10vw] font-black uppercase tracking-tighter leading-none"
                  style={{ color: selectedProject.color }}
                >
                  {selectedProject.title}
                </motion.h3>
                <motion.p 
                  layoutId={`category-${selectedProject.id}`}
                  className="text-2xl sm:text-4xl mt-4 font-mono opacity-60"
                >
                  {selectedProject.category}
                </motion.p>
              </div>
              
              <motion.div layoutId={`year-${selectedProject.id}`} className="text-4xl font-bold">
                {selectedProject.year}
              </motion.div>
            </div>

            {/* Content inside expanded view */}
            <motion.div 
              className="p-8 sm:p-16 max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h4 className="text-3xl font-bold mb-4">About the Project</h4>
              <p className="text-2xl opacity-80 leading-relaxed font-serif">
                {selectedProject.description}
              </p>
              
              <button 
                className="mt-16 px-8 py-4 border border-white rounded-full text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                onClick={() => setSelectedProject(null)}
                data-cursor="hover"
              >
                Close Project
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
