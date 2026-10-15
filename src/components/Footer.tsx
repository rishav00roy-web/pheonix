import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-void py-16 text-center font-mono text-xs text-zinc-600">
      <div className="max-w-4xl mx-auto px-6 space-y-4">
        <div className="font-syne font-bold text-sm tracking-[0.35em] uppercase text-zinc-400">
          PHEONIX ATELIER
        </div>
        <div className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase">
          PARIS • MILAN • TOKYO • NEW YORK
        </div>
        <p className="text-[10px] text-zinc-600 tracking-widest pt-4">
          © {new Date().getFullYear()} PHEONIX. NUMBERED ARTEFACT EDITIONS ONLY.
        </p>
      </div>
    </footer>
  );
};
