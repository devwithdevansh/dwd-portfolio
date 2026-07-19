import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if the device has a fine pointer (mouse) vs coarse (touchscreen)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Add global event listeners for mouse move
    window.addEventListener('mousemove', updateMousePosition);

    // Add listeners to all interactive elements to trigger hover states
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
    
    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseOver);
      el.addEventListener('mouseleave', handleMouseOut);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseOver);
        el.removeEventListener('mouseleave', handleMouseOut);
      });
    };
  }, [mouseX, mouseY]);

  // If it's a touch device, don't render the custom cursor at all
  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovering ? 2.5 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
}
