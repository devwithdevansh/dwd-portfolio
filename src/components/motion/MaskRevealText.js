import React from 'react';
import { motion } from 'framer-motion';

export default function MaskRevealText({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
  as: Component = "span"
}) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay }
    })
  };

  const child = {
    hidden: {
      y: "110%",
      rotateZ: 5
    },
    visible: {
      y: "0%",
      rotateZ: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 200,
        mass: 1
      }
    }
  };

  return (
    <Component
      className={`inline-flex flex-wrap ${className}`}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="flex flex-wrap gap-[0.25em]"
      >
        {words.map((word, index) => (
          <span key={index} className="overflow-hidden inline-block leading-[1.1] pb-1">
            <motion.span
              variants={child}
              className="inline-block origin-bottom-left"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </Component>
  );
}
