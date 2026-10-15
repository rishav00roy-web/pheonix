import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenVault: () => void;
  onScrollToCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenVault,
  onScrollToCatalog
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const toggleSound = () => {
    const active = soundManager.toggleMute();
    setIsAudioActive(active);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-void/85 backdrop-blur-md border-b border-white/[0.04] transition-all">
      <div className="w-full px-4 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group focus:outline-none"
          >
            <span className="font-syne font-black text-lg sm:text-2xl tracking-[0.22em] sm:tracking-[0.35em] uppercase text-white group-hover:text-ember-400 transition-colors">
              PHEONIX
            </span>
          </button>
          <span className="hidden lg:inline-block text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase border-l border-white/10 pl-6">
            AUTUMN / WINTER 2026
          </span>
        </div>

        {/* Center: Direct Catalog Link */}
        <div className="flex items-center">
          <button
            onClick={() => {
              soundManager.playClick();
              onScrollToCatalog();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-300 hover:text-white hover:border-white/30 transition-all"
          >
            <Sparkles className="w-3 h-3 text-ember-400" />
            <span>Wardrobe (14)</span>
          </button>
        </div>

        {/* Right: Sound & Vault */}
        <div className="flex items-center gap-2.5 sm:gap-6 font-mono text-xs">
          {/* Ambient Drone Toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 p-1.5 sm:py-1.5 sm:px-3 rounded-full border text-[10px] uppercase tracking-widest transition-all ${
              isAudioActive
                ? 'border-ember-500/60 bg-ember-500/10 text-ember-400'
                : 'border-white/10 text-zinc-500 hover:text-white hover:border-white/25'
            }`}
            title={isAudioActive ? 'Atmospheric Drone Active' : 'Sound Muted'}
          >
            {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-ember-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAudioActive ? 'Drone' : 'Mute'}</span>
          </button>

          {/* Vault Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenVault();
            }}
            className="flex items-center gap-1.5 text-white hover:text-ember-400 transition-colors uppercase tracking-[0.18em] text-[11px]"
          >
            <span>Vault</span>
            <span className="font-mono text-zinc-400">[{cartCount}]</span>
          </button>
        </div>

      </div>
    </header>
  );
};
