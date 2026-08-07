import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy load the Spline component to prevent it from blocking initial page load
const Spline = React.lazy(() => import('@splinetool/react-spline'));

const SplineBackground = () => {
  return (
    <motion.div 
      className="fixed inset-0 w-full h-full z-[-1] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <Suspense fallback={<div className="w-full h-full bg-[#0a0a0a]" />}>
        {/* We enable pointer-events so users can interact with the 3D scene (orbit, hover) */}
        <div className="w-full h-full pointer-events-auto">
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>
      </Suspense>
    </motion.div>
  );
};

export default SplineBackground;
