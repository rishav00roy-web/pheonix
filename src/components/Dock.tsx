import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart, whatsappLink } from '../lib/bag';
import { INSTAGRAM_URL } from '../data/brand';
import { TLink } from '../lib/transition';
import { entranceDelay } from '../lib/pageTransition';
import { gsap, prefersReducedMotion } from '../lib/smoothScroll';
import { BagIcon, BookIcon, HangerIcon, HomeIcon, InstagramIcon, WhatsAppIcon } from './icons';
import './Dock.css';

type Item =
  | { kind: 'route'; label: string; to: string; Icon: React.FC<{ className?: string }>; match: (p: string) => boolean }
  | { kind: 'bag'; label: string; Icon: React.FC<{ className?: string }> }
  | { kind: 'out'; label: string; href: string; Icon: React.FC<{ className?: string }> };

const ITEMS: Item[] = [
  { kind: 'route', label: 'Home', to: '/', Icon: HomeIcon, match: (p) => p === '/' },
  { kind: 'route', label: 'Shop', to: '/shop', Icon: HangerIcon, match: (p) => p.startsWith('/shop') || p.startsWith('/p/') },
  { kind: 'route', label: 'AJ Shield', to: '/aj-shield', Icon: BookIcon, match: (p) => p.startsWith('/aj-shield') },
  { kind: 'bag', label: 'Bag', Icon: BagIcon },
  { kind: 'out', label: 'Instagram', href: INSTAGRAM_URL, Icon: InstagramIcon },
  { kind: 'out', label: 'WhatsApp', href: whatsappLink(), Icon: WhatsAppIcon },
];

// Every item is a keycap (Dock.css); the current page's key stays latched down
const itemClass = (on = false) => `peer dock-key${on ? ' is-on' : ''}`;

// The dock: a graphite console on the bottom edge, slanted sides, an ember top
// edge, keycaps standing in a sunken tray. The site's own pages and the bag
// come first; a groove sets Instagram and WhatsApp apart. An ember diamond,
// the one from the Home hero, glows in the tray under the current page and
// slides between keys. The bag gives a small jump when a piece goes in. The
// dock rises in after the page wipe and tucks down while the page is flung.
export const Dock: React.FC = () => {
  const { pathname } = useLocation();
  const { count, open } = useCart();
  const nav = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const bag = useRef<HTMLButtonElement>(null);
  const lastCount = useRef(count);
  const [dot, setDot] = useState<number | null>(null);

  const active = ITEMS.findIndex((it) => it.kind === 'route' && it.match(pathname));

  // Measure where the dot sits under the current item
  useLayoutEffect(() => {
    const place = () => {
      const li = list.current?.children[active] as HTMLElement | undefined;
      setDot(li ? li.offsetLeft + li.offsetWidth / 2 : null);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active]);

  // A piece went in: the bag jumps once
  useEffect(() => {
    const grew = count > lastCount.current;
    lastCount.current = count;
    const el = bag.current;
    if (!grew || !el || prefersReducedMotion) return;
    // Clear the inline transform after, so the CSS press scale works again
    gsap.fromTo(el, { y: 0 }, {
      y: -6, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true,
      onComplete: () => gsap.set(el, { clearProps: 'transform,translate,rotate,scale' }),
    });
  }, [count]);

  // Rise in, step aside for the page wipe, tuck while the page is flung
  useEffect(() => {
    const el = nav.current;
    if (!el || prefersReducedMotion) return;
    const move = (tucked: boolean, delay = 0) =>
      gsap.to(el, { yPercent: tucked ? 140 : 0, duration: tucked ? 0.45 : 0.8, delay, ease: tucked ? 'power2.in' : 'power3.out', overwrite: true });

    gsap.set(el, { yPercent: 140 });
    move(false, entranceDelay() + 0.5);

    const onCover = () => move(true);
    const onReveal = () => move(false, 0.6);
    window.addEventListener('pheonix:cover', onCover);
    window.addEventListener('pheonix:reveal', onReveal);

    let lastY = window.scrollY;
    let lastT = performance.now();
    let tucked = false;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const now = performance.now();
      const v = (window.scrollY - lastY) / Math.max(1, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      if (Math.abs(v) > 2.2 && !tucked) {
        tucked = true;
        move(true);
      }
      clearTimeout(settle);
      settle = setTimeout(() => {
        if (tucked) {
          tucked = false;
          move(false);
        }
      }, 380);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('pheonix:cover', onCover);
      window.removeEventListener('pheonix:reveal', onReveal);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(settle);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] flex justify-center pointer-events-none">
    <nav
      ref={nav}
      aria-label="Main"
      className="dock relative pointer-events-auto w-[min(calc(100vw-16px),420px)] lg:w-[408px]"
    >
      {/* Ember panel, with the graphite body set just inside it: a 1px ember edge along the top and both slants */}
      <div aria-hidden="true" className="dock-edge absolute inset-0 bg-ember-500" />
      <div aria-hidden="true" className="dock-body absolute inset-x-0 bottom-0 top-px" />
      <div aria-hidden="true" className="dock-tray" />

      <ul
        ref={list}
        className="relative flex items-center justify-between h-[calc(var(--dock-h)-6px)] px-[calc(var(--dock-slant)+8px)] lg:px-[calc(var(--dock-slant)+14px)] pb-[calc(var(--safe-b)+6px)] box-content"
      >
        {ITEMS.map((it, i) => {
          const tip = (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 hidden lg:block whitespace-nowrap
                         bg-void text-bone-100 border border-ember-500/60 px-3 py-1.5 eyebrow
                         opacity-0 translate-y-1 transition duration-300 peer-hover:opacity-100 peer-hover:translate-y-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0
                         motion-reduce:transition-none"
            >
              {it.label}
            </span>
          );
          return (
            <li key={it.label} className="relative flex justify-center">
              {/* The hairline between the site and the links that leave it */}
              {it.kind === 'out' && i > 0 && ITEMS[i - 1].kind !== 'out' && (
                <span aria-hidden="true" className="dock-groove absolute -left-[5px] top-1/2 -translate-y-1/2 w-px h-6" />
              )}
              {it.kind === 'route' && (
                <TLink to={it.to} aria-label={it.label} aria-current={i === active ? 'page' : undefined} className={itemClass()}>
                  <it.Icon className="w-6 h-6" />
                </TLink>
              )}
              {it.kind === 'bag' && (
                <button ref={bag} type="button" onClick={open} aria-label={`Bag, ${count} ${count === 1 ? 'piece' : 'pieces'}`} className={itemClass(count > 0)}>
                  <it.Icon className="w-6 h-6" />
                  {count > 0 && (
                    <span
                      aria-hidden="true"
                      className="dock-badge absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-ember-500 text-void text-[13px] leading-5 text-center font-semibold num"
                    >
                      {count}
                    </span>
                  )}
                </button>
              )}
              {it.kind === 'out' && (
                <a href={it.href} target="_blank" rel="noopener noreferrer" aria-label={`${it.label} (opens in a new tab)`} className={itemClass()}>
                  <it.Icon className="w-6 h-6" />
                </a>
              )}
              {tip}
            </li>
          );
        })}

        {/* The current-page diamond */}
        {dot !== null && (
          <span
            aria-hidden="true"
            className="dock-led absolute left-0 bottom-[calc(var(--safe-b)+4px)] w-[5px] h-[5px] -ml-[2.5px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(${dot}px) rotate(45deg)` }}
          />
        )}
      </ul>
    </nav>
    </div>
  );
};
