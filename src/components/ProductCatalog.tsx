import React, { useState } from 'react';
import type { Product } from '../data/products';
import { CATEGORIES } from '../data/products';
import { LayoutGrid, Rows3, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAcquire: (product: Product, size: string, color: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickAcquire
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'editorial'>('grid');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="collection-catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
      {/* Catalog Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-ember-400 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Autumn / Winter 2026 Collection</span>
          </div>
          <h2 className="font-syne font-bold text-2xl sm:text-4xl text-white uppercase tracking-tight">
            The Wardrobe
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Showing {filteredProducts.length} of {products.length} bespoke pieces
          </p>
        </div>

        {/* View Mode Toggle: Grid (2-col mobile) vs Editorial (1-col full) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/[0.02]">
            <button
              onClick={() => {
                soundManager.playClick();
                setLayoutMode('grid');
              }}
              className={`p-1.5 sm:px-3 sm:py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                layoutMode === 'grid'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-500 hover:text-white'
              }`}
              title="Grid View (Compact)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setLayoutMode('editorial');
              }}
              className={`p-1.5 sm:px-3 sm:py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                layoutMode === 'editorial'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-500 hover:text-white'
              }`}
              title="Editorial View (Full)"
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editorial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-4">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                onSelectCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-all border ${
                isActive
                  ? 'border-white bg-white text-black font-bold shadow-lg'
                  : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/30'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          );
        })}
      </div>

      {/* Product Display: Grid or Editorial */}
      {layoutMode === 'grid' ? (
        /* 2 COLUMNS ON MOBILE, 3-4 COLUMNS ON DESKTOP */
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                soundManager.playClick();
                onSelectProduct(product);
              }}
              className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-obsidian-950/80 overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/30 hover:shadow-2xl"
            >
              {/* Product Thumbnail Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-obsidian-900">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Corner Code Tag */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/15 text-zinc-300">
                    {product.code}
                  </span>
                </div>

                {/* Mobile Tap Cue */}
                <div className="absolute bottom-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider bg-white text-black font-bold shadow-md">
                    Inspect +
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                <div>
                  <h3 className="font-syne font-bold text-xs sm:text-sm text-white group-hover:text-ember-300 transition-colors uppercase line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider line-clamp-1 mt-0.5">
                    {product.tagline}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    ${product.price}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      onQuickAcquire(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Obsidian');
                    }}
                    className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/20 text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all font-bold"
                  >
                    Acquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* EDITORIAL FULL-WIDTH LIST */
        <div className="space-y-12 sm:space-y-16">
          {filteredProducts.map((product, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={product.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectProduct(product);
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center p-4 sm:p-8 rounded-3xl border border-white/[0.08] bg-obsidian-950/50 backdrop-blur-md cursor-pointer group hover:border-white/30 transition-all"
              >
                {/* Visual */}
                <div className={`md:col-span-6 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden bg-obsidian-900 border border-white/10 relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Details */}
                <div className={`md:col-span-6 ${isEven ? 'md:order-2' : 'md:order-1'} space-y-4`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ember-400 font-bold block mb-1">
                      {product.code} // {product.categoryLabel}
                    </span>
                    <h3 className="font-syne font-bold text-xl sm:text-3xl text-white uppercase tracking-tight group-hover:text-ember-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mt-1">
                      {product.edition}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {product.description}
                  </p>

                  <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-1 text-xs font-mono text-zinc-400">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Composition:</span>
                    {product.materials.slice(0, 3).map((m, i) => (
                      <div key={i}>• {m}</div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="font-mono text-xl font-bold text-white">
                        ${product.price}
                      </div>
                      <div className="text-[9px] font-mono text-zinc-500 uppercase">
                        USD • Atelier Delivery
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClick();
                        onQuickAcquire(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Obsidian');
                      }}
                      className="px-6 py-3 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-ember-500 hover:text-white transition-all shadow-lg"
                    >
                      Acquire Artefact
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
