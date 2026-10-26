import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { formatPrice, smallShot } from '../data/products';
import { buildOrderMessage, useCart, whatsappLink, type BagLine } from '../lib/bag';
import { gsap, prefersReducedMotion, setScrollLocked } from '../lib/smoothScroll';
import { useTransition } from '../lib/pageTransition';
import { BrandLogo } from './BrandLogo';
import { CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from './icons';

// The bag: a right-hand drawer on obsidian. Checkout hands a pre-filled order to
// WhatsApp. It stays mounted while it slides out, then leaves the page.
export const CartDrawer: React.FC = () => {
  const { isOpen } = useCart();
  const [mounted, setMounted] = useState(isOpen);
  const onClosed = useCallback(() => setMounted(false), []);
  // Opening mounts the drawer at once; closing waits for the slide-out
  if (isOpen && !mounted) setMounted(true);

  useEffect(() => {
    setScrollLocked(isOpen, 'bag');
  }, [isOpen]);

  return mounted ? <Drawer open={isOpen} onClosed={onClosed} /> : null;
};

const Drawer: React.FC<{ open: boolean; onClosed: () => void }> = ({ open, onClosed }) => {
  const { items, close, clear } = useCart();
  const { go } = useTransition();
  const [ref] = useState(() => `PHX-${Math.floor(100000 + Math.random() * 900000)}`);
  const [sent, setSent] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const veil = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Slide in on open, out on close, then unmount
  useLayoutEffect(() => {
    const t = prefersReducedMotion ? 0 : 1;
    if (open) {
      gsap.fromTo(veil.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 * t });
      gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.7 * t, ease: 'power4.out' });
    } else {
      gsap.to(veil.current, { autoAlpha: 0, duration: 0.3 * t });
      gsap.to(panel.current, { xPercent: 100, duration: 0.45 * t, ease: 'power3.in', onComplete: onClosed });
    }
  }, [open, onClosed]);

  // Focus moves in and returns to the opener on close; Escape closes
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, close]);

  const subtotal = items.reduce((acc, m) => acc + m.product.price * m.quantity, 0);
  const pieces = items.reduce((acc, m) => acc + m.quantity, 0);
  const href = useMemo(() => whatsappLink(buildOrderMessage(items, subtotal, ref)), [items, subtotal, ref]);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="bag-title">
      <div ref={veil} className="absolute inset-0 bg-void/50" onClick={close} />
      <aside ref={panel} className="relative w-full max-w-[480px] h-full flex flex-col bg-void text-bone-100 border-l border-obsidian-700">
        <div className="shrink-0 px-6 pt-6 pb-5 border-b border-obsidian-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo small className="h-9 w-auto" />
            <div>
              <h2 id="bag-title" className="headline text-[36px]">Your bag</h2>
              <p className="text-[14px] text-chrome-400 num">Reference {ref}</p>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={close}
            className="w-12 h-12 -mr-2 flex items-center justify-center hover:bg-bone-100 hover:text-void active:bg-bone-100 active:text-void transition-colors duration-300"
            aria-label="Close bag"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 px-8">
            <BrandLogo small className="w-28 h-auto opacity-90" />
            <p className="headline text-[32px]">Your bag is empty.</p>
            <p className="text-chrome-400 max-w-[30ch]">Pieces you add will wait here until you order them on WhatsApp.</p>
            <button
              onClick={() => {
                close();
                setTimeout(() => go('/shop'), 300);
              }}
              className="btn btn-primary mt-2"
            >
              Shop the collection
            </button>
          </div>
        ) : (
          <>
            <ul data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto px-6 divide-y divide-obsidian-700">
              {items.map((m) => (
                <BagRow key={`${m.product.id}-${m.size}-${m.color}`} line={m} />
              ))}
            </ul>

            <div className="shrink-0 px-6 pt-5 pb-[calc(1.25rem+var(--safe-b))] border-t border-obsidian-700 space-y-4">
              <div className="flex justify-between text-[15px] text-chrome-400">
                <span>
                  {pieces} {pieces === 1 ? 'piece' : 'pieces'}
                </span>
                <span>Shipping agreed on WhatsApp</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[16px]">Subtotal</span>
                <span className="text-[22px] num">{formatPrice(subtotal)}</span>
              </div>

              <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => setSent(true)} className="btn btn-primary w-full">
                <WhatsAppIcon />
                Order on WhatsApp
              </a>
              {!sent && (
                <p className="text-[15px] text-chrome-400">WhatsApp opens with your order already written out. Shipping and payment are agreed there before you pay.</p>
              )}

              {sent && (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[15px] text-chrome-400">Sent with reference {ref}</p>
                  {/* Destructive: asks once more before emptying the bag */}
                  <button
                    onClick={() => (confirmClear ? clear() : setConfirmClear(true))}
                    onBlur={() => setConfirmClear(false)}
                    className={`h-11 px-4 text-[15px] border transition-colors ${confirmClear ? 'border-bone-100' : 'border-obsidian-700 hover:border-bone-100'}`}
                  >
                    {confirmClear ? 'Tap again to clear' : 'Clear bag'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

/** One line in the bag: 4:5 thumbnail, name, size, a square stepper, the line price. */
const BagRow: React.FC<{ line: BagLine }> = ({ line: m }) => {
  const { setQuantity, remove } = useCart();
  const step = (d: number) => setQuantity(m.product.id, m.size, m.color, m.quantity + d);
  return (
    <li className="py-5 flex gap-4">
      <span className="paper w-20 aspect-[4/5] shrink-0 overflow-hidden">
        <img src={smallShot(m.product.gallery[0])} alt="" className="w-full h-full object-cover" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[16px] leading-tight">{m.product.name}</p>
        <p className="mt-1 text-[15px] text-chrome-400">
          Size {m.size}
          {m.color ? `, ${m.color.toLowerCase()}` : ''}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center border border-obsidian-700">
            <button onClick={() => step(-1)} className="w-11 h-11 flex items-center justify-center hover:bg-obsidian-800 active:bg-obsidian-900" aria-label={`One fewer ${m.product.name}`}>
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-9 text-center text-[16px] num border-x border-obsidian-700 leading-[44px]">{m.quantity}</span>
            <button onClick={() => step(1)} className="w-11 h-11 flex items-center justify-center hover:bg-obsidian-800 active:bg-obsidian-900" aria-label={`One more ${m.product.name}`}>
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[16px] num">{formatPrice(m.product.price * m.quantity)}</span>
        </div>
      </div>
      <button
        onClick={() => remove(m.product.id, m.size, m.color)}
        className="self-start w-11 h-11 -mr-2 flex items-center justify-center text-chrome-400 hover:text-ember-400"
        aria-label={`Remove ${m.product.name}`}
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </li>
  );
};
