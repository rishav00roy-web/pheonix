import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Compass } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { soundManager } from '../utils/audio';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

const RUNWAY_LOOKS = [
  {
    id: 'look-1',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'look-2',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=95',
  },
  {
    id: 'look-3',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=95',
  },
];

const CATEGORIES = [
  { id: 'all',         label: 'All (14)' },
  { id: 'outerwear',   label: 'Outerwear (3)' },
  { id: 'tops',        label: 'Knits & Tops (3)' },
  { id: 'dresses',     label: 'Column Dresses (2)' },
  { id: 'trousers',    label: 'Trousers (2)' },
  { id: 'footwear',    label: 'Footwear (2)' },
  { id: 'accessories', label: 'Accessories (2)' },
];

// Font size for PHEONIX wordmark.
// Single clamp works across all viewports in a side-by-side row:
// at 390px mobile: 12vw = ~47px — bold and readable in a half-width column.
// at 1400px desktop: 8vw = ~112px, capped at 9.5rem.
const SIZE_CLAMP   = 'clamp(2.4rem, 8vw, 9.5rem)';
// Logo height = 1.8× text for visual mass balance (wide-wing shape).
const LOGO_CLAMP   = 'clamp(4.32rem, 14.4vw, 17.1rem)';

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onSelectCategory,
  selectedCategory,
}) => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const yBg        = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '22%']);
  const scaleBg    = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1]       : [1, 1.08]);
  const yContent   = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '-18%']);
  const opacityTop = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useEffect(() => {
    const timer = setInterval(
      () => setActiveLookIndex(prev => (prev + 1) % RUNWAY_LOOKS.length),
      7000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative w-full overflow-hidden border-b border-white/[0.06] bg-void"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Background ────────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: yBg, scale: scaleBg }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        {RUNWAY_LOOKS.map((look, idx) => (
          <img
            key={look.id}
            src={look.image}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center
                        brightness-[0.28] contrast-125
                        transition-opacity duration-[1400ms] ease-in-out pointer-events-none
                        ${activeLookIndex === idx ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70 pointer-events-none" />
      </motion.div>

      {/* ── Full-height flex column layout ────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col"
        style={{ minHeight: '100svh' }}
      >
        {/* TOP: look switcher dots */}
        <div className="flex items-center justify-center gap-2.5 pt-8 sm:pt-12 pb-0 shrink-0">
          {RUNWAY_LOOKS.map((look, idx) => (
            <button
              key={look.id}
              onClick={() => { soundManager.playClick(); setActiveLookIndex(idx); }}
              aria-label={`Look ${idx + 1}`}
              className={`h-[2px] transition-all duration-300 rounded-full ${
                activeLookIndex === idx
                  ? 'w-10 bg-white'
                  : 'w-3 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* MIDDLE: grows to fill space, centers the split composition */}
        <motion.div
          style={{ y: yContent, opacity: opacityTop }}
          className="flex-1 flex items-center justify-center will-change-transform px-6 sm:px-10 lg:px-16 py-8"
        >
          {/*
            Always side-by-side on every viewport — no stacking.
            Both halves items-center so logo midline = text midline.
          */}
          <div className="flex flex-row items-center justify-center w-full max-w-6xl gap-0">

            {/* LEFT HALF — logo, 1.8× text height for visual mass balance */}
            <div className="flex-1 flex items-center justify-center pr-4 sm:pr-10 lg:pr-14">
              <img
                src="/brand-logo.png"
                alt="Pheonix"
                draggable={false}
                style={{ height: LOGO_CLAMP, width: 'auto' }}
                className="object-contain select-none pointer-events-none"
              />
            </div>

            {/* ── DIVIDER — ember diamond, visible on all viewports ─────── */}
            <div className="shrink-0 flex flex-col items-center justify-center self-stretch px-2 sm:px-4">
              <div className="flex-1 w-px bg-gradient-to-b from-transparent to-ember-500/40" />
              <div
                className="shrink-0 text-ember-500/70 font-mono select-none"
                style={{ fontSize: '14px', lineHeight: 1 }}
                aria-hidden="true"
              >◆</div>
              <div className="flex-1 w-px bg-gradient-to-t from-transparent to-ember-500/40" />
            </div>

            {/* RIGHT HALF — wordmark + tagline */}
            <div className="flex-1 flex items-center justify-center sm:justify-start pl-4 sm:pl-10 lg:pl-14">
              <div>
                <h1
                  className="font-nistha text-white select-none leading-none"
                  style={{ fontSize: SIZE_CLAMP, letterSpacing: '0.06em' }}
                >
                  PHEONIX
                </h1>
                {/* tagline */}
                <p
                  className="font-mono uppercase tracking-[0.10em] sm:tracking-[0.22em] text-zinc-400 mt-2 sm:mt-3"
                  style={{ fontSize: '11px' }}
                >
                  Bars from the hills.<br className="sm:hidden" /> Threads for the street.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* BOTTOM: CTA + category bar */}
        <motion.div
          style={{ opacity: opacityTop }}
          className="shrink-0 flex flex-col items-center gap-4 pb-5 sm:pb-6"
        >
          <button
            onClick={() => { soundManager.playClick(); onExploreClick(); }}
            className="px-8 sm:px-12 py-3.5 border border-white bg-white text-black
                       font-mono font-bold uppercase tracking-[0.24em] rounded-lg
                       hover:bg-ember-500 hover:border-ember-500 hover:text-white
                       transition-all duration-300 shadow-2xl flex items-center gap-3 group"
            style={{ fontSize: '13px' }}
          >
            <span>Explore Collection (14)</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-1" />
          </button>

          {/* Category bar */}
          <div className="w-full max-w-5xl px-4">
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 py-1">
              <span
                className="font-mono text-zinc-500 uppercase tracking-widest mr-1 shrink-0 hidden sm:inline-flex items-center gap-1.5"
                style={{ fontSize: '11px' }}
              >
                <Compass className="w-3 h-3 text-ember-400" /> WARDROBE:
              </span>
              {CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectCategory(cat.id);
                      onExploreClick();
                    }}
                    className={`px-3.5 py-1.5 font-mono uppercase tracking-wider
                                transition-all duration-200 border shrink-0 rounded-md ${
                      isActive
                        ? 'border-white bg-white text-black font-bold shadow-md'
                        : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white hover:border-white/25'
                    }`}
                    style={{ fontSize: '11px' }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
