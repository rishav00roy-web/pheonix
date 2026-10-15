import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ManifestItem } from '../types';
import { soundManager } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: ManifestItem[];
  onUpdateQuantity: (id: string, size: string, color: string, qty: number) => void;
  onRemoveItem: (id: string, size: string, color: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [manifestCode, setManifestCode] = useState('');

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    soundManager.playChime();
    setIsProcessing(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff441f', '#ffffff', '#1e293b']
      });
    } catch {}

    setTimeout(() => {
      setManifestCode(`PHX-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsProcessing(false);
      setOrderComplete(true);
      onClearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-obsidian-950 text-white border-l border-white/10 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/brand-logo.png"
              alt="Pheonix Seal"
              className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            />
            <div>
              <span className="font-syne font-bold text-base tracking-widest uppercase text-white block">
                Acquisition Manifest
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Atelier Vault Allocation
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            aria-label="Close manifest"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {orderComplete ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <img
                src="/brand-logo.png"
                alt="Pheonix Seal"
                className="w-20 h-auto object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.45)] mx-auto mb-3"
              />
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="font-syne font-bold text-xl uppercase tracking-wide">
                Artefact Allocation Locked
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-2">
                Your pieces are assigned to private courier dispatch.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] font-mono text-xs w-full">
              <span className="text-zinc-500 block mb-1">Manifest Reference</span>
              <span className="text-ember-400 font-bold text-sm tracking-widest">{manifestCode}</span>
            </div>
            <button
              onClick={() => {
                setOrderComplete(false);
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-ember-500 hover:text-white transition-all"
            >
              Return to Collection
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3 font-mono">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              [ NO SPECIMENS IN VAULT ]
            </span>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-full border border-white/20 text-xs text-white uppercase tracking-widest hover:border-white transition-all"
            >
              Browse Wardrobe
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
                  className="flex gap-4 p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.01]"
                >
                  <div className="w-16 h-20 rounded-xl overflow-hidden bg-obsidian-900 shrink-0 border border-white/10">
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-syne font-bold text-xs text-white uppercase line-clamp-1">
                          {item.product.name}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.size, item.color)}
                          className="text-zinc-600 hover:text-red-400 transition-colors"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-1">
                        Size: {item.size} • Color: {item.color}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 border border-white/10 rounded-lg px-2 py-0.5 bg-white/5 text-xs font-mono">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="font-mono text-xs font-bold text-white">
                        ${item.product.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations & Submit */}
            <div className="p-6 border-t border-white/10 bg-obsidian-950 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>COURIER DISPATCH</span>
                <span className="text-zinc-400">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/[0.08]">
                <span>TOTAL DUE</span>
                <span>${total} USD</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full mt-2 py-4 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-[0.2em] hover:bg-ember-500 hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                {isProcessing ? 'CONFIRMING ALLOCATION...' : 'LOCK ACQUISITION'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
