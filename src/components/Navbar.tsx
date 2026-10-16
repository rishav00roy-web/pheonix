import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenVault: () => void;
  onScrollToCatalog: () => void;
}

const WHATSAPP_URL = 'https://wa.me/60017633352';

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenVault,
  onScrollToCatalog,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  // Navbar is hidden on the hero; appears once scrolled past it
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero-section');

    const check = () => {
      if (!hero) {
        // fallback: show after 80vh
        setVisible(window.scrollY > window.innerHeight * 0.8);
        return;
      }
      const heroBottom = hero.getBoundingClientRect().bottom;
      // slide in once hero bottom is above the top of the viewport
      setVisible(heroBottom <= 0);
    };

    check(); // run on mount
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const toggleSound = () => {
    const active = soundManager.toggleMute();
    setIsAudioActive(active);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40
                  bg-void/90 backdrop-blur-md border-b border-white/[0.06]
                  transition-transform duration-500 ease-in-out
                  ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="w-full px-6 sm:px-10 h-14 sm:h-16 flex items-center justify-between gap-4">

        {/* LEFT — brand name only (no logo image) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-syne font-black text-sm sm:text-base tracking-[0.28em] uppercase
                     text-white hover:text-ember-400 transition-colors duration-300
                     focus:outline-none pl-[0.28em]"
          aria-label="Scroll to top"
        >
          PHEONIX
        </button>

        {/* RIGHT — nav controls */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* View Catalog — desktop */}
          <button
            onClick={() => { soundManager.playClick(); onScrollToCatalog(); }}
            className="hidden md:flex items-center gap-1.5 font-mono uppercase
                       tracking-[0.25em] text-zinc-400 hover:text-white
                       transition-colors border-b border-transparent
                       hover:border-white/30 pb-px"
            style={{ fontSize: '11px' }}
          >
            View Catalog
          </button>

          {/* WhatsApp / Contact */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       border border-white/15 bg-black/40
                       font-mono uppercase tracking-[0.2em] text-zinc-300
                       hover:text-white hover:border-emerald-500/60
                       hover:bg-emerald-500/10
                       hover:shadow-[0_0_20px_-4px_rgba(16,185,129,0.25)]
                       transition-all duration-300"
            style={{ fontSize: '11px' }}
            aria-label="Contact via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Contact</span>
          </a>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition-all ${
              isAudioActive
                ? 'border-ember-500/60 bg-ember-500/10 text-ember-400'
                : 'border-white/15 bg-black/40 text-zinc-400 hover:text-white hover:border-white/30'
            }`}
            title={isAudioActive ? 'Mute atmosphere' : 'Unmute atmosphere'}
            aria-label="Toggle ambient sound"
          >
            {isAudioActive
              ? <Volume2 className="w-3.5 h-3.5 text-ember-400" />
              : <VolumeX className="w-3.5 h-3.5" />
            }
          </button>

          {/* Vault */}
          <button
            onClick={() => { soundManager.playClick(); onOpenVault(); }}
            className="flex items-center gap-1.5 text-white hover:text-ember-400
                       transition-colors uppercase tracking-[0.18em] font-mono"
            style={{ fontSize: '11px' }}
            aria-label="Open acquisition vault"
          >
            <span>Vault</span>
            <span className="text-zinc-500">[{cartCount}]</span>
          </button>

        </div>
      </div>
    </header>
  );
};
