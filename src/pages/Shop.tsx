import React, { useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS, type CategoryId } from '../data/products';
import { Flip, gsap, MOTION_OK, prefersReducedMotion, queueRefresh, ScrollTrigger, useGSAP } from '../lib/smoothScroll';
import { SplitText } from '../components/SplitText';
import { ProductCard } from '../components/ProductCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type Filter = 'all' | CategoryId;
const isFilter = (v: string | null): v is Filter => !!v && CATEGORIES.some((c) => c.id === v);

// Every ninth tile in the visible run is a feature tile, two columns by two rows
const isFeature = (position: number) => position % 9 === 0;

export const Shop: React.FC = () => {
  useDocumentTitle('Shop');
  const [params, setParams] = useSearchParams();
  const raw = params.get('cat');
  const cat: Filter = isFilter(raw) ? raw : 'all';
  const scope = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = PRODUCTS.filter((p) => cat === 'all' || p.category === cat);
  const position = new Map(visible.map((p, i) => [p.id, i]));
  const current = CATEGORIES.find((c) => c.id === cat)!;

  const choose = (id: Filter) => {
    if (id === cat) return;
    if (!prefersReducedMotion && scope.current) {
      flipState.current = Flip.getState(scope.current.querySelectorAll('[data-tile]'));
    }
    setParams(id === 'all' ? {} : { cat: id }, { preventScrollReset: true });
  };

  // The grid re-flows into the new filter: tiles glide to their new places,
  // leavers shrink out, arrivals grow in
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.7,
      ease: 'power3.inOut',
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.25 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.35 }),
      onComplete: () => queueRefresh(0),
    });
  }, [cat]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Tiles rise in as they reach the viewport
        ScrollTrigger.batch('[data-tile] [data-card]', {
          start: 'top 92%',
          once: true,
          onEnter: (batch) => gsap.from(batch, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08 }),
        });
      });
    },
    { scope }
  );

  return (
    <>
      <section aria-label="Shop" className="relative">
        <div className="frame pt-16 lg:pt-24 pb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <SplitText as="h1" play="load" text="The collection" className="headline text-[clamp(48px,7vw,112px)]" />
          <p className="eyebrow text-chrome-400 mb-3" aria-live="polite">
            {current.count} {cat === 'all' ? 'pieces' : current.label.toLowerCase()}
          </p>
        </div>
      </section>

      <section ref={scope} aria-label="Pieces" className="pb-[var(--section)]">
        {/* Filter bar: sticks under the nav for the length of the grid */}
        <div className="sticky top-0 z-30 bg-void border-y border-obsidian-700">
          <div className="frame">
            <ul className="flex gap-3 overflow-x-auto no-scrollbar py-3 -mx-1 px-1 pr-3" aria-label="Filter by category">
              {CATEGORIES.map((c) => {
                const active = c.id === cat;
                return (
                  <li key={c.id} className="shrink-0">
                    <button
                      onClick={() => choose(c.id)}
                      aria-pressed={active}
                      className={`h-11 px-4 flex items-center gap-2 eyebrow border transition-colors duration-300
                                  ${active ? 'bg-bone-100 text-void border-bone-100' : 'border-obsidian-700 hover:border-bone-100'}`}
                    >
                      {c.label}
                      <span className="num">{c.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div data-grid className="frame mt-8 lg:mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-10 sm:gap-y-14 grid-flow-row-dense">
          {PRODUCTS.map((p) => {
            const pos = position.get(p.id);
            const shown = pos !== undefined;
            const feature = shown && isFeature(pos);
            return (
              <div
                key={p.id}
                data-tile
                data-flip-id={p.id}
                className={`${shown ? '' : 'hidden'} min-w-0 ${feature ? 'col-span-2 md:row-span-2' : ''}`}
              >
                <ProductCard product={p} large={feature} priority={shown && pos < 3} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
