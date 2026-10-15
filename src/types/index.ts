import type { Product } from '../data/products';

export type { Product };

export interface ManifestItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}
