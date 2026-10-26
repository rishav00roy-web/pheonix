import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LOGO_SRC = '/brand/logo.webp';
const WORD = 'PHEONIX';
const EMBER = [255, 120, 73] as const;

type Spark = {
  tx: number; ty: number;          // home position inside the crest
  sx: number; sy: number;          // where it rises from
  r: number; g: number; b: number; // colour sampled from the crest
  delay: number;                   // 0..0.45 share of the assemble timeline
  drift: number;                   // how far it flies on the scroll burst
  sway: number;
};

type Ember = { x: number; y: number; v: number; size: number; life: number; phase: number };

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Samples the crest's opaque pixels into spark targets laid over the crest image's box. */
function sampleCrest(img: HTMLImageElement, slot: DOMRect, host: DOMRect, budget: number): Spark[] {
  const w = Math.max(1, Math.round(slot.width));
  const h = Math.max(1, Math.round(slot.height));
  const step = Math.max(2, Math.round(Math.sqrt((w * h) / budget)));
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const ox = slot.left - host.left;
  const oy = slot.top - host.top;
  const sparks: Spark[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 140) continue;
      sparks.push({
        tx: ox + x,
        ty: oy + y,
        sx: ox + x + (Math.random() - 0.5) * w * 0.9,
        sy: host.height + Math.random() * host.height * 0.35,
        r: data[i], g: data[i + 1], b: data[i + 2],
        delay: Math.random() * 0.45,
        drift: 0.35 + Math.random() * 0.9,
        sway: (Math.random() - 0.5) * 2,
      });
    }
  }
  return sparks;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const host = root.current;
      if (!host) return;
      const canvas = host.querySelector<HTMLCanvasElement>('.hero-sparks');
      const crest = host.querySelector<HTMLImageElement>('.hero-crest img');
      const torch = host.querySelector<HTMLElement>('.hero-torch');
      const ctx = canvas?.getContext('2d');
      if (!canvas || !crest || !ctx) return;

      const reduced = prefersReducedMotion();
      const letters = host.querySelectorAll('.hero-word span');

      if (reduced) {
        host.classList.add('is-still');
        return;
      }

      // The pieces are visible by default; arming holds them back for the intro.
      host.classList.add('is-armed');
      gsap.set(letters, { yPercent: 115, opacity: 0 });
      gsap.set('.hero-tag', { y: 10 });

      // ── state shared by the draw loop ──────────────────────────────────
      const state = { assemble: 0, burst: 0 };
      let sparks: Spark[] = [];
      let embers: Ember[] = [];
      let width = 0;
      let height = 0;
      // The loop draws only while the hero is in view and the tab is showing.
      let inView = true;
      let tabShown = !document.hidden;
      let running = inView && tabShown;

      const seedEmbers = () => {
        const count = width < 640 ? 38 : 70;
        embers = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          v: 0.15 + Math.random() * 0.55,
          size: 0.6 + Math.random() * 1.6,
          life: Math.random(),
          phase: Math.random() * Math.PI * 2,
        }));
      };

      const layout = () => {
        const box = host.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = box.width;
        height = box.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sparks = sampleCrest(crest, crest.getBoundingClientRect(), box, width < 640 ? 2200 : 3600);
        if (torch) gsap.set(torch, { x: width / 2, y: height / 2 });
        seedEmbers();
      };

      const ease = (t: number) => 1 - Math.pow(1 - t, 3);

      const draw = () => {
        if (!running) return;
        ctx.clearRect(0, 0, width, height);

        // Rising embers, always on.
        for (const e of embers) {
          e.y -= e.v * (1 + state.burst * 3);
          e.x += Math.sin((e.y + e.phase * 60) / 70) * 0.25;
          e.life += 0.004;
          if (e.y < -10 || e.life > 1) {
            e.y = height + 10;
            e.x = Math.random() * width;
            e.life = 0;
          }
          const fade = Math.sin(e.life * Math.PI) * 0.75;
          ctx.fillStyle = `rgba(${EMBER[0]},${EMBER[1]},${EMBER[2]},${fade})`;
          ctx.fillRect(e.x, e.y, e.size, e.size);
        }

        // The crest's sparks: shown while forming and when bursting apart.
        const formed = state.assemble >= 1 && state.burst <= 0;
        if (!formed) {
          for (const s of sparks) {
            const local = Math.min(1, Math.max(0, (state.assemble - s.delay) / (1 - 0.45)));
            const k = ease(local);
            let x = s.sx + (s.tx - s.sx) * k;
            let y = s.sy + (s.ty - s.sy) * k;
            let alpha = Math.min(1, local * 1.4);
            if (state.burst > 0) {
              const b = state.burst;
              y -= b * height * 0.9 * s.drift;
              x += Math.sin(b * 6 + s.sway * 3) * 40 * b * s.sway;
              alpha = Math.max(0, 1 - b * 1.25);
            }
            if (alpha <= 0.01) continue;
            // Sparks arrive ember-hot and cool into the crest's own colours.
            const r = Math.round(EMBER[0] + (s.r - EMBER[0]) * k);
            const g = Math.round(EMBER[1] + (s.g - EMBER[1]) * k);
            const bl = Math.round(EMBER[2] + (s.b - EMBER[2]) * k);
            ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`;
            ctx.fillRect(x, y, 1.6, 1.6);
          }
        }
      };

      // Runs after the crest loads, so it must join the GSAP context to be cleaned up.
      const start = contextSafe!(() => {
        layout();
        gsap.ticker.add(draw);

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
          .to('.hero-rule', { scaleY: 1, scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, 0)
          .to('.hero-diamond', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(3)' }, 0.75)
          .to(state, { assemble: 1, duration: 2.6, ease: 'none' }, 0.2)
          .to(crest, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 2.55)
          .to(letters, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07 }, 1.1)
          .to('.hero-tag', { opacity: 1, y: 0, duration: 0.8 }, 1.9)
          .to('.hero-foot', { opacity: 1, duration: 0.8 }, 2.3)
          .add(() => host.classList.add('is-lit'), 3.2);

        // Scroll: the crest bursts back into embers and the word parts.
        gsap.timeline({
          scrollTrigger: {
            trigger: host,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            onToggle: (self) => {
              inView = self.isActive || self.progress < 1;
              running = inView && tabShown;
            },
          },
        })
          .to(crest, { opacity: 0, duration: 0.12, ease: 'none' }, 0)
          .to(state, { burst: 1, duration: 0.85, ease: 'none' }, 0)
          .to('.hero-word span', { yPercent: -60, opacity: 0, stagger: { each: 0.02, from: 'center' }, duration: 0.5 }, 0.05)
          .to('.hero-rule', { scaleY: 0, duration: 0.5 }, 0.05)
          .to(['.hero-tag', '.hero-foot'], { opacity: 0, duration: 0.3 }, 0);
      });

      // Pointer torchlight (desktop only).
      const fine = window.matchMedia('(pointer: fine)').matches;
      let onMove: ((e: PointerEvent) => void) | null = null;
      if (torch && fine) {
        const tx = gsap.quickTo(torch, 'x', { duration: 0.9, ease: 'power3' });
        const ty = gsap.quickTo(torch, 'y', { duration: 0.9, ease: 'power3' });
        onMove = (e) => {
          const box = host.getBoundingClientRect();
          tx(e.clientX - box.left);
          ty(e.clientY - box.top);
        };
        host.addEventListener('pointermove', onMove);
      }

      // Re-sample only when the width changes or the height changes a lot, so a
      // phone's address bar sliding in and out doesn't reset the embers.
      let resizeTimer = 0;
      let lastW = window.innerWidth;
      let lastH = window.innerHeight;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          if (w === lastW && Math.abs(h - lastH) < 120) return;
          lastW = w;
          lastH = h;
          layout();
        }, 150);
      };
      window.addEventListener('resize', onResize);
      const onVisibility = () => {
        tabShown = !document.hidden;
        running = inView && tabShown;
      };
      document.addEventListener('visibilitychange', onVisibility);

      // If the crest never loads, show everything in place rather than leave it held back.
      const fallback = () => {
        host.classList.remove('is-armed');
        host.classList.add('is-still');
        gsap.set([letters, '.hero-tag'], { clearProps: 'all' });
      };

      if (crest.complete && crest.naturalWidth) start();
      else if (crest.complete) fallback();
      else {
        crest.addEventListener('load', start, { once: true });
        crest.addEventListener('error', fallback, { once: true });
      }

      return () => {
        crest.removeEventListener('load', start);
        crest.removeEventListener('error', fallback);
        host.classList.remove('is-lit', 'is-armed');
        gsap.ticker.remove(draw);
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibility);
        if (onMove) host.removeEventListener('pointermove', onMove);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" aria-label="Pheonix">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-torch" aria-hidden="true" />
      <canvas className="hero-sparks" aria-hidden="true" />

      <div className="hero-stage">
        <div className="hero-crest">
          <span className="hero-crest-inner">
            <img src={LOGO_SRC} alt="Pheonix crest" width={951} height={565} fetchPriority="high" draggable={false} />
          </span>
        </div>

        <div className="hero-rule" aria-hidden="true">
          <span className="hero-diamond">◆</span>
        </div>

        <div className="hero-type">
          <h1 className="hero-word" aria-label={WORD}>
            {WORD.split('').map((ch, i) => (
              <span key={i} aria-hidden="true">{ch}</span>
            ))}
          </h1>
          <p className="hero-tag"><span>Bars from the hills.</span> <span>Threads for the street.</span></p>
        </div>
      </div>

      <div className="hero-foot">
        <p className="hero-coords">
          <span>26.75° N · 94.22° E</span>
          <span>Jorhat, Assam</span>
        </p>
        <p className="hero-cue" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </p>
      </div>
    </section>
  );
}
