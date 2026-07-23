import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function SvgMaskText({ textTop, textBottom }) {
  // Motion values for parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the movement
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Map motion values to slight translations
  const xOffset = useTransform(springX, [-1, 1], [-20, 20]);
  const yOffset = useTransform(springY, [-1, 1], [-20, 20]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      
      // Mobile Device Orientation WOW Factor
      const handleOrientation = (e) => {
        // e.gamma is left/right tilt (-90 to 90)
        // e.beta is front/back tilt (-180 to 180)
        // Normalize values approximately to -1 to 1
        const gamma = Math.min(Math.max(e.gamma / 45, -1), 1);
        const beta = Math.min(Math.max((e.beta - 45) / 45, -1), 1);
        
        x.set(gamma);
        y.set(beta);
      };

      // Request permission for iOS 13+ devices
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Permission must be requested via user gesture usually, but we try binding it
        // A dedicated "Start Experience" button is often used for this on Awwwards sites
        window.addEventListener('deviceorientation', handleOrientation);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }

      return () => window.removeEventListener('deviceorientation', handleOrientation);
    } else {
      // Desktop Mouse Parallax
      const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        // Normalize to -1 to 1 based on screen center
        const nx = (e.clientX / innerWidth) * 2 - 1;
        const ny = (e.clientY / innerHeight) * 2 - 1;
        
        x.set(nx);
        y.set(ny);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [x, y]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center z-10 pointer-events-none">
      <motion.div 
        style={{ x: xOffset, y: yOffset }}
        className="text-center"
      >
        <h1 className="text-[12vw] sm:text-[15vw] font-black tracking-tighter leading-[0.8] uppercase text-[#2C1E16] dark:text-[#F3F4F6] transition-colors duration-1000 drop-shadow-2xl">
          {textTop}
        </h1>
        <h1 className="text-[12vw] sm:text-[15vw] font-black tracking-tighter leading-[0.8] uppercase text-[#2C1E16] dark:text-transparent dark:[-webkit-text-stroke:4px_#EAB308] transition-colors duration-1000 drop-shadow-2xl">
          {textBottom}
        </h1>
      </motion.div>
    </div>
  );
}
