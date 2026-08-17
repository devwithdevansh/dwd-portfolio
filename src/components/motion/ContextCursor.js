import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function ContextCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // 'default', 'link', 'text', 'image'
  const [cursorText, setCursorText] = useState('');
  const [cursorImage, setCursorImage] = useState(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
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
      const linkTarget = e.target.closest('a, button');

      if (target) {
        const state = target.getAttribute('data-cursor');
        const text = target.getAttribute('data-cursor-text') || '';
        const img = target.getAttribute('data-cursor-image');

        if (img) {
          setCursorState('image');
          setCursorImage(img);
        } else {
          setCursorState(state || 'default');
          setCursorText(text);
          setCursorImage(null);
        }
      } else if (linkTarget) {
        setCursorState('link');
        setCursorText('');
        setCursorImage(null);
      } else {
        setCursorState('default');
        setCursorText('');
        setCursorImage(null);
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
      width: 12,
      height: 12,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      mixBlendMode: 'difference',
      border: '0px solid transparent'
    },
    link: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      mixBlendMode: 'difference',
      border: '1px solid rgba(255, 255, 255, 1)'
    },
    text: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      mixBlendMode: 'difference',
      border: '0px solid transparent'
    },
    image: {
      width: 300,
      height: 200,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      mixBlendMode: 'normal',
      border: '0px solid transparent',
      borderRadius: '8px'
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
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center font-bold text-xs uppercase tracking-widest hidden md:flex overflow-hidden"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        variants={variants}
        animate={cursorState}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Text Layer */}
        {cursorState !== 'image' && (
          <span className={`transition-opacity duration-200 pointer-events-none text-black ${cursorText ? 'opacity-100' : 'opacity-0'}`}>
            {cursorText}
          </span>
        )}

        {/* Image Layer */}
        {cursorState === 'image' && cursorImage && (
          <motion.img
            src={cursorImage}
            alt="Preview"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full object-cover pointer-events-none"
          />
        )}
      </motion.div>
    </>
  );
}
