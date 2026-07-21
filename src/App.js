import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Industry from './pages/Industry';
import { TranslationProvider } from './context/TranslationContext';
import { ThemeProvider } from './context/ThemeContext';

// Wrapper for AnimatePresence to work with Router
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence 
      mode="wait" 
      onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
    >
      <Routes location={location} key={location.pathname}>
        {/* Default Route */}
        <Route path="/" element={<Home />} />
        
        {/* Core Agency Pages */}
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Programmatic SEO & Industry Routes */}
        <Route path="/location/:location" element={<Home />} />
        <Route path="/industry/:industry" element={<Industry />} />
        <Route path="/location/:location/industry/:industry" element={<Industry />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <Router>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Router>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;
