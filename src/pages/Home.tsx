import React, { useRef } from 'react';
import { FEATURED_IDS, findProduct, smallShot, type CategoryId, type Product } from '../data/products';
import { BRAND } from '../data/brand';
import { gsap, MOTION_OK, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/smoothScroll';
import { TLink } from '../lib/transition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SplitText } from '../components/SplitText';
import { ProductCard } from '../components/ProductCard';
import { BrandLogo } from '../components/BrandLogo';
import Hero from '../components/Hero';

const FEATURED = FEATURED_IDS.map((id) => findProduct(id)).filter((p): p is Product => !!p);

// The three doors into the shop, each shown by one of its pieces
const DOORS: { cat: CategoryId; label: string; piece: string }[] = [
  { cat: 'outerwear', label: 'Outerwear', piece: 'letterman-varsity' },
  { cat: 'hoodies', label: 'Hoodies', piece: 'night-shift-hoodie' },
  { cat: 'footwear', label: 'Footwear', piece: 'retro-runner' },
];

export const Home: React.FC = () => {
  useDocumentTitle(null);
  const scope = useRef<HTMLDivElement>(null);

  // Images open like a curtain as they arrive; copy settles in under them
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-fade]').forEach((el) => {
          gsap.from(el, { y: 24, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        });
      });
    },
    { scope }
  );

  // The slim header appears once the hero has scrolled away, and leaves when it returns
  useGSAP(
    () => {
      const header = '[data-home-header]';
      const t = prefersReducedMotion ? 0 : 0.4;
      gsap.set(header, { autoAlpha: 0, yPercent: -100 });
      ScrollTrigger.create({
        trigger: '#hero-section',
        start: 'bottom top+=1',
        onEnter: () => gsap.to(header, { autoAlpha: 1, yPercent: 0, duration: t, ease: 'power3.out' }),
        onLeaveBack: () => gsap.to(header, { autoAlpha: 0, yPercent: -100, duration: t, ease: 'power3.in' }),
      });
    },
    { scope }
  );

  return (
    <div ref={scope}>
      <HomeHeader />
      <div id="hero-section">
        <Hero />
      </div>
      <Edit />
      <Statement />
      <Doors />
    </div>
  );
};

/** Home's slim header, fixed at the top once the hero has gone: the crest and the wordmark. */
function HomeHeader() {
  return (
    <header data-home-header className="fixed top-0 inset-x-0 z-50 bg-void border-b border-obsidian-700">
      <div className="frame h-[var(--mast-h)] flex items-center justify-center">
        <TLink to="/" className="min-h-11 flex items-center gap-3 lg:gap-4 px-2" aria-label="Pheonix, home">
          <BrandLogo small className="h-8 lg:h-10 w-auto" />
          <span className="wordmark pt-1 text-[28px] lg:text-[34px]">Pheonix</span>
        </TLink>
      </div>
    </header>
  );
}

/** The four pieces the house leads with: one large, three set around it. */
function Edit() {
  const [lead, ...rest] = FEATURED;
  return (
    <section id="the-edit" aria-labelledby="edit-title" className="section">
      <div className="frame">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-12 lg:gap-y-16">
          <li className="col-span-2 lg:col-span-6 lg:row-span-2">
            {lead && <ProductCard product={lead} large />}
          </li>
          <li className="order-first lg:order-none col-span-2 lg:col-span-4 lg:col-start-8 lg:self-start">
            <SplitText id="edit-title" text="The edit" className="headline text-[clamp(44px,5.6vw,88px)]" />
            <p data-fade className="mt-5 max-w-[34ch] text-chrome-400">
              Four pieces the house is wearing now, from a numbered run.
            </p>
            <div data-fade className="mt-6">
              <TLink to="/shop" className="text-link">
                View all pieces
              </TLink>
            </div>
          </li>
          {rest.map((p, i) => (
            <li
              key={p.id}
              className={
                i === 0
                  ? 'lg:col-span-3 lg:col-start-8 lg:self-end'
                  : i === 1
                    ? 'lg:col-span-3 lg:col-start-2'
                    : 'col-span-2 lg:col-span-3 lg:col-start-6 lg:mt-16'
              }
            >
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The house's own words, set large; each word brightens as the reader reaches it. */
function Statement() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-word]',
          { color: 'rgb(var(--chrome-400-rgb))' },
          { color: 'rgb(var(--bone-100-rgb))', ease: 'none', stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } }
        );
      });
    },
    { scope: ref }
  );
  return (
    <section ref={ref} aria-label="About the house" className="section border-t border-obsidian-700">
      <div className="frame grid-12">
        <p className="headline lg:col-span-10 lg:col-start-2 text-[clamp(30px,3.8vw,58px)] leading-[1.18]">
          {BRAND.bio.split(' ').map((w, i) => (
            <span key={i} data-word>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/** Three category doors into the shop. */
function Doors() {
  return (
    <section aria-labelledby="doors-title" className="section border-t border-obsidian-700">
      <div className="frame">
        <SplitText id="doors-title" text="Browse by category" className="headline text-[clamp(40px,5.2vw,80px)]" />
        <ul className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
          {DOORS.map((d) => {
            const p = findProduct(d.piece);
            return (
              <li key={d.cat}>
                <TLink to={`/shop?cat=${d.cat}`} className="group block">
                  <div data-reveal className="relative aspect-[4/3] overflow-hidden bg-obsidian-900">
                    {p && <img src={smallShot(p.gallery[0])} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-obsidian-700 group-hover:border-bone-100 pb-4 transition-colors duration-300">
                    <h3 className="headline text-[28px] lg:text-[32px]">{d.label}</h3>
                    <span className="text-[15px] text-chrome-400 group-hover:text-ember-400 transition-colors duration-300">Explore</span>
                  </div>
                </TLink>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
