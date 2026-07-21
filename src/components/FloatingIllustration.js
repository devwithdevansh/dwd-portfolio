import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function FloatingIllustration({ src, alt }) {
  const containerRef = useRef(null);

  // Track mouse coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth the mouse movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Map mouse coordinates to rotation
  // Max rotation is 15 degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Map mouse coordinates to lighting translation (glare effect)
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the container
    // Range will be from -0.5 to 0.5
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] hidden sm:block pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Layer 1: Deep shadow / glowing aura */}
        <motion.div 
          className="absolute inset-0"
          style={{ transform: "translateZ(-60px)" }}
        >
          <img 
            src={src} 
            alt="shadow" 
            className="w-full h-full object-contain filter blur-[20px] opacity-70 scale-95 brightness-[0.2] sepia hue-rotate-[180deg] saturate-200" 
          />
        </motion.div>

        {/* Layer 2: The actual high-res transparent image */}
        <motion.div 
          className="absolute inset-0"
          style={{ transform: "translateZ(40px)" }}
        >
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] contrast-110" 
          />
        </motion.div>

        {/* Layer 3: Dynamic Glare / Lighting reflection */}
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-full mix-blend-screen opacity-50"
          style={{
            transform: "translateZ(60px)",
            background: "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
            x: glareX,
            y: glareY
          }}
        />

        {/* Layer 4: Abstract brutalist UI overlay floating in front */}
        <motion.div
          className="absolute bottom-8 -right-4 flex flex-col gap-1 pointer-events-none"
          style={{ transform: "translateZ(80px)" }}
        >
          <div className="w-16 h-[2px] bg-cyan-400 opacity-80 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <div className="w-8 h-[2px] bg-cyan-400 opacity-80 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] mt-1 opacity-90 drop-shadow-md">
            Holographic Render
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
