import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// One scroll system for the whole site: Lenis smooths the wheel, GSAP's
// ticker drives Lenis, and every Lenis scroll updates ScrollTrigger.
// Flip registers itself in the Shop, the only page that uses it.
gsap.registerPlugin(ScrollTrigger, useGSAP);

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reduced motion: native scrolling only, no Lenis
const lenis: Lenis | null = prefersReducedMotion
  ? null
  : new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false, // keep native momentum scrolling on phones
      autoRaf: false, // GSAP's ticker owns the frame loop
    });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// The browser must not restore old scroll positions under a pinned page
if (typeof history !== 'undefined' && 'scrollRestoration' in history) history.scrollRestoration = 'manual';

/** Media query that scroll-driven (scrub / pin) animations live under. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

// Expo ease-out for programmatic glides
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Glide to an element id, an element, a pixel offset, or the top of the page. */
export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (lenis) {
    lenis.scrollTo(el ?? 0, { offset, duration: 1.2, easing: easeOutExpo });
    return;
  }
  if (typeof el === 'number') {
    window.scrollTo({ top: el + offset });
  } else if (el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  }
}

/** Jump to the top with no glide (route changes). */
export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

// Images settle the page height after first paint: re-measure every trigger
// once a burst of image loads has finished.
let refreshTimer: ReturnType<typeof setTimeout> | undefined;
export function queueRefresh(delay = 120) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), delay);
}
if (typeof document !== 'undefined') {
  document.addEventListener(
    'load',
    (e) => {
      if (e.target instanceof HTMLImageElement) queueRefresh(200);
    },
    true
  );
}

// Each overlay holds its own lock, so two overlays never release each other
const locks = new Set<string>();

/** Freeze page scroll while an overlay (sheet / drawer) is open. */
export function setScrollLocked(locked: boolean, key = 'overlay') {
  if (locked) locks.add(key);
  else locks.delete(key);
  const frozen = locks.size > 0;
  if (!lenis) {
    document.documentElement.style.overflow = frozen ? 'hidden' : '';
    return;
  }
  if (frozen) lenis.stop();
  else lenis.start();
}

export { gsap, ScrollTrigger, useGSAP };
