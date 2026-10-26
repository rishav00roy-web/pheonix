import { createContext, useContext } from 'react';
import { formatPrice, type Product } from '../data/products';

// The bag's shape, its context and the WhatsApp order helpers. The provider
// that holds the state lives in cart.tsx.

const WHATSAPP_NUMBER = '60017633352';

/** One line in the bag: a piece in one size and colour, and how many. */
export interface BagLine {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface CartApi {
  items: BagLine[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, size: string, color: string) => void;
  remove: (id: string, size: string, color: string) => void;
  setQuantity: (id: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  announcement: string;
}

export const CartContext = createContext<CartApi | null>(null);

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error('useCart outside CartProvider');
  return c;
}

/** The pre-filled WhatsApp order: one line per bag line, then total and reference. */
export function buildOrderMessage(items: BagLine[], total: number, ref: string) {
  const lines = items.map(
    (m, i) =>
      `${i + 1}. ${m.product.name} | Size ${m.size}${m.color ? ` | ${m.color}` : ''} | x${m.quantity} | ${formatPrice(m.product.price * m.quantity)}`
  );
  return [`Hello PHEONIX, I would like to order:`, '', ...lines, '', `Total: ${formatPrice(total)}`, `Reference: ${ref}`].join('\n');
}

export const whatsappLink = (text?: string) => `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
