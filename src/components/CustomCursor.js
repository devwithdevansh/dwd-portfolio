import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorState, setCursorState] = useState('default');
  const [cursorText, setCursorText] = useState('');

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if the device has a fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setCursorState(target.getAttribute('data-cursor'));
        setCursorText(target.getAttribute('data-cursor-text') || '');
      } else if (e.target.closest('a') || e.target.closest('button')) {
        setCursorState('button');
        setCursorText('');
      } else {
        setCursorState('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

  const variants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: "rgba(255, 255, 255, 1)",
      mixBlendMode: "difference",
      scale: 1,
      border: "0px solid transparent"
    },
    button: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(255, 255, 255, 0)",
      mixBlendMode: "difference",
      scale: 1,
      border: "1px solid rgba(255, 255, 255, 1)"
    },
    hero: {
      width: 100,
      height: 100,
      backgroundColor: "rgba(255, 255, 255, 1)",
      mixBlendMode: "difference",
      scale: 1,
      border: "0px solid transparent"
    },
    trap: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(239, 68, 68, 0.8)", // red-500
      mixBlendMode: "normal",
      scale: 1,
      border: "0px solid transparent"
    },
    engine: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(59, 130, 246, 0.8)", // blue-500
      mixBlendMode: "normal",
      scale: 1,
      border: "0px solid transparent"
    }
  };

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          body, a, button, [data-cursor] {
            cursor: none !important;
          }
        }
      `}</style>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center font-bold text-[12px] uppercase tracking-widest hidden md:flex"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={variants}
        animate={cursorState}
        transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
      >
        <span className={`transition-opacity duration-300 pointer-events-none ${cursorText ? 'opacity-100' : 'opacity-0'} ${cursorState === 'hero' ? 'text-black mix-blend-normal' : 'text-white'}`}>
          {cursorText}
        </span>
      </motion.div>
    </>
  );
}
