import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }) {
  // Lenis configuration for that heavy, buttery smooth momentum feel
  const lenisOptions = {
    lerp: 0.05, // Lower = smoother but slower to catch up
    duration: 1.5,
    smoothWheel: true,
    smoothTouch: false, // Don't hijack native touch scrolling for better mobile UX!
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
