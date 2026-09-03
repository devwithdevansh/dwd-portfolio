import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import UnderConstruction from './components/UnderConstruction';
import './index.css';

function App() {
  return (
    <HelmetProvider>
      <UnderConstruction />
    </HelmetProvider>
  );
}

export default App;
