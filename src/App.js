import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';

import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { TranslationProvider } from './context/TranslationContext';
import { ThemeProvider } from './context/ThemeContext';

// Initialize Google Analytics (User will replace this ID with their actual GA4 Measurement ID)
ReactGA.initialize('G-XXXXXXXXXX');

// Lazy Load Pages for massive performance boost
const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Industry = lazy(() => import('./pages/Industry'));
const CityLanding = lazy(() => import('./pages/CityLanding'));
const EducationERP = lazy(() => import('./pages/EducationERP'));
const JewelryERP = lazy(() => import('./pages/JewelryERP'));

// Wrapper for AnimatePresence to work with Router
function AnimatedRoutes() {
  const location = useLocation();
  
  // Track pageviews on route change
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center font-mono text-white text-sm tracking-widest uppercase">Initializing Secure Connection...</div>}>
        <Routes location={location} key={location.pathname}>
        {/* Default Route */}
        <Route path="/" element={<Home />} />
        
        {/* Core Agency Pages */}
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Programmatic SEO & Industry Routes */}
        <Route path="/location/:location" element={<CityLanding />} />
        <Route path="/industry/:industry" element={<Industry />} />
        <Route path="/location/:location/industry/:industry" element={<Industry />} />

        {/* Niche Microsites */}
        <Route path="/education-erp" element={<EducationERP />} />
        <Route path="/jewelry-erp" element={<JewelryERP />} />
      </Routes>
    </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <TranslationProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <AnimatedRoutes />
            </Layout>
          </Router>
        </TranslationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
