import { gsap, prefersReducedMotion, setScrollLocked } from './smoothScroll';

// First-visit preloader. The markup and its first frame (dark screen, crest
// glowing in) live in index.html so they paint before this bundle arrives;
// this module plays the rest: a bright line splits the screen and the crest,
// and the two panels part, each carrying half the crest away.
// Home's hero listens for 'reveal' to start its spark intro through the opening.

type Phase = 'reveal' | 'done';

const KEY = 'pheonix-intro';
const MIN_GLOW = 0.9; // seconds the crest glows before the split, if the site is ready sooner
const MAX_WAIT = 3; // never hold the site back longer than this for slow assets

const el = typeof document !== 'undefined' ? document.getElementById('preloader') : null;
const active = !!el && !document.documentElement.classList.contains('pl-seen');

const reached: Record<Phase, boolean> = { reveal: !active, done: !active };
const listeners: Record<Phase, Set<() => void>> = { reveal: new Set(), done: new Set() };

/** Runs `cb` once the preloader reaches `phase` (at once if it already has, or never ran). */
export function onPreloader(phase: Phase, cb: () => void) {
  if (reached[phase]) {
    cb();
    return () => {};
  }
  listeners[phase].add(cb);
  return () => {
    listeners[phase].delete(cb);
  };
}

function fire(phase: Phase) {
  reached[phase] = true;
  listeners[phase].forEach((cb) => cb());
  listeners[phase].clear();
}

function finish() {
  if (!reached.reveal) fire('reveal');
  fire('done');
  el?.remove();
  document.documentElement.classList.add('pl-seen');
  setScrollLocked(false, 'preloader');
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    // private mode: the intro just plays again next load
  }
}

const imageReady = (img: HTMLImageElement | null) =>
  new Promise<void>((resolve) => {
    if (!img || img.complete) return resolve();
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

async function run(root: HTMLElement) {
  setScrollLocked(true, 'preloader');
  root.style.animation = 'none'; // the script owns it now; drop the no-JS failsafe

  const crest = root.querySelector<HTMLElement>('.pl-crest')!;
  const glow = root.querySelector<HTMLElement>('.pl-glow')!;
  const line = root.querySelector<HTMLElement>('.pl-line')!;
  const [left, right] = root.querySelectorAll<HTMLElement>('.pl-panel');

  if (prefersReducedMotion) {
    await Promise.race([imageReady(crest.querySelector('img')), new Promise((r) => setTimeout(r, 800))]);
    gsap.to(root, { opacity: 0, duration: 0.4, delay: 0.3, ease: 'power1.out', onComplete: finish });
    return;
  }

  // Wait for the crest, the fonts and the first React paint, but cap it.
  const ready = Promise.all([
    imageReady(crest.querySelector('img')),
    document.fonts?.ready ?? Promise.resolve(),
    nextFrame(),
  ]);
  await Promise.race([ready, new Promise((r) => setTimeout(r, MAX_WAIT * 1000))]);
  const waited = performance.now() / 1000;
  if (waited < MIN_GLOW) await new Promise((r) => setTimeout(r, (MIN_GLOW - waited) * 1000));
  await nextFrame();

  // Freeze the crest's CSS entrance where it is so GSAP can take over.
  const shown = getComputedStyle(crest).opacity;
  crest.style.animation = 'none';
  gsap.set(crest, { opacity: shown });

  const [halfL, halfR] = root.querySelectorAll<HTMLElement>('.pl-half');
  // Each half travels with its panel, so it rides the panel's inner edge off screen.
  const travel = () => window.innerWidth * 0.505 * 1.01;

  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish });

  tl.to(crest, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0)
    // 1. The split: a hot line draws through the crest, top and bottom at once.
    .to(line, { scaleY: 1, duration: 0.6, ease: 'expo.inOut' }, 0)
    .to(glow, { scale: 1.25, duration: 0.6, ease: 'power2.out' }, 0.25)
    // 2. The panels part from the line, each carrying half the crest.
    .add(() => root.classList.add('is-open'), 0.55)
    .to(left, { xPercent: -101, duration: 1.3 }, 0.55)
    .to(right, { xPercent: 101, duration: 1.3 }, 0.55)
    .to(halfL, { x: () => -travel(), duration: 1.3 }, 0.55)
    .to(halfR, { x: () => travel(), duration: 1.3 }, 0.55)
    .to(line, { opacity: 0, scaleX: 6, duration: 0.45, ease: 'power2.out' }, 0.6)
    .to(glow, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.6)
    // 3. Home's hero starts forming its own crest from sparks through the opening.
    .add(() => fire('reveal'), 0.7);

  // A tap or key press hurries it along for anyone in a rush.
  const hurry = () => tl.timeScale(3);
  root.addEventListener('pointerdown', hurry, { once: true });
  window.addEventListener('keydown', hurry, { once: true });
}

if (active && el) run(el);
