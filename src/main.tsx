import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import './index.css';
import App from './App.tsx';

// Initialise Lenis for butter-smooth scroll
// Lenis patches the native scroll position so Framer Motion's
// useScroll / useTransform parallax hooks work out of the box.
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
  smoothWheel: true,
  touchMultiplier: 1.6,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
