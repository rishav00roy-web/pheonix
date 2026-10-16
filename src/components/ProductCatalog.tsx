import React, { useState } from 'react';
import type { Product } from '../data/products';
import { CATEGORIES } from '../data/products';
import { LayoutGrid, List, Sparkles, ArrowUpRight } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'plates' | 'ledger'>('plates');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section id="collection-catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28">
      {/* Editorial Centered Header Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pb-8 mb-10 border-b border-white/[0.08]">
        <div className="inline-flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-ember-400">
          <Sparkles className="w-3 h-3" />
          <span>Autumn / Winter 2026 Collection</span>
        </div>
        <h2 className="font-nistha text-3xl sm:text-5xl text-white uppercase tracking-tight">
          The Wardrobe
        </h2>
        <p className="text-xs text-zinc-400 font-mono tracking-widest">
          Displaying {filteredProducts.length} of {products.length} Numbered Garment Artefacts
        </p>

        {/* View Mode Toggle: Runway Plates vs Atelier Ledger (Centered & Sharp) */}
        <div className="inline-flex items-center gap-1 p-1 border border-white/15 bg-black/60 backdrop-blur-md font-mono text-[10px] uppercase tracking-wider mx-auto mt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode('plates');
            }}
            className={`px-4 py-1.5 flex items-center gap-1.5 transition-all ${
              viewMode === 'plates'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Runway Plates</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setViewMode('ledger');
            }}
            className={`px-4 py-1.5 flex items-center gap-1.5 transition-all ${
              viewMode === 'ledger'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Atelier Ledger</span>
          </button>
        </div>
      </div>

      {/* Category Navigation (Fully Centered Across All Viewports) */}
      <div className="flex items-center justify-center flex-wrap gap-2 pb-8 mb-8 max-w-4xl mx-auto text-center">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                onSelectCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all border shrink-0 ${
                isActive
                  ? 'border-white bg-white text-black font-bold shadow-md'
                  : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white hover:border-white/30'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          );
        })}
      </div>

      {/* View Mode 1: Runway Plates (Editorial Asymmetry, Clean Frames, Rack Focus) */}
      {viewMode === 'plates' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {filteredProducts.map((product, idx) => (
            <article
              key={product.id}
              onClick={() => {
                soundManager.playClick();
                onSelectProduct(product);
              }}
              className="group relative cursor-pointer border border-white/[0.08] hover:border-white/25 bg-black/40 backdrop-blur-sm transition-all duration-500 overflow-hidden"
            >
              {/* Corner Crop Marks (Director Viewfinder from Cinematic UI) */}
              <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">┌</div>
              <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">┐</div>
              <div className="absolute bottom-2 left-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">└</div>
              <div className="absolute bottom-2 right-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">┘</div>

              {/* Ghosted Specimen Number */}
              <div className="absolute top-3 right-4 z-10 font-syne font-black text-4xl sm:text-5xl text-white/[0.06] select-none pointer-events-none group-hover:text-ember-500/20 transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Medium Format Portrait Visual */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center filter brightness-90 contrast-110 transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-100 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                {/* Sub-Category Chip */}
                <div className="absolute top-3.5 left-4 z-10">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400 bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10">
                    {product.code} // {product.categoryLabel}
                  </span>
                </div>

                {/* Hover Quick Inspect Action */}
                <div className="absolute bottom-3 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-mono text-[9px] uppercase tracking-widest font-bold shadow-2xl">
                    <span>Inspect Dossier</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Garment Details & Material Callout */}
              <div className="p-5 sm:p-6 space-y-3 border-t border-white/[0.06]">
                <div className="space-y-1">
                  <h3 className="font-nistha text-sm sm:text-base text-white uppercase group-hover:text-ember-300 transition-colors line-clamp-1 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest line-clamp-1">
                    {product.tagline}
                  </p>
                </div>

                {/* Material Composition Line */}
                <div className="text-[10px] font-mono text-zinc-500 border-t border-white/[0.04] pt-2 line-clamp-1">
                  {product.materials[0]}
                </div>

                {/* Valuation & Instant Allocation */}
                <div className="flex items-center justify-between pt-2">
                  <div className="font-mono text-sm sm:text-base font-bold text-white tracking-wider">
                    ${product.price} <span className="text-[9px] text-zinc-500 font-normal">USD</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      onQuickAcquire(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Obsidian');
                    }}
                    className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 border border-white/20 text-zinc-300 hover:text-white hover:border-white hover:bg-white/10 transition-all font-bold"
                  >
                    Acquire
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* View Mode 2: Atelier Ledger (Brutalist Haute Couture Inventory List) */
        <div className="border border-white/[0.08] bg-black/40 backdrop-blur-md divide-y divide-white/[0.08]">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 bg-white/[0.02]">
            <span className="col-span-1">Ref</span>
            <span className="col-span-4">Silhouette & Tagline</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-3">Material Composition</span>
            <span className="col-span-1">Valuation</span>
            <span className="col-span-1 text-right">Action</span>
          </div>

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                soundManager.playClick();
                onSelectProduct(product);
              }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 sm:px-6 sm:py-5 hover:bg-white/[0.02] cursor-pointer transition-colors"
            >
              {/* Ref Code */}
              <div className="md:col-span-1 font-mono text-xs text-zinc-500 font-bold group-hover:text-ember-400 transition-colors">
                {product.code}
              </div>

              {/* Silhouette Name */}
              <div className="md:col-span-4 flex items-center gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-12 object-cover object-center bg-zinc-900 border border-white/10 shrink-0 filter brightness-90 group-hover:brightness-105 transition-all"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-nistha text-sm text-white group-hover:text-ember-300 uppercase transition-colors">
                    {product.name}
                  </h4>
                  <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest line-clamp-1">
                    {product.tagline}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="md:col-span-2 font-mono text-xs text-zinc-400 uppercase tracking-wider">
                {product.categoryLabel}
              </div>

              {/* Material Composition */}
              <div className="md:col-span-3 font-mono text-[11px] text-zinc-500 line-clamp-1">
                {product.materials.slice(0, 2).join(' • ')}
              </div>

              {/* Valuation */}
              <div className="md:col-span-1 font-mono text-sm font-bold text-white">
                ${product.price}
              </div>

              {/* Action */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    onQuickAcquire(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Obsidian');
                  }}
                  className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider border border-white/20 text-zinc-300 hover:text-black hover:bg-white hover:border-white transition-all font-bold"
                >
                  Acquire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
