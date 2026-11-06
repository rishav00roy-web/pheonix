import React, { useState } from 'react';
import { BRAND, INSTAGRAM_URL, STORE, YOUTUBE_URL } from '../data/brand';
import { whatsappLink } from '../lib/bag';
import { TLink } from '../lib/transition';
import { Signature } from './BrandLogo';
import { ArrowUpRightIcon, InstagramIcon, WhatsAppIcon, YouTubeIcon } from './icons';

const YEAR = new Date().getFullYear();

const SHOP_LINKS = [
  { label: 'All pieces', to: '/shop' },
  { label: 'Hoodies', to: '/shop?cat=hoodies' },
  { label: 'Tees', to: '/shop?cat=tees' },
  { label: 'Outerwear', to: '/shop?cat=outerwear' },
  { label: 'Footwear', to: '/shop?cat=footwear' },
];

const HOUSE_LINKS = [
  { label: 'AJ Shield', to: '/aj-shield' },
  { label: 'Home', to: '/' },
];

const FOLLOW = [
  { label: 'Instagram', handle: '@aj_shiield', href: INSTAGRAM_URL, Icon: InstagramIcon },
  { label: 'YouTube', handle: '@ajshield6480', href: YOUTUBE_URL, Icon: YouTubeIcon },
];

const linkClass = 'min-h-11 inline-flex items-center gap-2 hover:text-ember-400 transition-colors duration-300';

// A second homepage, not a copyright line: the drop list up top, then where
// the shop is and when it's open, every way in, how to reach a person, and
// where to follow. Its one button is a hairline, so the page's own ember
// button stays the only solid one. The last row leaves room for the dock.
export const Footer: React.FC = () => (
  <footer id="site-footer" className="relative z-10 bg-obsidian-950 text-bone-100 border-t border-obsidian-700">
    <div className="frame grid-12 gap-y-12 pt-[var(--section)] pb-14 border-b border-obsidian-700">
      <div className="lg:col-span-5">
        <Signature logoClassName="h-12 w-auto" wordClassName="text-[32px]" />
        <p className="mt-8 max-w-[38ch] text-bone-100/80">{BRAND.summary}</p>
        <p className="mt-6 font-serif italic text-[20px] text-bone-100">{BRAND.tagline}</p>
      </div>
      <DropList />
    </div>

    <div className="frame grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-12 py-14">
      <section aria-labelledby="footer-visit" className="col-span-2 sm:col-span-1 lg:col-span-3">
        <h2 id="footer-visit" className="mono-label text-chrome-400">Visit</h2>
        <address className="mt-5 not-italic">
          <span className="block">{STORE.street}</span>
          <span className="block text-bone-100/70">{STORE.area}</span>
          <span lang="as" className="block mt-1 text-bone-300">{BRAND.origin.native}</span>
        </address>
        {STORE.mapsUrl && (
          <a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-link mt-3">
            Get directions
            <ArrowUpRightIcon className="w-4 h-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </section>

      <section aria-labelledby="footer-hours" className="col-span-2 sm:col-span-1 lg:col-span-3">
        <h2 id="footer-hours" className="mono-label text-chrome-400">Hours</h2>
        <dl className="mt-5 space-y-2">
          {STORE.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-4 max-w-[260px] border-b border-obsidian-700 pb-2">
              <dt>{h.days}</dt>
              <dd className="text-bone-100/70 num">{h.time}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[15px] text-chrome-400">{STORE.replyNote}</p>
      </section>

      <nav aria-labelledby="footer-shop" className="lg:col-span-2">
        <h2 id="footer-shop" className="mono-label text-chrome-400">Shop</h2>
        <ul className="mt-3">
          {SHOP_LINKS.map((l) => (
            <li key={l.to}>
              <TLink to={l.to} className={linkClass}>{l.label}</TLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-labelledby="footer-house" className="lg:col-span-2">
        <h2 id="footer-house" className="mono-label text-chrome-400">The house</h2>
        <ul className="mt-3">
          {HOUSE_LINKS.map((l) => (
            <li key={l.to}>
              <TLink to={l.to} className={linkClass}>{l.label}</TLink>
            </li>
          ))}
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Contact
              <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>

      <section aria-labelledby="footer-follow" className="col-span-2 lg:col-span-2">
        <h2 id="footer-follow" className="mono-label text-chrome-400">Follow</h2>
        <ul className="mt-3">
          {FOLLOW.map(({ label, handle, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <Icon className="w-5 h-5" />
                <span>{handle}</span>
                <span className="sr-only"> on {label} (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <WhatsAppIcon className="w-5 h-5" />
              <span>WhatsApp</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </section>
    </div>

    <div className="frame border-t border-obsidian-700 pt-6 pb-[calc(24px+var(--dock-space))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[14px] text-bone-100/70">
      <p>
        © {YEAR} {BRAND.name.toUpperCase()}. All rights reserved.
      </p>
      <p>{BRAND.credit}</p>
    </div>
  </footer>
);

/** The drop list: an email, posted to the form service set in STORE. */
function DropList() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'soon'>('idle');
  const d = STORE.dropList;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.endpoint) return setState('soon');
    setState('sending');
    try {
      const res = await fetch(d.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, _subject: 'Pheonix drop list sign-up' }),
      });
      setState(res.ok ? 'done' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setState('error');
    }
  };

  const note = {
    idle: '',
    sending: 'Signing you up…',
    done: 'You’re on the list. We’ll write before the next drop.',
    error: 'That didn’t go through. Check the address and try again.',
    soon: 'Sign-ups open soon. Until then, follow @aj_shiield for drops.',
  }[state];

  return (
    <section aria-labelledby="footer-drops" className="lg:col-span-6 lg:col-start-7">
      <h2 id="footer-drops" className="headline text-[clamp(32px,3.6vw,52px)] leading-[1.05]">{d.title}</h2>
      <p className="mt-4 max-w-[46ch] text-chrome-400">{d.body}</p>
      <form className="mt-8 flex flex-col sm:flex-row gap-3" onSubmit={submit}>
        <label htmlFor="drop-email" className="sr-only">Your email</label>
        <input
          id="drop-email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-h-[52px] px-4 bg-transparent border border-bone-100/25 text-bone-100 text-[16px] placeholder:text-chrome-400 focus:border-bone-100 transition-colors duration-300"
        />
        <button type="submit" disabled={state === 'sending'} className="btn btn-line">
          Subscribe
        </button>
      </form>
      <p role="status" className={`mt-3 min-h-6 text-[15px] ${state === 'done' ? 'text-bone-100' : state === 'error' ? 'text-ember-400' : 'text-chrome-400'}`}>{note}</p>
    </section>
  );
}
