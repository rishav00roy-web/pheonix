import React, { useState } from 'react';
import { X, Check, Shield, Sparkles } from 'lucide-react';
import type { Product } from '../data/products';
import { soundManager } from '../utils/audio';

interface DossierSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAcquire: (product: Product, size: string, color: string) => void;
}

export const DossierSheet: React.FC<DossierSheetProps> = ({
  product,
  isOpen,
  onClose,
  onAcquire
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Obsidian');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    soundManager.playClick();
    onAcquire(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-0 sm:p-4">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Technical Dossier Sheet */}
      <div className="relative w-full max-w-xl max-h-[92vh] bg-obsidian-950 text-white border-t sm:border border-white/20 shadow-2xl overflow-y-auto p-5 sm:p-8 z-10 space-y-5">
        
        {/* Top Handle & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.12]">
          <div className="flex items-center gap-2.5">
            <img
              src="/brand-logo.png"
              alt="Pheonix Seal"
              className="w-5 h-5 object-contain opacity-90 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            />
            <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-300 uppercase font-bold">
              [ SPECIMEN DOSSIER // {product.code} ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-white/20 hover:bg-white hover:text-black text-zinc-400 transition-all ml-auto"
            aria-label="Close dossier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Garment Visual Banner with Viewfinder Crop Marks */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-zinc-950 border border-white/10">
          <div className="absolute top-2 left-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">┌</div>
          <div className="absolute top-2 right-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">┐</div>
          <div className="absolute bottom-2 left-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">└</div>
          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-zinc-600 pointer-events-none z-20">┘</div>

          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4">
            <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-ember-400" />
              {product.code} // {product.categoryLabel}
            </span>
          </div>
        </div>

        {/* Title & Valuation */}
        <div className="space-y-1">
          <h2 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
            {product.name}
          </h2>
          <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
            {product.edition}
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-white pt-1">
            ${product.price} <span className="text-xs text-zinc-500 font-normal">USD • Insured Courier Dispatch Included</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
          {product.description}
        </p>

        {/* Colorway / Finish */}
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
            Finish / Shade: <span className="text-white font-bold">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`px-3 py-1.5 border text-xs font-mono transition-all flex items-center gap-2 ${
                  selectedColor === c.name
                    ? 'border-white bg-white/15 text-white font-bold'
                    : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white hover:border-white/25'
                }`}
              >
                <span className="w-2.5 h-2.5" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sizing Matrix */}
        <div>
          <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
            Select Size
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`py-2 px-4 border text-xs font-mono uppercase transition-all ${
                  selectedSize === s
                    ? 'border-white bg-white text-black font-bold shadow-md'
                    : 'border-white/15 bg-black/40 text-zinc-300 hover:border-white/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Composition Ledger */}
        <div className="p-3.5 border border-white/10 bg-black/40 space-y-1 text-xs font-mono text-zinc-400">
          <span className="text-[10px] uppercase text-zinc-500 block tracking-widest">
            Atelier Technical Composition:
          </span>
          {product.materials.map((m, i) => (
            <div key={i}>• {m}</div>
          ))}
        </div>

        {/* Bottom Acquisition Action */}
        <div className="pt-2">
          <button
            onClick={handleAdd}
            className={`w-full py-4 font-mono font-bold text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 border ${
              added
                ? 'border-emerald-500 bg-emerald-500 text-black'
                : 'border-white bg-white text-black hover:bg-ember-500 hover:border-ember-500 hover:text-white shadow-xl'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added To Vault
              </>
            ) : (
              <>Acquire Artefact • ${product.price} USD</>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500 mt-2.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Cryptographically Numbered Certificate Included</span>
          </div>
        </div>

      </div>
    </div>
  );
};
