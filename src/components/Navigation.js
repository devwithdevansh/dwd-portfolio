import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'SERVICES', path: '/services' },
  { name: 'WORK', path: '/work' },
  { name: 'ABOUT', path: '/about' },
  { name: 'CONTACT', path: '/contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close menu on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Brutalist Hamburger Button */}
      <button 
        onClick={toggleMenu}
        className="fixed top-8 right-8 z-[100] w-16 h-16 rounded-full mix-blend-difference border border-white flex flex-col items-center justify-center space-y-1.5 overflow-hidden group"
        data-cursor="hover"
      >
        <span className={`block w-8 h-[2px] bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
        <span className={`block w-8 h-[2px] bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`block w-8 h-[2px] bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
      </button>

      {/* Full-Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%', transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-center px-8 sm:px-24 border-b border-gray-800"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, i) => (
                <div key={link.name} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%', transition: { delay: 0 } }}
                    transition={{ delay: 0.3 + (i * 0.1), duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <Link 
                      to={link.path}
                      className="text-[12vw] sm:text-[8vw] font-black uppercase tracking-tighter leading-none hover:text-[#EAB308] transition-colors relative group block w-max"
                      data-cursor="hover"
                    >
                      {link.name}
                      {/* Strikethrough effect on hover */}
                      <span className="absolute top-1/2 left-0 w-0 h-2 bg-[#EAB308] group-hover:w-full transition-all duration-500 ease-out" />
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Footer inside menu */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 left-8 sm:left-24 right-8 flex justify-between font-mono text-sm opacity-50 uppercase tracking-widest"
            >
              <span>devwithdevansh@gmail.com</span>
              <span>+91 9687629341</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
