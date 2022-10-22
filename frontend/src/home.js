'use strict';

// import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import NavBar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
// import reportWebVitals from './reportWebVitals';

const projectCont = document.getElementById('root');
const projectRoot = createRoot(projectCont);
projectRoot.render(
  <React.StrictMode>
      <NavBar />
      <Home />
      <Footer />
   </React.StrictMode>
);