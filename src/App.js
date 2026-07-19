import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Home />} />
          
          {/* Programmatic SEO Routes */}
          <Route path="/location/:location" element={<Home />} />
          <Route path="/industry/:industry" element={<Home />} />
          <Route path="/location/:location/industry/:industry" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
