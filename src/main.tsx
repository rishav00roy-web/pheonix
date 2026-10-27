import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Latin and Latin Extended only (the ₹ sign lives in Extended); the Vietnamese
// and maths subsets the full imports pulled in are never used
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-ext-400.css';
import '@fontsource/archivo/latin-500.css';
import '@fontsource/archivo/latin-ext-500.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo/latin-ext-600.css';
import '@fontsource/bodoni-moda/latin-400.css';
import '@fontsource/bodoni-moda/latin-ext-400.css';
import '@fontsource/bodoni-moda/latin-400-italic.css';
import '@fontsource/bodoni-moda/latin-ext-400-italic.css';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-ext-400.css';
import '@fontsource/space-mono/latin-700.css';
import '@fontsource/space-mono/latin-ext-700.css';
import './index.css';
// Starts the global Lenis smooth-scroll loop (see lib/smoothScroll.ts)
import './lib/smoothScroll';
// Plays the first-visit preloader painted by index.html
import './lib/preloader';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
