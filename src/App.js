import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import { TranslationProvider } from './context/TranslationContext';

// Wrapper for AnimatePresence to work with Router
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Default Route */}
        <Route path="/" element={<Home />} />
        
        {/* Core Agency Pages */}
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Programmatic SEO Routes */}
        <Route path="/location/:location" element={<Home />} />
        <Route path="/industry/:industry" element={<Home />} />
        <Route path="/location/:location/industry/:industry" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <TranslationProvider>
      <Router>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </TranslationProvider>
  );
}

export default App;
