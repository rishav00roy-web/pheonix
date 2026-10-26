import React from 'react';
import { BRAND, SOCIAL } from '../data/brand';
import { TLink } from '../lib/transition';
import { Signature } from './BrandLogo';

const YEAR = new Date().getFullYear();

const PAGES = [
  { label: 'The collection', to: '/shop' },
  { label: 'AJ Shield', to: '/aj-shield' },
  { label: 'Home', to: '/' },
];

const linkClass = 'min-h-11 inline-flex items-center hover:text-ember-400 transition-colors duration-300';

// Obsidian, under a hairline: the signature, a short line on what the shop is
// and how to order, the tagline, then the pages, the origin and where to
// order and follow. The last row leaves room for the dock.
export const Footer: React.FC = () => (
  <footer id="site-footer" className="relative z-10 bg-obsidian-950 text-bone-100 border-t border-obsidian-700">
    <div className="frame grid-12 gap-y-12 pt-[var(--section)] pb-16">
      <div className="lg:col-span-5">
        <Signature logoClassName="h-12 w-auto" wordClassName="text-[32px]" />
        <p className="mt-8 max-w-[38ch] text-bone-100/80">{BRAND.summary}</p>
        <p className="mt-6 font-serif italic text-[20px] text-bone-100">{BRAND.tagline}</p>
      </div>

      <nav aria-labelledby="footer-pages" className="lg:col-span-2 lg:col-start-7">
        <h2 id="footer-pages" className="mono-label text-chrome-400">Pages</h2>
        <ul className="mt-3">
          {PAGES.map((l) => (
            <li key={l.to}>
              <TLink to={l.to} className={linkClass}>
                {l.label}
              </TLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="lg:col-span-2">
        <h2 className="mono-label text-chrome-400">Origin</h2>
        <p className="mt-5">{BRAND.origin.city}</p>
        <p className="text-bone-100/70">{BRAND.origin.country}</p>
      </div>

      <div className="lg:col-span-2">
        <h2 className="mono-label text-chrome-400">Order and follow</h2>
        <ul className="mt-3">
          {SOCIAL.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="frame border-t border-obsidian-700 pt-6 pb-[calc(24px+var(--dock-space))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[14px] text-bone-100/70">
      <p>
        © {YEAR} {BRAND.name.toUpperCase()}. All rights reserved.
      </p>
      <p>{BRAND.credit}</p>
      <p lang="as" className="text-bone-300">{BRAND.origin.native}</p>
    </div>
  </footer>
);
