import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product } from '../data/products';
import { CartContext, type BagLine, type CartApi } from './bag';

const BAG_KEY = 'pheonix_manifest_v2';

const same = (m: BagLine, id: string, size: string, color: string) => m.product.id === id && m.size === size && m.color === color;

function loadBag(): BagLine[] {
  try {
    const saved = JSON.parse(localStorage.getItem(BAG_KEY) ?? '[]') as BagLine[];
    // Drop lines saved against products that are no longer in the catalogue
    return Array.isArray(saved) ? saved.filter((m) => Array.isArray(m?.product?.gallery)) : [];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BagLine[]>(loadBag);
  const [isOpen, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable: the bag lasts for this visit only
    }
  }, [items]);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const add = useCallback((product: Product, size: string, color: string) => {
    setAnnouncement(`${product.name}, size ${size}, added to your bag.`);
    setItems((prev) => {
      const i = prev.findIndex((m) => same(m, product.id, size, color));
      if (i > -1) return prev.map((m, j) => (j === i ? { ...m, quantity: m.quantity + 1 } : m));
      return [...prev, { product, size, color, quantity: 1 }];
    });
  }, []);
  const remove = useCallback((id: string, size: string, color: string) => setItems((prev) => prev.filter((m) => !same(m, id, size, color))), []);
  const setQuantity = useCallback(
    (id: string, size: string, color: string, qty: number) =>
      setItems((prev) =>
        qty <= 0 ? prev.filter((m) => !same(m, id, size, color)) : prev.map((m) => (same(m, id, size, color) ? { ...m, quantity: qty } : m))
      ),
    []
  );
  const clear = useCallback(() => setItems([]), []);

  const api = useMemo<CartApi>(
    () => ({ items, count: items.reduce((n, m) => n + m.quantity, 0), isOpen, open, close, add, remove, setQuantity, clear, announcement }),
    [items, isOpen, open, close, add, remove, setQuantity, clear, announcement]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
};

