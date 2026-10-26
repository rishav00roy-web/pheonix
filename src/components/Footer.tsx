import React from 'react';
import { BRAND, SOCIAL } from '../data/brand';
import { Signature } from './BrandLogo';

const YEAR = new Date().getFullYear();

// Obsidian, under a hairline: the signature and the house's own words, its
// origin, and where to find it. The last row leaves room for the dock.
export const Footer: React.FC = () => (
  <footer id="site-footer" className="relative z-10 bg-obsidian-950 text-bone-100 border-t border-obsidian-700">
    <div className="frame grid-12 gap-y-14 pt-[var(--section)] pb-16">
      <div className="lg:col-span-5">
        <Signature logoClassName="h-12 w-auto" wordClassName="text-[32px]" />
        <p className="mt-8 max-w-[40ch] text-bone-100/80">{BRAND.bio}</p>
        <p className="mt-6 font-serif italic text-[20px] text-bone-100">{BRAND.tagline}</p>
      </div>

      <div className="lg:col-span-3 lg:col-start-7">
        <h2 className="text-[15px] text-chrome-400">Origin</h2>
        <p className="mt-5">{BRAND.origin.city}</p>
        <p className="text-bone-100/70">{BRAND.origin.country}</p>
      </div>

      <div className="lg:col-span-3">
        <h2 className="text-[15px] text-chrome-400">Connect</h2>
        <ul className="mt-3">
          {SOCIAL.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center hover:text-ember-400 transition-colors duration-300">
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
