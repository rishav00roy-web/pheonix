import React from 'react';
import type { Product } from '../data/products';
import { categoryLabel, formatPrice, PRODUCTS, smallShot } from '../data/products';
import { useCart } from '../lib/bag';
import { TLink } from '../lib/transition';
import { ArrowUpRightIcon } from './icons';

interface ProductCardProps {
  product: Product;
  /** Large tiles load the full-size photograph */
  large?: boolean;
  className?: string;
  /** First tiles on the page load at once */
  priority?: boolean;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
/** The card's one-line tagline: the first sentence of the description */
const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0];

// The specimen card from the original site: a dark card inside crop marks,
// the specimen number and category tagged on the photograph, the number set
// large and faint in the corner, "Inspect dossier" on the photograph, the
// name in the wordmark face, a mono tagline, the price in mono, and Acquire,
// which puts the first size and colour in the bag and opens it.
export const ProductCard: React.FC<ProductCardProps> = ({ product, large = false, className = '', priority = false }) => {
  const { add, open } = useCart();
  const [main, second] = product.gallery;
  const src = (s: string) => (large ? s : smallShot(s));
  const no = pad2(PRODUCTS.indexOf(product) + 1);
  const href = `/p/${product.id}`;

  const acquire = () => {
    add(product, product.sizes[0], product.colors[0]?.name ?? '');
    open();
  };

  return (
    <article data-card className={`specimen group relative min-w-0 overflow-hidden rounded-card bg-obsidian-950 border border-bone-100/[0.08] hover:border-bone-100/25 transition-colors duration-500 ${className}`}>
      <span aria-hidden="true" className="crop crop-tl">┌</span>
      <span aria-hidden="true" className="crop crop-tr">┐</span>
      <span aria-hidden="true" className="crop crop-bl">└</span>
      <span aria-hidden="true" className="crop crop-br">┘</span>

      {/* The photograph, its tags, and the way into the piece */}
      <div data-card-media data-reveal className="relative aspect-[3/4] overflow-hidden bg-obsidian-900">
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
            <span className="absolute inset-0 bg-obsidian-900 opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none">
              <img src={src(second)} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            </span>
          )}
        </TLink>
        <span className="specimen-tag absolute top-3 left-3 sm:top-4 sm:left-4 pointer-events-none">
          Specimen {no}
          <span className="hidden sm:inline"> // {categoryLabel(product.category)}</span>
        </span>
        <span aria-hidden="true" className="specimen-no absolute top-2 right-3 sm:right-4 pointer-events-none">
          {no}
        </span>
        <TLink to={href} aria-label={`Inspect ${product.name}`} className="specimen-inspect absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
          Inspect dossier
          <ArrowUpRightIcon className="w-4 h-4" />
        </TLink>
      </div>

      <div className="p-4 sm:p-6 border-t border-bone-100/[0.06]">
        <h3 className="wordmark text-[17px] sm:text-[22px] leading-tight line-clamp-2 sm:line-clamp-1 group-hover:text-ember-400 transition-colors duration-300">
          <TLink to={href}>{product.name}</TLink>
        </h3>
        <p className="mt-2 mono-label text-chrome-400 truncate">{firstSentence(product.description)}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono font-bold text-[16px] sm:text-[18px] tracking-wider num">
            {formatPrice(product.price)} <span className="font-normal text-[12px] text-chrome-400">USD</span>
          </p>
          <button type="button" onClick={acquire} className="specimen-acquire" aria-label={`Acquire ${product.name}: add size ${product.sizes[0]} to the bag`}>
            Acquire
          </button>
        </div>
      </div>
    </article>
  );
};
