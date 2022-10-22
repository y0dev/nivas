'use strict';

import { createRoot } from 'react-dom/client';
import './index.css';
import NavBar from './components/navbar';
import Footer from './components/footer';
import Properties from './pages/properties';
// import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');
const reactRoot = createRoot(root);
reactRoot.render(
  <React.StrictMode>
      <NavBar />
      <Properties />
      <Footer />
   </React.StrictMode>
);
