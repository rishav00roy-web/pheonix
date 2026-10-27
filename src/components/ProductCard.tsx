import React from 'react';
import type { Product } from '../data/products';
import { categoryLabel, formatAmount, pad2, PRODUCTS, smallShot } from '../data/products';
import { useCart } from '../lib/bag';
import { TLink } from '../lib/transition';
import { Crops } from './Editorial';
import { ArrowUpRightIcon } from './icons';

interface ProductCardProps {
  product: Product;
  /** Large tiles load the full-size photograph */
  large?: boolean;
  className?: string;
  /** First tiles on the page load at once */
  priority?: boolean;
}

// The second photograph only ever shows on hover, so touch screens never fetch it
const CAN_HOVER = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

// The specimen card from the original site: a dark card inside crop marks,
// the photograph printed on warm paper with its category tagged on it,
// "Inspect dossier" on hover, the name in the wordmark face, the specimen
// number in mono, the price in mono, and Acquire, which puts the first size
// and colour in the bag and opens it.
export const ProductCard: React.FC<ProductCardProps> = ({ product, large = false, className = '', priority = false }) => {
  const { add, open } = useCart();
  const [main, hoverShot] = product.gallery;
  const second = CAN_HOVER ? hoverShot : undefined;
  const src = (s: string) => (large ? s : smallShot(s));
  const no = pad2(PRODUCTS.indexOf(product) + 1);
  const href = `/p/${product.id}`;

  const acquire = () => {
    add(product, product.sizes[0], product.colors[0]?.name ?? '');
    open();
  };

  return (
    <article data-card className={`specimen group relative min-w-0 overflow-hidden rounded-card bg-obsidian-950 border border-bone-100/[0.08] hover:border-bone-100/25 transition-colors duration-500 ${className}`}>
      <Crops />

      {/* The photograph, its tag, and the way into the piece */}
      <div data-card-media data-reveal className="paper relative aspect-[3/4] overflow-hidden">
        <TLink to={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <img
            src={src(main)}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {second && (
            <span className="paper absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none">
              <img src={src(second)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            </span>
          )}
        </TLink>
        <span className="specimen-tag absolute top-4 left-4 pointer-events-none">{categoryLabel(product.category)}</span>
        <TLink to={href} aria-label={`Inspect dossier: ${product.name}`} className="specimen-inspect absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          Inspect dossier
          <ArrowUpRightIcon className="w-4 h-4" />
        </TLink>
      </div>

      {/* The name's link stretches over this whole block, so the tap target is
          the block, not one short line of type; Acquire sits above it */}
      <div className="relative p-4 sm:p-6 border-t border-bone-100/[0.06]">
        <h3 className="wordmark text-[17px] sm:text-[22px] leading-tight line-clamp-2 sm:line-clamp-1 group-hover:text-ember-400 transition-colors duration-300">
          <TLink to={href} className="after:absolute after:inset-0 after:content-['']">{product.name}</TLink>
        </h3>
        <p className="mt-2 mono-label text-chrome-400 num">Specimen {no}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Space Mono draws ₹ as a small raised mark, so the sign is set in the body face */}
          <p className="font-mono font-bold text-[16px] sm:text-[18px] tracking-wider num">
            <span className="font-sans font-semibold">₹</span>
            {formatAmount(product.price)}
          </p>
          <button type="button" onClick={acquire} className="specimen-acquire relative z-[1]" aria-label={`Acquire ${product.name}: add size ${product.sizes[0]} to the bag`}>
            Acquire
          </button>
        </div>
      </div>
    </article>
  );
};
