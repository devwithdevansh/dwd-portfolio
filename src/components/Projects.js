import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import rajTourismImg from '../assets/projects/rajtourism.jpg';
import rajTradersImg from '../assets/projects/rajtraders.jpg';
import omStudyPointImg from '../assets/projects/omstudypoint.jpg';
import sunriseSchoolImg from '../assets/projects/sunriseschool.jpg';

const PROJECT_DATA = [
  {
    id: 'proj-1',
    title: 'Raj Tourism',
    category: 'Travel & Hospitality',
    year: '2026',
    color: '#EAB308',
    image: rajTourismImg,
    description: 'A dynamic, high-converting platform built for Raj Tourism, streamlining bookings and providing a stunning visual showcase of their travel packages.',
    problem: 'Manual booking processes and low online visibility were capping revenue.',
    solution: 'Built a completely bespoke booking engine with automated WhatsApp notifications.',
    impact: '300% INCREASE IN ONLINE BOOKINGS within the first 6 months.'
  },
  {
    id: 'proj-2',
    title: 'Raj Traders',
    category: 'E-Commerce / B2B',
    year: '2025',
    color: '#06B6D4',
    image: rajTradersImg,
    description: 'A robust online marketplace and inventory system crafted for Raj Traders, automating their B2B sales pipeline.',
    problem: 'Inventory was tracked on paper, leading to lost sales and miscommunications.',
    solution: 'A custom Next.js e-commerce portal integrated seamlessly with their local ERP.',
    impact: '₹1.2CR GROSS MERCHANDISE VALUE processed in Q1.'
  },
  {
    id: 'proj-3',
    title: 'Om Study Point',
    category: 'EdTech / Education',
    year: '2025',
    color: '#A855F7',
    image: omStudyPointImg,
    description: 'A complete digital transformation for an educational institute, providing seamless student portals and learning resources.',
    problem: 'Students struggled to access materials during remote learning periods.',
    solution: 'A brutalist, ultra-fast student portal with integrated video hosting and quizzes.',
    impact: '98% STUDENT ENGAGEMENT RATE across 5,000+ active users.'
  },
  {
    id: 'proj-4',
    title: 'Sunrise School',
    category: 'Education Platform',
    year: '2025',
    color: '#10B981',
    image: sunriseSchoolImg,
    description: 'An expansive school management frontend and branding overhaul for Sunrise School Rajkot.',
    problem: 'The legacy website was unresponsive and damaged the school\'s premium reputation.',
    solution: 'A completely redesigned architecture focusing on trust and instant information access.',
    impact: '45% INCREASE IN ADMISSION INQUIRIES.'
  },
  {
    id: 'proj-5',
    title: 'School Pay App',
    category: 'Fintech / SaaS',
    year: '2024',
    color: '#F43F5E',
    image: null,
    description: 'A bespoke Payment Fees System integrated into a School Portal, paired with a custom Payments App for parents.',
    problem: 'Fee collection was slow and heavily reliant on manual cash handling.',
    solution: 'A custom React Native app that allows one-tap UPI fee payments.',
    impact: 'ZERO LATE FEES recorded after launch.'
  },
  {
    id: 'proj-6',
    title: 'Workflow Engine',
    category: 'Enterprise Automation',
    year: '2024',
    color: '#3B82F6',
    image: null,
    description: 'Intelligent automation workflows built via Make.com. Connecting CRMs, payment gateways, and email marketing.',
    problem: 'Client was wasting 40 hours a week manually copy-pasting data across platforms.',
    solution: 'Deployed a Make.com architecture that connects 12 different SaaS tools instantly.',
    impact: 'SAVED 2,000+ HOURS OF MANUAL LABOR.'
  },
];

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section 
      className="relative w-full min-h-screen bg-transparent dark:bg-[#050505] text-slate-900 dark:text-[#F3F4F6] py-32 z-20 border-t border-slate-200/50 dark:border-gray-800 transition-colors duration-1000"
      onMouseMove={handleMouseMove}
    >
      
      {/* Follow-Cursor Hover Image */}
      <AnimatePresence>
        {hoveredProject && hoveredProject.image && !selectedProject && (
          <motion.img
            src={hoveredProject.image}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              x: mousePos.x - 200, 
              y: mousePos.y - 200,
            }}
            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed top-0 left-0 w-[400px] h-[300px] object-cover pointer-events-none z-50 mix-blend-screen opacity-50 filter grayscale contrast-125"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-16 opacity-50 border-b border-gray-800 pb-4">
          Selected Works
        </h2>

        <div className="flex flex-col border-t border-gray-800">
          {PROJECT_DATA.map((project, index) => {
            const isHovered = hoveredProject?.id === project.id;

            return (
              <motion.div
                key={project.id}
                layoutId={`container-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="group flex flex-col sm:flex-row justify-between items-start sm:items-center py-12 border-b border-gray-800 cursor-pointer relative overflow-hidden"
                onHoverStart={() => setHoveredProject(project)}
                onHoverEnd={() => setHoveredProject(null)}
                data-cursor="hover"
              >
                {/* Background fill on hover */}
                <motion.div
                  className="absolute inset-0 z-0 origin-bottom"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                  style={{ backgroundColor: project.color }}
                />
                
                <div className="relative z-10 flex flex-col pointer-events-none mix-blend-difference">
                  <span className="font-mono text-xs mb-4 opacity-70 tracking-widest uppercase">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1} — {project.category}
                  </span>
                  <motion.h3 
                    layoutId={`title-${project.id}`}
                    className="text-5xl sm:text-7xl font-black uppercase tracking-tighter"
                  >
                    {project.title}
                  </motion.h3>
                </div>

                <motion.div 
                  layoutId={`year-${project.id}`}
                  className="relative z-10 mt-4 sm:mt-0 text-2xl font-bold mix-blend-difference opacity-50"
                >
                  {project.year}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* The Morphing Full-Screen Overlay with Deep Content */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            layoutId={`container-${selectedProject.id}`}
            className="fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-[#F3F4F6] overflow-y-auto transition-colors duration-1000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {/* Massive Header inside the expanded view */}
            <div className="p-8 sm:p-16 border-b border-slate-200 dark:border-gray-800 flex justify-between items-start" style={{ backgroundColor: selectedProject.color }}>
              <div className="flex flex-col mix-blend-difference">
                <motion.h3 
                  layoutId={`title-${selectedProject.id}`}
                  className="text-6xl sm:text-[10vw] font-black uppercase tracking-tighter leading-none"
                >
                  {selectedProject.title}
                </motion.h3>
                <p className="text-2xl sm:text-4xl mt-4 font-mono opacity-60">
                  {selectedProject.category}
                </p>
              </div>
              
              <motion.div layoutId={`year-${selectedProject.id}`} className="text-4xl font-bold mix-blend-difference">
                {selectedProject.year}
              </motion.div>
            </div>

            {/* Deep Content inside expanded view */}
            <motion.div 
              className="p-8 sm:p-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div>
                <p className="text-2xl opacity-80 leading-relaxed font-mono mb-16">
                  {selectedProject.description}
                </p>
                
                <h4 className="font-mono opacity-50 uppercase tracking-widest text-sm mb-4">The Challenge</h4>
                <p className="text-2xl leading-relaxed mb-16">{selectedProject.problem}</p>
                
                <h4 className="font-mono opacity-50 uppercase tracking-widest text-sm mb-4">The Solution</h4>
                <p className="text-2xl leading-relaxed">{selectedProject.solution}</p>
              </div>
              
              <div className="flex flex-col justify-center border border-slate-200 dark:border-gray-800 p-12">
                <h4 className="font-mono opacity-50 uppercase tracking-widest text-sm mb-4">The Impact</h4>
                <p className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none" style={{ color: selectedProject.color }}>
                  {selectedProject.impact}
                </p>
              </div>
            </motion.div>
            
            <div className="flex justify-center pb-32 pt-16">
              <button 
                className="px-12 py-6 border border-slate-900 dark:border-white rounded-full text-xl font-bold uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                onClick={() => setSelectedProject(null)}
                data-cursor="hover"
              >
                Close Case Study
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
