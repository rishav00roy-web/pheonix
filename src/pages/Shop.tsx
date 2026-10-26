import React, { useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS, type CategoryId } from '../data/products';
import { STYLE_PLATE, photoSmall } from '../data/ajShield';
import { Flip, gsap, MOTION_OK, prefersReducedMotion, queueRefresh, ScrollTrigger, useGSAP } from '../lib/smoothScroll';
import { entranceDelay } from '../lib/pageTransition';
import { TLink } from '../lib/transition';
import { SplitText } from '../components/SplitText';
import { Crops, Rule } from '../components/Editorial';
import { ProductCard } from '../components/ProductCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

type Filter = 'all' | CategoryId;
const isFilter = (v: string | null): v is Filter => !!v && CATEGORIES.some((c) => c.id === v);

// Every ninth tile in the visible run is a feature tile, two columns by two rows
const isFeature = (position: number) => position % 9 === 0;
const pad2 = (n: number) => String(n).padStart(2, '0');
// "All" counts every piece, so the categories are the rest
const KINDS = CATEGORIES.length - 1;

export const Shop: React.FC = () => {
  useDocumentTitle(
    'Shop',
    'Hoodies, tees, bottoms, outerwear, footwear and accessories from different streetwear brands, picked in AJ Shield’s style. Order on WhatsApp.'
  );
  const [params, setParams] = useSearchParams();
  const raw = params.get('cat');
  const cat: Filter = isFilter(raw) ? raw : 'all';
  const scope = useRef<HTMLDivElement>(null);
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
        // The opening, as on AJ's page: the plate wipes open, the rule draws,
        // the lines under the headline rise in
        const d = entranceDelay();
        gsap.fromTo('[data-shop-plate]', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut', delay: d });
        gsap.from('.rule', { scaleX: 0, duration: 1.2, ease: 'power3.inOut', delay: d + 0.5 });
        gsap.from('[data-intro]', { y: 16, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, delay: d + 0.6 });

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
    <div ref={scope}>
      <section aria-labelledby="shop-title" className="frame pt-10 pb-14 lg:pt-16 lg:pb-20">
        <div className="grid-12 gap-y-10 items-center">
          <div className="lg:col-span-7">
            <p data-intro className="mono-label text-chrome-400">The rail · Jorhat, Assam</p>
            <SplitText as="h1" id="shop-title" play="load" text="The collection" className="mt-6 headline text-[clamp(56px,8vw,128px)] leading-[0.95]" />
            <Rule className="mt-8" />
            <p data-intro className="mt-8 max-w-[34ch] text-[clamp(18px,1.6vw,22px)]">
              Different brands on one rail, each piece picked in AJ Shield’s style.
            </p>
            <div data-intro className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
              <TLink to="/aj-shield" className="text-link">
                Her story
              </TLink>
              <p className="mono-label text-chrome-400 num">
                {pad2(PRODUCTS.length)} pieces · {pad2(KINDS)} categories
              </p>
            </div>
          </div>

          {/* Her plate: the style the rail is picked in */}
          <figure className="hidden md:block relative md:w-1/2 lg:w-auto lg:col-start-10 lg:col-span-3 border border-bone-100/[0.08] p-3 sm:p-4 bg-obsidian-950">
            <Crops />
            <div data-shop-plate className="relative aspect-[4/5] overflow-hidden bg-obsidian-900">
              <img
                src={photoSmall(STYLE_PLATE)}
                width={STYLE_PLATE.width}
                height={STYLE_PLATE.height}
                alt={STYLE_PLATE.alt}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 mono-label text-chrome-400">
              <span>AJ Shield</span>
              <span>In her style</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-label="Pieces" className="pb-[var(--section)]">
        {/* Filter: an index of the rail that sticks to the top for the length of the grid */}
        <div className="sticky top-0 z-30 bg-void/90 backdrop-blur-md border-y border-obsidian-700">
          <div className="frame flex items-center justify-between gap-6">
            <ul className="flex gap-5 lg:gap-9 overflow-x-auto no-scrollbar -mx-1 px-1 pr-3" aria-label="Filter by category">
              {CATEGORIES.map((c) => (
                <li key={c.id} className="shrink-0">
                  <button onClick={() => choose(c.id)} aria-pressed={c.id === cat} className="rail-tab">
                    {c.label}
                    <span className="rail-count num">{pad2(c.count)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="hidden md:block shrink-0 mono-label text-chrome-400 num" aria-live="polite">
              {pad2(current.count)} {cat === 'all' ? 'pieces' : current.label.toLowerCase()}
            </p>
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
    </div>
  );
};
