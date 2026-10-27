import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { entranceDelay } from '../lib/pageTransition';
import { gsap, prefersReducedMotion } from '../lib/smoothScroll';
import { BagIcon, HangerIcon, WhatsAppIcon } from './icons';

const SEEN_KEY = 'pheonix_start_hint_v1';

const seen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const STEPS = [
  { Icon: HangerIcon, name: 'Shop', note: 'every piece on the rail' },
  { Icon: BagIcon, name: 'Bag', note: 'the pieces you pick' },
  { Icon: WhatsAppIcon, name: 'Order', note: 'send your bag on WhatsApp' },
];

// A one-time card for a first visit: it sits above the dock, names the keys
// a new visitor needs and how an order works, and points at Shop. It goes
// for good on "Got it", the close button, or the first trip to another page.
// The dock itself is left exactly as it is.
export const StartHint: React.FC = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const [arrow, setArrow] = useState<number | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const firstPath = useRef(pathname);

  const close = () => {
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage blocked: the card just shows again next visit */
    }
    const el = card.current;
    if (!el || prefersReducedMotion) return setShow(false);
    gsap.to(el, { autoAlpha: 0, y: 12, duration: 0.3, ease: 'power2.in', onComplete: () => setShow(false) });
  };

  // Wait for the hero and the dock to arrive, then come in
  useEffect(() => {
    if (seen()) return;
    const t = setTimeout(() => setShow(true), (entranceDelay() + 2.4) * 1000);
    return () => clearTimeout(t);
  }, []);

  // Moving to another page means the dock was found: retire the card
  useEffect(() => {
    if (pathname !== firstPath.current && show) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Point the arrow at the Shop key
  useLayoutEffect(() => {
    if (!show) return;
    const place = () => {
      const key = document.querySelector('nav[aria-label="Main"] [aria-label="Shop"]');
      const box = card.current?.getBoundingClientRect();
      if (!key || !box) return setArrow(null);
      const k = key.getBoundingClientRect();
      setArrow(Math.min(box.width - 24, Math.max(24, k.left + k.width / 2 - box.left)));
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [show]);

  useEffect(() => {
    const el = card.current;
    if (!show || !el || prefersReducedMotion) return;
    gsap.fromTo(el, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--dock-h)+var(--safe-b)+16px)] z-[61] flex justify-center px-4 pointer-events-none">
      <div
        ref={card}
        role="dialog"
        aria-labelledby="start-hint-title"
        className="start-hint relative pointer-events-auto w-full max-w-[360px] bg-bone-100 text-void p-4 pr-11 shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close the tip"
          className="absolute top-1 right-1 w-11 h-11 flex items-center justify-center text-void/60 hover:text-void"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="eyebrow text-ember-500">New here?</p>
        <h2 id="start-hint-title" className="mt-1 text-[17px] font-semibold leading-snug">
          Start with <span className="underline decoration-ember-500 decoration-2 underline-offset-4">Shop</span> in the bar below.
        </h2>

        <ul className="mt-3 flex flex-col gap-2">
          {STEPS.map(({ Icon, name, note }) => (
            <li key={name} className="flex items-center gap-3 text-[15px] leading-tight">
              <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-void text-bone-100">
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <span><b className="font-semibold">{name}</b> <span className="text-void/70">· {note}</span></span>
            </li>
          ))}
        </ul>

        <button type="button" onClick={close} className="mt-4 bg-void text-bone-100 eyebrow px-4 py-2.5 min-h-[44px] active:scale-95 transition-transform">
          Got it
        </button>

        {arrow !== null && (
          <span
            aria-hidden="true"
            className="absolute top-full -mt-px w-0 h-0 border-x-[9px] border-x-transparent border-t-[10px] border-t-bone-100 -translate-x-1/2"
            style={{ left: arrow }}
          />
        )}
      </div>
    </div>
  );
};
