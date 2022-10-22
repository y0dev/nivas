'use strict';

import { createRoot } from 'react-dom/client';
import './index.css';
import NavBar from './components/navbar';
import Footer from './components/footer';
import Contact from './pages/contact.js';

const articleCont = document.getElementById('root');
const articleRoot = createRoot(articleCont);
articleRoot.render(
   <React.StrictMode>
      <NavBar />
      <Contact />
      <Footer />
   </React.StrictMode>
);