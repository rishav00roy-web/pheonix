import React from 'react';
import { useLocation } from 'react-router-dom';
import { TLink } from '../lib/transition';
import { Signature } from './BrandLogo';

// The masthead: crest and wordmark centred on void, an obsidian hairline under
// it. It scrolls away with the page; the dock carries the navigation. Home
// draws its own inside the opening scene, so the crest can fly into it.
export const Masthead: React.FC = () => {
  const { pathname } = useLocation();
  if (pathname === '/') return null;
  return (
    <header className="relative z-20 bg-void border-b border-obsidian-700">
      <div className="frame h-[var(--mast-h)] flex items-center justify-center">
        <TLink to="/" className="min-h-11 flex items-center px-2" aria-label="Pheonix, home">
          <Signature />
        </TLink>
      </div>
    </header>
  );
};
