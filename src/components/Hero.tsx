import React, { useState, useEffect } from 'react';
import { ArrowDown, Compass } from 'lucide-react';
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
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=90',
    details: 'Heavyweight 450gsm gabardine engineered with exaggerated wingback canopy pleats.'
  },
  {
    id: 'look-2',
    code: 'LOOK 02',
    title: 'VERTEBRAL MOTO',
    subtitle: 'High-Frequency Heat-Molded Calfskin',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=2000&q=90',
    details: 'Anatomical spine relief running from funnel collar to lumbar hem with dual Raccagni zips.'
  },
  {
    id: 'look-3',
    code: 'LOOK 03',
    title: 'ASH REBIRTH KNIT',
    subtitle: 'Open-Weave Distressed Superkid Mohair',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=90',
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

  // Auto-cycle through runway looks slowly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLookIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[94svh] sm:min-h-screen w-full flex flex-col justify-between p-4 sm:p-10 overflow-hidden border-b border-white/[0.08] bg-void">
      {/* Background Editorial Visual with smooth crossfade */}
      <div className="absolute inset-0 z-0">
        {RUNWAY_LOOKS.map((look, idx) => (
          <img
            key={look.id}
            src={look.image}
            alt={look.title}
            className={`absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.32] contrast-125 transition-opacity duration-1000 ease-in-out pointer-events-none ${
              activeLookIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}

        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/85 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[680px] h-[340px] sm:h-[680px] bg-ember-600/10 blur-[150px] pointer-events-none" />
      </div>

      {/* Top Technical Metadata Header (Symmetrical & Centered) */}
      <div className="pt-20 sm:pt-16 grid grid-cols-3 items-center text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase z-10 w-full max-w-6xl mx-auto">
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

      {/* Centerpiece: Clean, Imposing Brand Monolith (Dead-Centered, No Middle Logo) */}
      <div className="my-auto z-10 w-full max-w-4xl mx-auto text-center space-y-5 sm:space-y-6 pt-4">
        {/* Collection Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-white/15 bg-black/60 backdrop-blur-md text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-ember-400 mx-auto">
          <span>AUTUMN / WINTER 2026</span>
          <span className="text-zinc-600">•</span>
          <span>COLLECTION 01</span>
        </div>

        {/* Monumental Headline with Balanced Letter-Spacing */}
        <div className="flex justify-center w-full">
          <h1 className="font-syne font-black text-4xl sm:text-7xl md:text-8xl lg:text-9xl uppercase text-white leading-none tracking-[0.2em] sm:tracking-[0.3em] pl-[0.2em] sm:pl-[0.3em] select-none">
            PHEONIX
          </h1>
        </div>

        {/* Editorial Subtitle */}
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] sm:text-xs text-white uppercase tracking-[0.35em] font-bold">
            {currentLook.title}
          </p>
          <p className="font-mono text-[10px] sm:text-[11px] text-ember-400/90 uppercase tracking-[0.25em]">
            {currentLook.subtitle}
          </p>
        </div>

        {/* Silhouette Description */}
        <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-lg mx-auto leading-relaxed px-4">
          {currentLook.details}
        </p>

        {/* Centered CTA */}
        <div className="pt-2 flex items-center justify-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onExploreClick();
            }}
            className="px-8 sm:px-10 py-3.5 sm:py-4 border border-white bg-white text-black font-mono font-bold text-xs uppercase tracking-[0.25em] hover:bg-ember-500 hover:border-ember-500 hover:text-white transition-all shadow-2xl flex items-center gap-2.5 group"
          >
            <span>Explore Collection (14)</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Bottom Horizontal Category Bar - Fully Centered Across All Viewports */}
      <div className="pb-4 sm:pb-6 z-10 w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 py-2 px-2 text-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1 shrink-0 hidden sm:inline-flex items-center gap-1">
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
                className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all border shrink-0 ${
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
