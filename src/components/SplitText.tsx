import React, { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../lib/smoothScroll';
import { entranceDelay } from '../lib/pageTransition';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface SplitTextProps {
  text: string;
  as?: Tag;
  className?: string;
  /** 'load' plays once the page is in; 'scroll' plays as it enters the viewport */
  play?: 'load' | 'scroll';
  /** Seconds between one line and the next */
  stagger?: number;
  id?: string;
}

// Headline that rises line by line: every word sits in its own clip, words
// that share a line rise together, and each line follows the one above.
// Screen readers get the plain text. Without motion the text simply stands.
export const SplitText: React.FC<SplitTextProps> = ({ text, as = 'h2', className = '', play = 'scroll', stagger = 0.14, id }) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = Array.from(ref.current?.querySelectorAll<HTMLElement>('.split-word') ?? []);
        if (!words.length) return;
        // Group words by the line they landed on
        const lines: HTMLElement[][] = [];
        let top: number | null = null;
        words.forEach((w) => {
          const t = (w.parentElement as HTMLElement).offsetTop;
          if (top === null || Math.abs(t - top) > 4) {
            lines.push([]);
            top = t;
          }
          lines[lines.length - 1].push(w);
        });
        const tl = gsap.timeline({
          delay: play === 'load' ? entranceDelay() : 0,
          scrollTrigger: play === 'scroll' ? { trigger: ref.current, start: 'top 88%', once: true } : undefined,
        });
        lines.forEach((line, i) => tl.from(line, { yPercent: 110, duration: 1.2, ease: 'power4.out' }, i * stagger));
      });
    },
    { scope: ref }
  );

  const Tag = as as React.ElementType;
  const words = text.split(' ');
  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span aria-hidden="true" className="split-clip">
            <span className="split-word">{w}</span>
          </span>
          {wi < words.length - 1 && <span aria-hidden="true"> </span>}
        </React.Fragment>
      ))}
    </Tag>
  );
};
