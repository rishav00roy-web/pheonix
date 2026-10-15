import React, { useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Compass, ChevronRight, ChevronLeft } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeroProps {
  onExploreClick: () => void;
  onOpenFlagship: () => void;
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

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenFlagship,
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

  const handlePrevLook = () => {
    soundManager.playClick();
    setActiveLookIndex((prev) => (prev - 1 + RUNWAY_LOOKS.length) % RUNWAY_LOOKS.length);
  };

  const handleNextLook = () => {
    soundManager.playClick();
    setActiveLookIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
  };

  const categories = [
    { id: 'all', label: 'All (14)' },
    { id: 'outerwear', label: 'Outerwear (3)' },
    { id: 'tops', label: 'Knits & Tops (3)' },
    { id: 'dresses', label: 'Column Dresses (2)' },
    { id: 'trousers', label: 'Trousers (2)' },
    { id: 'footwear', label: 'Footwear (2)' },
    { id: 'accessories', label: 'Accessories (2)' }
  ];

  return (
    <section className="relative min-h-[94svh] sm:min-h-screen w-full flex flex-col justify-between p-5 sm:p-12 overflow-hidden border-b border-white/[0.08] bg-void">
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[680px] h-[340px] sm:h-[680px] bg-ember-600/10 blur-[150px] rounded-full pointer-events-none" />
      </div>

      {/* Top Technical Metadata Header */}
      <div className="pt-20 sm:pt-16 flex items-center justify-between text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase z-10 w-full">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
          <span className="text-white font-bold">ATELIER PHEONIX</span>
          <span className="text-zinc-600 hidden sm:inline">//</span>
          <span className="text-zinc-400 hidden sm:inline">AUTUMN / WINTER 2026</span>
        </div>

        {/* Minimalist Look Indicator Pill */}
        <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-zinc-400">
          <button
            onClick={handlePrevLook}
            className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Previous Look"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-white font-bold">{currentLook.code}</span>
          <span className="text-zinc-600">/ 03</span>
          <button
            onClick={handleNextLook}
            className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
            title="Next Look"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Centerpiece: Clean, Imposing Brand Monolith */}
      <div className="my-auto z-10 w-full max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 pt-4">
        {/* Official Cyber-Phoenix Crest */}
        <div className="relative inline-flex items-center justify-center mx-auto group">
          <div className="absolute inset-0 bg-ember-500/20 blur-2xl rounded-full scale-125 pointer-events-none" />
          <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full scale-150 pointer-events-none" />
          <img
            src="/brand-logo.png"
            alt="Pheonix Brand Crest"
            className="relative w-36 sm:w-52 md:w-64 h-auto mx-auto object-contain drop-shadow-[0_0_35px_rgba(249,115,22,0.45)] filter brightness-105 pointer-events-none transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Monolith Brand Typography */}
        <div className="space-y-2">
          <h1 className="font-syne font-black text-3xl sm:text-6xl md:text-8xl lg:text-9xl tracking-[0.14em] sm:tracking-[0.32em] uppercase text-white leading-none">
            PHEONIX
          </h1>
          <p className="font-mono text-[10px] sm:text-xs text-ember-400 uppercase tracking-[0.35em] font-semibold">
            {currentLook.title} — {currentLook.subtitle}
          </p>
        </div>

        {/* Look Description / Atelier Manifesto */}
        <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
          {currentLook.details}
        </p>

        {/* Primary Call to Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              onExploreClick();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-[0.2em] hover:bg-ember-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            <span>Explore Collection (14)</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenFlagship();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-mono text-xs uppercase tracking-[0.15em] hover:bg-white/10 hover:border-white/40 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-ember-400" />
            <span>Inspect Flagship Piece</span>
          </button>
        </div>
      </div>

      {/* Bottom Horizontal Category Bar */}
      <div className="pb-4 sm:pb-6 z-10 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1 shrink-0 flex items-center gap-1">
            <Compass className="w-3 h-3 text-ember-400" /> WARDROBE:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectCategory(cat.id);
                  onExploreClick();
                }}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider whitespace-nowrap transition-all border shrink-0 ${
                  isActive
                    ? 'border-white bg-white text-black font-bold shadow-md'
                    : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/25'
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
