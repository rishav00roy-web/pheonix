import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../lib/bag';
import { SOCIAL } from '../data/brand';
import { TLink } from '../lib/transition';
import { gsap, prefersReducedMotion, setScrollLocked } from '../lib/smoothScroll';

const PAGES = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'AJ Shield', to: '/aj-shield' },
];

// Where the button appears: past the bottom of Home's hero, or a screen's
// worth of scroll on pages without one
const threshold = () => {
  const hero = document.getElementById('hero-section');
  return hero ? hero.offsetTop + hero.offsetHeight - 1 : window.innerHeight * 0.7;
};

// A three-line button at the top right that arrives once the hero has gone.
// It opens a full-screen menu: the pages set large, the bag, and the links
// that leave the site. The lines fold into a cross while it is open. The
// dock is left exactly as it is; this is a second way round for anyone who
// looks for a menu at the top.
export const MenuButton: React.FC = () => {
  const { pathname } = useLocation();
  const { count, open: openBag } = useCart();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLAnchorElement>(null);

  // Show past the hero, hide again above it
  useEffect(() => {
    const check = () => setShown(window.scrollY > threshold());
    check();
    const late = setTimeout(check, 400);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      clearTimeout(late);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [pathname]);

  useEffect(() => {
    const el = btn.current;
    if (!el) return;
    const on = shown || open;
    if (prefersReducedMotion) {
      gsap.set(el, { autoAlpha: on ? 1 : 0 });
      return;
    }
    gsap.to(el, { autoAlpha: on ? 1 : 0, y: on ? 0 : -12, duration: on ? 0.45 : 0.3, ease: on ? 'power3.out' : 'power2.in', overwrite: true });
  }, [shown, open]);

  // A new page closes the menu
  useEffect(() => setOpen(false), [pathname]);

  // Open: hold the page still, bring the panel down, let the lines in one by one
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    setScrollLocked(open, 'menu');
    if (open) {
      el.hidden = false;
      first.current?.focus({ preventScroll: true });
      if (!prefersReducedMotion) {
        gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut', overwrite: true });
        gsap.fromTo(el.querySelectorAll('[data-menu-line]'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06, delay: 0.25 });
      }
    } else if (!el.hidden) {
      if (prefersReducedMotion) el.hidden = true;
      else gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5, ease: 'power3.in', overwrite: true, onComplete: () => { el.hidden = true; } });
    }
    return () => setScrollLocked(false, 'menu');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const bar = 'absolute left-1/2 -ml-[10px] w-5 h-[1.5px] bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close the menu' : 'Open the menu'}
        style={{ visibility: 'hidden', opacity: 0 }}
        className="menu-button fixed z-[76] w-11 h-11 lg:w-12 lg:h-12 bg-obsidian-900 border border-obsidian-700 text-bone-100 hover:border-ember-500 active:scale-95 transition-[border-color,transform] duration-300"
      >
        <span aria-hidden="true" className={bar} style={{ top: '50%', transform: open ? 'translateY(-50%) rotate(45deg)' : 'translateY(calc(-50% - 6px))' }} />
        <span aria-hidden="true" className={bar} style={{ top: '50%', transform: open ? 'translateY(-50%) scaleX(0)' : 'translateY(-50%)' }} />
        <span aria-hidden="true" className={bar} style={{ top: '50%', transform: open ? 'translateY(-50%) rotate(-45deg)' : 'translateY(calc(-50% + 6px))' }} />
      </button>

      <div
        ref={panel}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden
        className="fixed inset-0 z-[75] bg-void text-bone-100 overflow-y-auto"
      >
        <div className="frame min-h-full flex flex-col pt-[calc(var(--mast-h)+env(safe-area-inset-top,0px)+24px)] pb-[calc(var(--dock-space)+16px)]">
          <p className="eyebrow text-chrome-400">Menu</p>
          <nav aria-label="Pages" className="mt-6 mb-12">
            <ul className="flex flex-col gap-2 lg:gap-4">
              {PAGES.map((p, i) => {
                const here = p.to === '/' ? pathname === '/' : pathname.startsWith(p.to) || (p.to === '/shop' && pathname.startsWith('/p/'));
                return (
                  <li key={p.to} className="overflow-hidden pb-2">
                    <TLink
                      ref={i === 0 ? first : undefined}
                      to={p.to}
                      onClick={() => setOpen(false)}
                      aria-current={here ? 'page' : undefined}
                      className="group flex items-baseline gap-4 py-1"
                    >
                      <span data-menu-line className="headline inline-block text-[clamp(48px,13vw,120px)] leading-none group-hover:text-ember-400 transition-colors">
                        {p.label}
                      </span>
                      {here && <span aria-hidden="true" className="w-2 h-2 bg-ember-500 rotate-45 shrink-0 self-center" />}
                    </TLink>
                  </li>
                );
              })}
              <li className="overflow-hidden pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openBag();
                  }}
                  className="group flex items-baseline gap-4 py-1 text-left"
                >
                  <span data-menu-line className="headline inline-block text-[clamp(48px,13vw,120px)] leading-none group-hover:text-ember-400 transition-colors">
                    Bag
                  </span>
                  <span className="eyebrow text-chrome-400 num">
                    {count} {count === 1 ? 'piece' : 'pieces'}
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="mt-auto pt-2 border-t border-obsidian-700 flex flex-wrap gap-x-8 gap-y-3">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="eyebrow min-h-11 flex items-center text-chrome-400 hover:text-bone-100 pt-4">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
