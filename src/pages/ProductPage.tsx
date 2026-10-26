import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CARE_NOTE, categoryLabel, findProduct, formatEdition, formatPrice, PRODUCTS, SHIPPING_NOTE, smallShot, type Product } from '../data/products';
import { useCart, whatsappLink } from '../lib/bag';
import { gsap, MOTION_OK, scrollToTarget, useGSAP } from '../lib/smoothScroll';
import { TLink } from '../lib/transition';
import { entranceDelay } from '../lib/pageTransition';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeftIcon, PlusIcon, WhatsAppIcon } from '../components/icons';
import { BrandLogo } from '../components/BrandLogo';
import { Crops, Rule } from '../components/Editorial';
import { SplitText } from '../components/SplitText';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { NotFound } from './NotFound';

export const ProductPage: React.FC = () => {
  const { slug } = useParams();
  const product = findProduct(slug);
  if (!product) return <NotFound what="piece" />;
  // Keyed so that moving between pieces starts each one fresh
  return <Piece key={product.id} product={product} />;
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const Piece: React.FC<{ product: Product }> = ({ product }) => {
  const scope = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const { add, open } = useCart();
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [color, setColor] = useState(product.colors[0]?.name ?? '');
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const [slide, setSlide] = useState(0);
  const count = product.gallery.length;
  const no = pad2(PRODUCTS.indexOf(product) + 1);

  useDocumentTitle(product.name, `${product.description} ${formatPrice(product.price)}, ordered on WhatsApp.`);

  // Phone gallery: keep the counter in step with the swiped photograph
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSlide(Number((e.target as HTMLElement).dataset.i))),
      { root: el, threshold: 0.6 }
    );
    el.querySelectorAll('[data-i]').forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [product.id]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const d = entranceDelay();
        gsap.from('[data-info] > *', { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06, delay: d + 0.15 });
        gsap.from('[data-info] .rule', { scaleX: 0, duration: 1.2, ease: 'power3.inOut', delay: d + 0.4 });
        // Each photograph in the desktop stack wipes open as it arrives
        gsap.utils.toArray<HTMLElement>('[data-stack-shot]').forEach((el, i) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              ease: 'power4.inOut',
              delay: i === 0 ? d : 0,
              scrollTrigger: i === 0 ? undefined : { trigger: el, start: 'top 85%', once: true },
            }
          );
          gsap.fromTo(
            el.querySelector('img'),
            { scale: 1.2 },
            { scale: 1, duration: 1.6, ease: 'power3.out', delay: i === 0 ? d : 0, scrollTrigger: i === 0 ? undefined : { trigger: el, start: 'top 85%', once: true } }
          );
        });
      });
    },
    { scope }
  );

  const goToSlide = (i: number) => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const handleAdd = () => {
    if (!size) {
      setNeedSize(true);
      return;
    }
    add(product, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const ask = whatsappLink(`Hello PHEONIX, I have a question about the ${product.name}${size ? ` in size ${size}` : ''}.`);
  const more = [...PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id), ...PRODUCTS.filter((p) => p.category !== product.category)].slice(0, 4);

  return (
    <div ref={scope}>
      <div className="frame pt-4 lg:pt-6">
        <TLink to="/shop" className="inline-flex items-center gap-3 h-12 eyebrow text-chrome-400 hover:text-ember-400 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to the shop
        </TLink>
      </div>

      <div className="lg:frame lg:grid lg:grid-cols-12 lg:gap-x-8 mt-2 lg:mt-4">
        {/* ── Photographs ─────────────────────────────────────────────── */}
        <div className="lg:col-span-7 lg:grid lg:grid-cols-[72px_minmax(0,1fr)] lg:gap-x-5">
          {/* Desktop: thumbnail rail that follows the stack */}
          {count > 1 && (
            <ul className="hidden lg:flex flex-col gap-3 sticky top-6 self-start" aria-label="Jump to a photograph">
              {product.gallery.map((src, i) => (
                <li key={src}>
                  <button
                    onClick={() => scrollToTarget(`shot-${i}`, -88)}
                    className="paper block w-[72px] aspect-[4/5] overflow-hidden border border-transparent hover:border-bone-100 transition-colors duration-300"
                    aria-label={`Photograph ${i + 1} of ${count}`}
                  >
                    <img src={smallShot(src)} alt="" className="w-full h-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Desktop: every angle, stacked, each framed as a numbered plate */}
          <div className="hidden lg:flex flex-col gap-6">
            {product.gallery.map((src, i) => (
              <figure key={src} id={`shot-${i}`} className="relative border border-bone-100/[0.08] p-4 bg-obsidian-950">
                <Crops />
                <div data-stack-shot className="paper relative overflow-hidden aspect-[4/5]">
                  <img
                    src={src}
                    alt={i === 0 ? product.name : `${product.name}, photograph ${i + 1} of ${count}`}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 flex justify-between gap-4 mono-label text-chrome-400 num">
                  <span>Plate {pad2(i + 1)}</span>
                  <span>of {pad2(count)}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Phones and tablets: swipe, with a counter and thumbnails */}
          <div className="lg:hidden">
            <div ref={strip} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar" aria-label={`${product.name} photographs`}>
              {product.gallery.map((src, i) => (
                <div key={src} data-i={i} className="paper snap-start shrink-0 w-full md:w-[60%] aspect-[4/5]">
                  <img
                    src={src}
                    alt={i === 0 ? product.name : `${product.name}, photograph ${i + 1} of ${count}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {count > 1 && (
              <div className="frame mt-3 flex items-center gap-4">
                <p className="mono-label text-chrome-400 num shrink-0" aria-live="polite">
                  {pad2(slide + 1)} / {pad2(count)}
                </p>
                <ul className="flex gap-2 overflow-x-auto no-scrollbar">
                  {product.gallery.map((src, i) => (
                    <li key={src} className="shrink-0">
                      <button
                        onClick={() => goToSlide(i)}
                        aria-label={`Show photograph ${i + 1} of ${count}`}
                        aria-current={slide === i ? 'true' : undefined}
                        className={`paper block w-11 h-14 overflow-hidden border transition-colors ${slide === i ? 'border-bone-100' : 'border-transparent opacity-60'}`}
                      >
                        <img src={smallShot(src)} alt="" className="w-full h-full object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── Details: sticky beside the photographs on desktop ─────────── */}
        <div className="frame lg:px-0 lg:col-span-5 mt-8 lg:mt-0">
          <div data-info className="lg:sticky lg:top-6 space-y-6">
            {/* The specimen line doubles as the breadcrumb back to its rail */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 mono-label text-chrome-400 num">
              <span>Specimen {no}</span>
              <span aria-hidden="true">//</span>
              <TLink to={`/shop?cat=${product.category}`} className="inline-flex items-center min-h-11 hover:text-ember-400 transition-colors">
                {categoryLabel(product.category)}
              </TLink>
            </nav>
            <h1 className="headline text-[clamp(44px,5vw,80px)] leading-[0.98] !mt-2">{product.name}</h1>
            <Rule />
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
              <p className="headline text-[clamp(30px,2.6vw,38px)] num">{formatPrice(product.price)}</p>
              <p className="flex items-center gap-3 mono-label text-chrome-400 num">
                <BrandLogo small className="h-6 w-auto" />
                {formatEdition(product.edition)}
              </p>
            </div>
            <p className="text-[17px] leading-relaxed max-w-[46ch]">{product.description}</p>
            <p className="text-[16px] text-chrome-400">{product.fit}</p>

            {product.colors.length > 0 && (
              <fieldset>
                <legend className="mono-label text-chrome-400">Colour: <span className="text-bone-100">{color}</span></legend>
                {product.colors.length > 1 && (
                  <div className="mt-3 flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setColor(c.name)}
                        aria-pressed={color === c.name}
                        aria-label={c.name}
                        className={`w-12 h-12 p-1 border-2 transition-colors ${color === c.name ? 'border-bone-100' : 'border-obsidian-700'}`}
                      >
                        <span className="block w-full h-full" style={{ backgroundColor: c.hex }} />
                      </button>
                    ))}
                  </div>
                )}
              </fieldset>
            )}

            <fieldset>
              <legend className={`mono-label ${needSize && !size ? 'text-ember-400' : 'text-chrome-400'}`}>
                {needSize && !size ? 'Pick a size first' : 'Size'}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      setNeedSize(false);
                    }}
                    aria-pressed={size === s}
                    className={`min-w-12 h-12 px-4 text-[16px] border transition-colors duration-300
                                ${size === s ? 'bg-bone-100 text-void border-bone-100' : 'border-obsidian-700 hover:border-bone-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleAdd} className="btn btn-primary flex-1">
                {added ? 'Added to your bag' : 'Add to bag'}
              </button>
              <a href={ask} target="_blank" rel="noopener noreferrer" aria-label="Ask on WhatsApp (opens in a new tab)" className="btn btn-line">
                <WhatsAppIcon />
                Ask on WhatsApp
              </a>
            </div>
            {added && (
              <button onClick={open} className="text-link">
                Open the bag and order
              </button>
            )}

            <div className="border-t border-obsidian-700 !mt-10">
              <Fold title="Details">
                <p>{product.fit}.</p>
                <p className="mt-2 num">{formatEdition(product.edition)}.</p>
                {product.colors.length > 0 && <p className="mt-2">Colour: {product.colors.map((c) => c.name).join(', ')}.</p>}
                <p className="mt-2">Sizes: {product.sizes.join(', ')}.</p>
              </Fold>
              <Fold title="Care">{CARE_NOTE}</Fold>
              <Fold title="Shipping">{SHIPPING_NOTE}</Fold>
            </div>
          </div>
        </div>
      </div>

      {/* More pieces */}
      <section aria-labelledby="more-title" className="frame mt-[var(--section)] pb-[var(--section)] border-t border-obsidian-700 pt-[var(--section)]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SplitText id="more-title" text="More from the rail" className="headline text-[clamp(40px,5.2vw,80px)]" />
          <TLink to="/shop" className="text-link mb-2">
            View all pieces
          </TLink>
        </div>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-10">
          {more.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

/** A fold-out under a hairline: native details/summary, keyboard and reader friendly.
    The title is set in the headline face; its plus turns into a cross when open. */
const Fold: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="fold group border-b border-obsidian-700">
    <summary className="min-h-16 flex items-center justify-between gap-4 cursor-pointer list-none headline text-[22px] hover:text-ember-400 transition-colors duration-300">
      {title}
      <PlusIcon className="w-5 h-5 text-chrome-400 transition-transform duration-500 group-open:rotate-45 motion-reduce:transition-none" />
    </summary>
    <div className="pb-6 text-[15px] leading-relaxed text-chrome-400 max-w-[46ch]">{children}</div>
  </details>
);
