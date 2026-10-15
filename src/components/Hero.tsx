import React, { useState } from 'react';
import { ArrowDown, Sparkles, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeroProps {
  onExploreClick: () => void;
  onOpenFlagship: () => void;
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
}

const HERO_ACTS = [
  {
    id: 'act-1',
    act: 'ACT I',
    title: 'THE CHIMERA MAW',
    subtitle: 'Predatory Footwear & Cast Titanium Jaws',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=90',
    quote: 'The heel reimagined as a biting beast. Load-bearing surgical titanium fangs cradle the Achilles tendon.'
  },
  {
    id: 'act-2',
    act: 'ACT II',
    title: 'SCULPTED MONOLITHS',
    subtitle: 'Origami Gabardine & Vertebral Leather',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=90',
    quote: 'Wingback storm flaps and heat-molded spinal columns. Outerwear engineered as wearable armor.'
  },
  {
    id: 'act-3',
    act: 'ACT III',
    title: 'LIQUID ANATOMY',
    subtitle: 'Wet-Look Column Drapes & Open Mohair',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=90',
    quote: 'Molten modal jerseys anchored to cantilevered hip wires, falling into razor floor slits.'
  }
];

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenFlagship,
  onSelectCategory,
  selectedCategory
}) => {
  const [activeActIndex, setActiveActIndex] = useState(0);
  const currentAct = HERO_ACTS[activeActIndex];

  const handleActChange = (index: number) => {
    soundManager.playClick();
    setActiveActIndex(index);
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
    <section className="relative min-h-[92svh] sm:min-h-screen w-full flex flex-col justify-between p-5 sm:p-12 overflow-hidden border-b border-white/[0.08] bg-void">
      {/* Background Editorial Visual with cinematic crossfade */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentAct.id}
          src={currentAct.image}
          alt={currentAct.title}
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 transition-all duration-1000 ease-out scale-105 pointer-events-none"
        />
        {/* Cinematic Vignette and Atmospheric Embers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-ember-600/15 blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* Top Technical Metadata */}
      <div className="pt-20 sm:pt-16 flex items-center justify-between text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase z-10 w-full">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
          <span className="text-white font-bold">ATELIER PHEONIX</span>
          <span className="text-zinc-600 hidden sm:inline">//</span>
          <span className="text-zinc-400 hidden sm:inline">AUTUMN / WINTER 2026</span>
        </div>

        <div className="text-zinc-400 font-mono tracking-widest text-[9px] sm:text-[10px]">
          14 NUMBERED ARTEFACTS
        </div>
      </div>

      {/* Center Cinematic Title & Act Showcase */}
      <div className="my-auto z-10 w-full max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 pt-4">
        {/* Act Switcher Pills */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl mb-1">
          {HERO_ACTS.map((act, idx) => (
            <button
              key={act.id}
              onClick={() => handleActChange(idx)}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-widest transition-all ${
                activeActIndex === idx
                  ? 'bg-white text-black font-bold shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {act.act}
            </button>
          ))}
        </div>

        {/* Monolith Brand Headline */}
        <div>
          <h1 className="font-syne font-black text-4xl sm:text-7xl md:text-8xl tracking-[0.18em] sm:tracking-[0.25em] uppercase text-white leading-none">
            PHEONIX
          </h1>
          <p className="font-mono text-[10px] sm:text-xs text-ember-400 uppercase tracking-[0.35em] mt-2 sm:mt-3 font-semibold">
            {currentAct.subtitle}
          </p>
        </div>

        {/* Cinematic Manifesto Quote */}
        <p className="font-cinzel text-base sm:text-2xl text-zinc-200 font-light italic max-w-2xl mx-auto leading-snug">
          "{currentAct.quote}"
        </p>

        {/* Action Triggers */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              onExploreClick();
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black font-mono font-bold text-xs uppercase tracking-[0.2em] hover:bg-ember-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            <span>Browse 14 Artefacts</span>
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
            <span>Inspect Chimera Maw Heel</span>
          </button>
        </div>
      </div>

      {/* Bottom Horizontal Category Bar */}
      <div className="pb-4 sm:pb-6 z-10 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1 shrink-0 flex items-center gap-1">
            <Compass className="w-3 h-3 text-ember-400" /> CATEGORY:
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
