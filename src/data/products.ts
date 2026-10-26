// Single source of truth for the catalogue. Kept as plain serialisable data
// so the owner dashboard can later read / write it without touching UI code.
//
// Photographs live in /public/products/<id>/<n>.webp (1400px) with a
// <n>-sm.webp (720px) beside each one. They are retailer stand-ins for local
// preview only: see /public/products/SOURCES.md before anything goes public.

export type CategoryId = 'hoodies' | 'tees' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories';

export interface Edition {
  /** Next serial number to be allocated, shown as "No. 01 of 40" */
  serial: number;
  /** Total pieces in the edition */
  of: number;
  unit: string;
}

export interface Product {
  /** URL slug, also the photo folder name */
  id: string;
  name: string;
  category: CategoryId;
  /** Price in USD (whole dollars) */
  price: number;
  edition: Edition;
  /** One line on the cut, shown under the name */
  fit: string;
  description: string;
  /** Every angle, main shot first */
  gallery: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
}

const TOPS = ['S', 'M', 'L', 'XL', 'XXL'];
const WAIST = ['28', '30', '32', '34', '36'];
const SHOES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const ONE = ['One size'];

const shots = (id: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/products/${id}/${i + 1}.webp`);

export const PRODUCTS: Product[] = [
  {
    id: 'night-shift-hoodie',
    name: 'Night Shift Hoodie',
    category: 'hoodies',
    price: 89,
    edition: { serial: 1, of: 60, unit: 'pieces' },
    fit: 'Oversized, kangaroo pocket',
    description: 'A heavy black hoodie with nothing printed on it. Dropped shoulders, a deep hood and a pocket big enough for both hands.',
    gallery: shots('night-shift-hoodie', 5),
    colors: [{ name: 'Black', hex: '#111111' }],
    sizes: TOPS,
  },
  {
    id: 'fog-hoodie',
    name: 'Fog Hoodie',
    category: 'hoodies',
    price: 79,
    edition: { serial: 1, of: 80, unit: 'pieces' },
    fit: 'Oversized, drop shoulder',
    description: 'Washed navy-black fleece, cut long and loose. The everyday layer for cold mornings in the hills.',
    gallery: shots('fog-hoodie', 6),
    colors: [{ name: 'Navy black', hex: '#1a1c24' }],
    sizes: TOPS,
  },
  {
    id: 'postcard-hoodie',
    name: 'Postcard Hoodie',
    category: 'hoodies',
    price: 95,
    edition: { serial: 1, of: 50, unit: 'pieces' },
    fit: 'Oversized, back print',
    description: 'A faded city postcard printed across the back, a small mark on the chest. Brushed fleece inside.',
    gallery: shots('postcard-hoodie', 6),
    colors: [{ name: 'Black', hex: '#121212' }],
    sizes: TOPS,
  },
  {
    id: 'prism-patch-hoodie',
    name: 'Prism Patch Hoodie',
    category: 'hoodies',
    price: 109,
    edition: { serial: 1, of: 40, unit: 'pieces' },
    fit: 'Oversized, appliqué patch',
    description: 'One loud patch in stitched colour on a black body. Wear it with everything else quiet.',
    gallery: shots('prism-patch-hoodie', 6),
    colors: [{ name: 'Black', hex: '#101010' }],
    sizes: TOPS,
  },
  {
    id: 'layered-midnight-hoodie',
    name: 'Layered Midnight Hoodie',
    category: 'hoodies',
    price: 99,
    edition: { serial: 1, of: 40, unit: 'pieces' },
    fit: 'Boxy, built-in vest layer',
    description: 'A hoodie with a sleeveless panel sewn over the top, so it reads as two layers. Boxy and cropped at the hip.',
    gallery: shots('layered-midnight-hoodie', 4),
    colors: [{ name: 'Midnight', hex: '#161a24' }],
    sizes: TOPS,
  },
  {
    id: 'gold-fury-tee',
    name: 'Gold Fury Tee',
    category: 'tees',
    price: 45,
    edition: { serial: 1, of: 100, unit: 'pieces' },
    fit: 'Oversized, back print',
    description: 'Heavy cotton with a fighter in gold and black across the back. Half sleeves that fall past the elbow.',
    gallery: shots('gold-fury-tee', 1),
    colors: [{ name: 'Black', hex: '#0f0f0f' }],
    sizes: TOPS,
  },
  {
    id: 'horned-tee',
    name: 'Horned Tee',
    category: 'tees',
    price: 45,
    edition: { serial: 1, of: 100, unit: 'pieces' },
    fit: 'Oversized, back print',
    description: 'A red-eyed bull printed big on the back, the word on top in white. Drop shoulder, thick neck rib.',
    gallery: shots('horned-tee', 5),
    colors: [{ name: 'Black', hex: '#101010' }],
    sizes: TOPS,
  },
  {
    id: 'phoenix-rise-tee',
    name: 'Phoenix Rise Tee',
    category: 'tees',
    price: 55,
    edition: { serial: 1, of: 50, unit: 'pieces' },
    fit: 'Super oversized, front print',
    description: 'The bird the label is named for, rising in fire across the chest. The one white piece in the drop.',
    gallery: shots('phoenix-rise-tee', 6),
    colors: [{ name: 'Bone', hex: '#ece8df' }],
    sizes: TOPS,
  },
  {
    id: 'moon-thief-tee',
    name: 'Moon Thief Tee',
    category: 'tees',
    price: 42,
    edition: { serial: 1, of: 100, unit: 'pieces' },
    fit: 'Relaxed, back print',
    description: 'Navy cotton with soft cream lettering on the back and a small badge up front.',
    gallery: shots('moon-thief-tee', 5),
    colors: [{ name: 'Navy', hex: '#1b2233' }],
    sizes: TOPS,
  },
  {
    id: 'straw-hat-tee',
    name: 'Straw Hat Tee',
    category: 'tees',
    price: 49,
    edition: { serial: 1, of: 80, unit: 'pieces' },
    fit: 'Oversized, front print',
    description: 'A full-colour pirate print on black, with lettering stacked up the sleeve. For the anime crew.',
    gallery: shots('straw-hat-tee', 7),
    colors: [{ name: 'Black', hex: '#0f0f0f' }],
    sizes: TOPS,
  },
  {
    id: 'ash-wash-baggy-jeans',
    name: 'Ash Wash Baggy Jeans',
    category: 'bottoms',
    price: 85,
    edition: { serial: 1, of: 60, unit: 'pieces' },
    fit: 'Baggy, high rise',
    description: 'Black denim washed down to charcoal, with a wide leg that stacks over sneakers.',
    gallery: shots('ash-wash-baggy-jeans', 6),
    colors: [{ name: 'Washed black', hex: '#2a2a2c' }],
    sizes: WAIST,
  },
  {
    id: 'smoke-baggy-jeans',
    name: 'Smoke Baggy Jeans',
    category: 'bottoms',
    price: 79,
    edition: { serial: 1, of: 60, unit: 'pieces' },
    fit: 'Baggy, wide leg',
    description: 'Grey denim with a loose straight leg and a little whisker at the hip.',
    gallery: shots('smoke-baggy-jeans', 9),
    colors: [{ name: 'Smoke grey', hex: '#5d5f63' }],
    sizes: WAIST,
  },
  {
    id: 'nightfall-cargo',
    name: 'Nightfall Cargo',
    category: 'bottoms',
    price: 89,
    edition: { serial: 1, of: 50, unit: 'pieces' },
    fit: 'Relaxed, six pockets',
    description: 'Black twill cargos with flap pockets on both thighs. Straight through the knee, easy at the ankle.',
    gallery: shots('nightfall-cargo', 4),
    colors: [{ name: 'Black', hex: '#111111' }],
    sizes: WAIST,
  },
  {
    id: 'black-stone-cargo-denim',
    name: 'Black Stone Cargo Denim',
    category: 'bottoms',
    price: 95,
    edition: { serial: 1, of: 50, unit: 'pieces' },
    fit: 'Baggy, cargo pockets',
    description: 'Stone-washed black denim with cargo pockets, cut baggy enough to sit down in.',
    gallery: shots('black-stone-cargo-denim', 5),
    colors: [{ name: 'Black stone', hex: '#1d1f24' }],
    sizes: WAIST,
  },
  {
    id: 'letterman-varsity',
    name: 'Letterman Varsity',
    category: 'outerwear',
    price: 129,
    edition: { serial: 1, of: 40, unit: 'pieces' },
    fit: 'Regular, snap front',
    description: 'Black body, white sleeves, a chenille letter on the chest. Striped rib at the collar, cuffs and hem.',
    gallery: shots('letterman-varsity', 5),
    colors: [{ name: 'Black and white', hex: '#151515' }],
    sizes: TOPS,
  },
  {
    id: 'golden-age-varsity',
    name: 'Golden Age Varsity',
    category: 'outerwear',
    price: 159,
    edition: { serial: 1, of: 30, unit: 'pieces' },
    fit: 'Regular, embroidered',
    description: 'Wool body with faux-leather sleeves, covered in embroidered patches front and back. The heaviest jacket in the drop.',
    gallery: shots('golden-age-varsity', 7),
    colors: [{ name: 'Black', hex: '#121212' }],
    sizes: TOPS,
  },
  {
    id: 'midnight-utility-jacket',
    name: 'Midnight Utility Jacket',
    category: 'outerwear',
    price: 179,
    edition: { serial: 1, of: 30, unit: 'pieces' },
    fit: 'Boxy, padded, hooded',
    description: 'A padded black jacket with grey patch pockets and a fixed hood. Built for monsoon nights.',
    gallery: shots('midnight-utility-jacket', 9),
    colors: [{ name: 'Black and grey', hex: '#16171a' }],
    sizes: TOPS,
  },
  {
    id: 'retro-runner',
    name: 'Retro Runner',
    category: 'footwear',
    price: 95,
    edition: { serial: 1, of: 40, unit: 'pairs' },
    fit: 'Chunky sole, mesh upper',
    description: 'Black mesh and silver overlays on a thick, light sole. A runner shape made for walking all day.',
    gallery: shots('retro-runner', 2),
    colors: [{ name: 'Black and silver', hex: '#1a1a1a' }],
    sizes: SHOES,
  },
  {
    id: 'stud-platform-sneaker',
    name: 'Stud Platform Sneaker',
    category: 'footwear',
    price: 119,
    edition: { serial: 1, of: 30, unit: 'pairs' },
    fit: 'Platform sole, metal studs',
    description: 'All-black faux leather on a deep platform, with a row of metal studs down the side.',
    gallery: shots('stud-platform-sneaker', 2),
    colors: [{ name: 'Black', hex: '#0e0e0e' }],
    sizes: SHOES,
  },
  {
    id: 'scrawl-chunky-sneaker',
    name: 'Scrawl Chunky Sneaker',
    category: 'footwear',
    price: 109,
    edition: { serial: 1, of: 40, unit: 'pairs' },
    fit: 'Chunky sole, lace-up',
    description: 'A black chunky sneaker with white lines scrawled across the side, like a marker on a wall.',
    gallery: shots('scrawl-chunky-sneaker', 7),
    colors: [{ name: 'Black and white', hex: '#141414' }],
    sizes: SHOES,
  },
  {
    id: 'strap-high-top',
    name: 'Strap High-Top',
    category: 'footwear',
    price: 99,
    edition: { serial: 1, of: 40, unit: 'pairs' },
    fit: 'High-top, double strap',
    description: 'A black high-top closed with two wide straps instead of laces. On and off in a second.',
    gallery: shots('strap-high-top', 6),
    colors: [{ name: 'Black', hex: '#101010' }],
    sizes: SHOES,
  },
  {
    id: 'black-snapback',
    name: 'Black Snapback',
    category: 'accessories',
    price: 29,
    edition: { serial: 1, of: 120, unit: 'pieces' },
    fit: 'Flat brim, snap closure',
    description: 'A structured black cap with a white embroidered mark and a flat brim.',
    gallery: shots('black-snapback', 1),
    colors: [{ name: 'Black', hex: '#111111' }],
    sizes: ONE,
  },
  {
    id: 'blackout-cap',
    name: 'Blackout Cap',
    category: 'accessories',
    price: 32,
    edition: { serial: 1, of: 120, unit: 'pieces' },
    fit: 'Curved brim, adjustable',
    description: 'Black on black: a soft cotton cap with the mark embroidered in black thread.',
    gallery: shots('blackout-cap', 9),
    colors: [{ name: 'Black', hex: '#0d0d0d' }],
    sizes: ONE,
  },
  {
    id: 'orbit-sling',
    name: 'Orbit Sling',
    category: 'accessories',
    price: 39,
    edition: { serial: 1, of: 80, unit: 'pieces' },
    fit: 'Crossbody, adjustable strap',
    description: 'A curved black sling bag in recycled fabric. Phone, wallet and keys, worn across the chest.',
    gallery: shots('orbit-sling', 9),
    colors: [{ name: 'Black', hex: '#121212' }],
    sizes: ONE,
  },
];

/** The pieces the home page leads with, in order */
export const FEATURED_IDS = ['phoenix-rise-tee', 'midnight-utility-jacket', 'golden-age-varsity', 'scrawl-chunky-sneaker'];

const CATEGORY_LABELS: { id: 'all' | CategoryId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'tees', label: 'Tees' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
];

// Counts are derived from the data, so adding a product never needs a manual update
export const CATEGORIES = CATEGORY_LABELS.map((c) => ({
  ...c,
  count: c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length,
}));

export const categoryLabel = (id: CategoryId) => CATEGORY_LABELS.find((c) => c.id === id)?.label ?? id;

export const findProduct = (id: string | undefined) => PRODUCTS.find((p) => p.id === id);

/** The 720px copy of a gallery photograph, for grids and thumbnails */
export const smallShot = (src: string) => src.replace(/\.webp$/, '-sm.webp');

export const formatPrice = (usd: number) => `$${usd.toLocaleString('en-US')}`;

/** "No. 001 of 060 pieces": the edition line, numbered like a certificate */
const pad3 = (n: number) => String(n).padStart(3, '0');
export const formatEdition = (e: Edition) => `No. ${pad3(e.serial)} of ${pad3(e.of)} ${e.unit}`;

/** Shown in every piece's Shipping fold-out */
export const SHIPPING_NOTE = 'Orders are placed on WhatsApp. Shipping, cost and delivery time are agreed there before you pay.';
/** [Placeholder] shown in every piece's Care fold-out until care labels are supplied */
export const CARE_NOTE = '[Placeholder: washing and care instructions for this piece, from its label.]';
