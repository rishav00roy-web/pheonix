import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { formatPostDate, pad2, photoSrc, photoSrcSet, type AjPhoto } from '../data/ajShield';
import { gsap, prefersReducedMotion, setScrollLocked } from '../lib/smoothScroll';
import { ArrowLeftIcon, ArrowUpRightIcon, CloseIcon } from './icons';

interface PlateViewerProps {
  plates: AjPhoto[];
  /** Index of the open plate, or null when the viewer is shut */
  index: number | null;
  /** Number printed on the first plate (the portrait above is plate 01) */
  firstNo: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

// The full-screen viewer for the lookbook: fades in on void like the bag
// slides in, arrows and swipes step through the plates, Escape closes, and
// focus stays inside until it returns to the plate that opened it.
export const PlateViewer: React.FC<PlateViewerProps> = ({ index, ...rest }) => {
  const open = index !== null;
  const [shown, setShown] = useState<number | null>(index);
  const onClosed = useCallback(() => setShown(null), []);
  // Opening mounts at once; closing waits for the fade
  if (open && shown !== index) setShown(index);

  useEffect(() => {
    setScrollLocked(open, 'plate-viewer');
    return () => setScrollLocked(false, 'plate-viewer');
  }, [open]);

  return shown === null ? null : <Viewer open={open} index={shown} onClosed={onClosed} {...rest} />;
};

const Viewer: React.FC<Omit<PlateViewerProps, 'index'> & { open: boolean; index: number; onClosed: () => void }> = ({
  plates,
  index,
  firstNo,
  open,
  onIndex,
  onClose,
  onClosed,
}) => {
  const root = useRef<HTMLDivElement>(null);
  const figure = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const plate = plates[index];
  const count = plates.length;
  const step = useCallback((d: number) => onIndex((index + d + count) % count), [index, count, onIndex]);

  // Fade in on open, out on close, then unmount
  useLayoutEffect(() => {
    const t = prefersReducedMotion ? 0 : 1;
    if (open) gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 * t, ease: 'power2.out' });
    else gsap.to(root.current, { autoAlpha: 0, duration: 0.3 * t, ease: 'power2.in', onComplete: onClosed });
  }, [open, onClosed]);

  // Each new plate settles in from a short drift
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    gsap.fromTo(figure.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }, [index]);

  // Focus moves in and returns to the opener; Escape closes, arrows step, Tab stays inside
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab' && root.current) {
        const items = Array.from(root.current.querySelectorAll<HTMLElement>('button, a[href]'));
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, step]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
  };

  const no = pad2(firstNo + index);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] bg-void flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Plate ${no} of the lookbook`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="frame shrink-0 h-16 lg:h-20 flex items-center justify-between gap-4 border-b border-obsidian-700">
        <p className="mono-label text-chrome-400 num" aria-live="polite">
          Plate {no} <span className="text-bone-100/40">/ {pad2(firstNo + count - 1)}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="w-12 h-12 -mr-2 flex items-center justify-center hover:bg-bone-100 hover:text-void transition-colors duration-300"
          aria-label="Close the viewer"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 lg:px-24 py-4">
        <figure ref={figure} className="relative h-full w-full flex flex-col items-center justify-center gap-3">
          <img
            key={plate.id}
            src={photoSrc(plate)}
            srcSet={photoSrcSet(plate)}
            sizes="100vw"
            width={plate.width}
            height={plate.height}
            alt={plate.alt}
            className="min-h-0 max-h-full max-w-full w-auto h-auto object-contain"
            draggable={false}
          />
          <figcaption className="shrink-0 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[14px] text-chrome-400">
            {plate.date && <span className="num">Posted {formatPostDate(plate.date)}</span>}
            {plate.post && (
              <a href={plate.post} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 min-h-11 hover:text-ember-400 transition-colors">
                View the post <ArrowUpRightIcon className="w-4 h-4" />
              </a>
            )}
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={() => step(-1)}
          className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-void/70 border border-obsidian-700 hover:border-bone-100 transition-colors"
          aria-label="Previous plate"
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-void/70 border border-obsidian-700 hover:border-bone-100 transition-colors"
          aria-label="Next plate"
        >
          <ArrowLeftIcon className="w-5 h-5 rotate-180" />
        </button>
      </div>
    </div>
  );
};
