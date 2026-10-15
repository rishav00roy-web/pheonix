import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Compass } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from 'motion/react';
import { soundManager } from '../utils/audio';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

const RUNWAY_LOOKS = [
  {
    id: 'look-1',
    code: 'LOOK 01',
    title: 'THE VORTEX TRENCH',
    subtitle: 'Sculptural Asymmetric Memory Gabardine',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=95',
    details: 'Heavyweight 450gsm memory gabardine with accordion wingback pleating.'
  },
  {
    id: 'look-2',
    code: 'LOOK 02',
    title: 'VERTEBRAL MOTO',
    subtitle: 'High-Frequency Heat-Molded Calfskin',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=95',
    details: 'Anatomical spine relief running from funnel collar to lumbar hem.'
  },
  {
    id: 'look-3',
    code: 'LOOK 03',
    title: 'ASH REBIRTH KNIT',
    subtitle: 'Open-Weave Distressed Superkid Mohair',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=95',
    details: 'Hand-loomed open spider-web structure evoking plumage rising from cooling embers.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All (14)' },
  { id: 'outerwear', label: 'Outerwear (3)' },
  { id: 'tops', label: 'Knits & Tops (3)' },
  { id: 'dresses', label: 'Column Dresses (2)' },
  { id: 'trousers', label: 'Trousers (2)' },
  { id: 'footwear', label: 'Footwear (2)' },
  { id: 'accessories', label: 'Accessories (2)' }
];

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onSelectCategory,
  selectedCategory
}) => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const currentLook = RUNWAY_LOOKS[activeLookIndex];
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-driven Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const yBg = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '28%']);
  const scaleBg = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 1.15]);
  const yTitle = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '-38%']);
  const opacityTitle = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const yContent = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['0%', '-18%']);
  const opacityContent = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Cursor Reactive Micro-Parallax (Desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 25 });

  const bgShiftX = useTransform(smoothX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-16, 16]);
  const bgShiftY = useTransform(smoothY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-16, 16]);
  const titleShiftX = useTransform(smoothX, [-0.5, 0.5], reduceMotion ? [0, 0] : [12, -12]);
  const titleShiftY = useTransform(smoothY, [-0.5, 0.5], reduceMotion ? [0, 0] : [8, -8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto-cycle through runway looks slowly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLookIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[100svh] w-full flex flex-col justify-between px-4 sm:px-12 pt-20 sm:pt-24 pb-4 sm:pb-6 overflow-hidden border-b border-white/[0.08] bg-void"
    >
      {/* Background Editorial Visual with Smooth Crossfade & Parallax Multi-Plane */}
      <motion.div
        style={{ y: yBg, scale: scaleBg, x: bgShiftX }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        {RUNWAY_LOOKS.map((look, idx) => (
          <img
            key={look.id}
            src={look.image}
            alt={look.title}
            className={`absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.34] contrast-125 transition-opacity duration-1000 ease-in-out pointer-events-none ${
              activeLookIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}

        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black pointer-events-none" />
        <motion.div
          style={{ y: bgShiftY }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[380px] sm:w-[720px] h-[380px] sm:h-[720px] bg-ember-600/10 blur-[160px] pointer-events-none"
        />
      </motion.div>

      {/* Top Technical Metadata Header (Symmetrical, Dead-Centered Look Switcher) */}
      <div className="grid grid-cols-3 items-center text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase z-10 w-full max-w-6xl mx-auto px-2">
        <div className="flex items-center gap-2 justify-start">
          <span className="w-1.5 h-1.5 bg-ember-500 animate-pulse" />
          <span className="text-white font-bold tracking-widest hidden sm:inline">ATELIER PHEONIX</span>
          <span className="text-white font-bold tracking-widest sm:hidden">ATELIER</span>
        </div>

        {/* Centered Look Switcher Indicators */}
        <div className="flex items-center justify-center gap-2">
          {RUNWAY_LOOKS.map((look, idx) => (
            <button
              key={look.id}
              onClick={() => {
                soundManager.playClick();
                setActiveLookIndex(idx);
              }}
              className={`transition-all h-[2px] ${
                activeLookIndex === idx
                  ? 'w-8 bg-white'
                  : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
              title={look.title}
            />
          ))}
        </div>

        <div className="font-mono text-[9px] sm:text-[10px] text-zinc-400 text-right">
          <span className="text-white font-bold">{currentLook.code}</span>
          <span className="text-zinc-600"> / 03</span>
        </div>
      </div>

      {/* Main Spacious Architectural Monolith (De-compacted with Parallax) */}
      <div className="my-auto z-10 w-full max-w-6xl mx-auto text-center py-8 sm:py-16 flex flex-col items-center justify-center space-y-6 sm:space-y-10">
        {/* Collection Kicker with Breathing Space */}
        <motion.div
          style={{ opacity: opacityTitle }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 border border-white/15 bg-black/60 backdrop-blur-md text-[9px] sm:text-[11px] font-mono tracking-[0.22em] sm:tracking-[0.35em] uppercase text-ember-400 select-none whitespace-nowrap"
        >
          <span>AUTUMN / WINTER 2026</span>
          <span className="text-zinc-600">•</span>
          <span>COLLECTION 01</span>
        </motion.div>

        {/* Monumental Headline with Deep Parallax & Compensated Letter-Spacing */}
        <motion.div
          style={{ y: yTitle, opacity: opacityTitle }}
          className="flex justify-center w-full will-change-transform overflow-hidden px-2"
        >
          <motion.h1
            style={{ x: titleShiftX, y: titleShiftY }}
            className="font-syne font-black text-[2.35rem] xs:text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8.5rem] uppercase text-white leading-none tracking-[0.16em] sm:tracking-[0.24em] pl-[0.16em] sm:pl-[0.24em] select-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
          >
            PHEONIX
          </motion.h1>
        </motion.div>

        {/* Editorial Telemetry & Subtitle (Spaced & Legible) */}
        <motion.div
          style={{ y: yContent, opacity: opacityContent }}
          className="space-y-3 sm:space-y-4 max-w-xl mx-auto px-4"
        >
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] sm:text-xs text-white uppercase tracking-[0.38em] font-bold">
              {currentLook.title}
            </p>
            <p className="font-mono text-[10px] sm:text-[11px] text-ember-400/90 uppercase tracking-[0.28em]">
              {currentLook.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed hidden sm:block">
            {currentLook.details}
          </p>
        </motion.div>

        {/* Commanding Centered CTA Button */}
        <motion.div
          style={{ y: yContent, opacity: opacityContent }}
          className="pt-2 sm:pt-4 flex items-center justify-center"
        >
          <button
            onClick={() => {
              soundManager.playClick();
              onExploreClick();
            }}
            className="px-8 sm:px-12 py-3.5 sm:py-4.5 border border-white bg-white text-black font-mono font-bold text-xs uppercase tracking-[0.28em] hover:bg-ember-500 hover:border-ember-500 hover:text-white transition-all shadow-2xl flex items-center gap-3 group"
          >
            <span>Explore Collection (14)</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-1" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Horizontal Category Bar - Centered on Desktop, Horizontally Scrollable on Mobile */}
      <div className="pb-2 sm:pb-4 z-10 w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2.5 py-2 px-2 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1 shrink-0 hidden sm:inline-flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-ember-400" /> WARDROBE:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectCategory(cat.id);
                  onExploreClick();
                }}
                className={`px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all border shrink-0 ${
                  isActive
                    ? 'border-white bg-white text-black font-bold shadow-md'
                    : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white hover:border-white/25'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

