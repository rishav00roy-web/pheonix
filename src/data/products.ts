export interface Product {
  id: string;
  code: string;
  name: string;
  category: 'outerwear' | 'tops' | 'dresses' | 'trousers' | 'footwear' | 'accessories';
  categoryLabel: string;
  price: number;
  edition: string;
  tagline: string;
  materials: string[];
  description: string;
  imageUrl: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'vortex-trench',
    code: 'SPECIMEN 01',
    name: 'Vortex Asymmetric Storm Trench',
    category: 'outerwear',
    categoryLabel: 'Outerwear',
    price: 1120,
    edition: 'Edition of 40 Units',
    tagline: 'Sculptural wingback pleats in water-repellent memory gabardine',
    materials: [
      'Heavyweight 450gsm Memory Gabardine',
      'Origami Back Canopy Pleating',
      'Cold-Forged Gunmetal Hardware',
      'Japanese Cupro Jacquard Lining'
    ],
    description:
      'Engineered with an exaggerated cowl lapel that ascends into an architectural storm neck, falling into deep accordion wingback pleats that flare dramatically with your stride.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Basalt Black', hex: '#0a0a0d' },
      { name: 'Ash Bone', hex: '#ded6c7' }
    ],
    sizes: ['1 (S)', '2 (M)', '3 (L)']
  },
  {
    id: 'vertebral-biker',
    code: 'SPECIMEN 02',
    name: 'Vertebral Embossed Moto Jacket',
    category: 'outerwear',
    categoryLabel: 'Outerwear',
    price: 1650,
    edition: 'Edition of 18 Bespoke Pieces',
    tagline: 'High-frequency heat-molded spinal column down center back',
    materials: [
      'Full-Grain Vegetable-Tanned Italian Calfskin',
      '3D Molded Anatomical Spine Ridge',
      'Dual Offset Industrial Raccagni Zips',
      'Hand-Burnished Waxed Edges'
    ],
    description:
      'A fierce revision of the motorcycle jacket. The posterior spine features thermo-molded leather relief echoing an anatomical vertebral column, running from collar to lumbar hem.',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Washed Charcoal', hex: '#111216' },
      { name: 'Oxblood Void', hex: '#3b0d0c' }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'cocoon-bomber',
    code: 'SPECIMEN 03',
    name: 'Basalt Cocoon Sculpted Bomber',
    category: 'outerwear',
    categoryLabel: 'Outerwear',
    price: 880,
    edition: 'Edition of 50 Pieces',
    tagline: 'Thermal-reactive memory nylon with exaggerated curved shoulders',
    materials: [
      'High-Density Memory Nylon Shell',
      'Insulated Thermal Down Fill',
      'Chunky Nickel Two-Way Zip',
      'Seamless Bonded Cuffs'
    ],
    description:
      'Architectural cocoon silhouette that holds its sculpted volume. Features dropped rounded shoulders and concealed internal harness straps to wear draped off-shoulder.',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Obsidian Black', hex: '#070709' },
      { name: 'Smoked Lead', hex: '#334155' }
    ],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'liquid-column-gown',
    code: 'SPECIMEN 04',
    name: 'Liquid Obsidian Column Gown',
    category: 'dresses',
    categoryLabel: 'Dresses',
    price: 890,
    edition: 'Edition of 30 Pieces',
    tagline: 'Molten metallic jersey with internal cantilever hip boning',
    materials: [
      'Liquid-Gloss Micro-Modal Stretch Jersey',
      'Internal Cantilever Hip Bone Wire',
      'Asymmetric Left Thigh Slash',
      'Floor Sweep Train'
    ],
    description:
      'Fluid like molten glass. An asymmetric evening dress made from heavyweight wet-look viscose jersey that cascades diagonally across the torso into a razor-sharp thigh slit.',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Pitch Obsidian', hex: '#08080a' },
      { name: 'Deep Crimson', hex: '#450a0a' }
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'carapace-corset-dress',
    code: 'SPECIMEN 05',
    name: 'Carapace Structured Corset Mini',
    category: 'dresses',
    categoryLabel: 'Dresses',
    price: 940,
    edition: 'Edition of 20 Units',
    tagline: 'Exoskeleton molded ribcage bodice with micro-pleated skirt',
    materials: [
      'Molded Carapace Exoskeleton Bustier',
      'Micro-Knife Pleated Technical Organza',
      'Internal Flexible Steel Boning',
      'Exposed Industrial Back Zip'
    ],
    description:
      'An avant-garde balance of rigid armor and airy romance. Features a sculpted external carapace that hugs the waist, contrasting against a layered micro-pleated floating skirt.',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Monolith Black', hex: '#050507' },
      { name: 'Silver Mist', hex: '#94a3b8' }
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'phoenix-ash-knit',
    code: 'SPECIMEN 06',
    name: 'Ash Rebirth Deconstructed Mohair',
    category: 'tops',
    categoryLabel: 'Tops & Knits',
    price: 520,
    edition: 'Edition of 60 Pieces',
    tagline: 'Laddered open-weave kid mohair spun with metallic silver thread',
    materials: [
      '62% Italian Superkid Mohair',
      '28% Virgin Wool',
      '10% Metallic Silver Filament',
      'Hand-Frayed Raw Edge Hem'
    ],
    description:
      'Hand-loomed in Italy with an open spider-web knit structure. Intentionally laddered and distressed to evoke plumage rising from cooling embers, with elongated knuckle-grazing sleeves.',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Smoked Charcoal', hex: '#16171d' },
      { name: 'Ember Crimson', hex: '#581816' },
      { name: 'Frost Bone', hex: '#e3ddd3' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'hydra-cutout-top',
    code: 'SPECIMEN 07',
    name: 'Hydra Anatomical Cut-Out Top',
    category: 'tops',
    categoryLabel: 'Tops & Knits',
    price: 340,
    edition: 'Edition of 75 Pieces',
    tagline: 'Compression second-skin jersey with reinforced ribcage voids',
    materials: [
      '78% Recycled Polyamide',
      '22% High-Recovery Elastane',
      'Laser-Ablated Apertures',
      'Mock Funnel Neckline'
    ],
    description:
      'Second-skin sculpting top spliced with precise laser-cut voids that trace the intercostal ribcage. High mock neck with thumb-loop cuffs for a streamlined silhouette.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Pitch Void', hex: '#08080a' },
      { name: 'Alabaster Bone', hex: '#f0ece3' }
    ],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'chitin-cowl-hoodie',
    code: 'SPECIMEN 08',
    name: 'Chitin Architectural Cowl Hoodie',
    category: 'tops',
    categoryLabel: 'Tops & Knits',
    price: 420,
    edition: 'Edition of 50 Pieces',
    tagline: '520gsm structured French terry with angular structured cowl hood',
    materials: [
      '520gsm Heavyweight Organic French Terry',
      'Angular Overlapping Cowl Collar',
      'Concealed Thumb Slits',
      'Articulated Darted Elbows'
    ],
    description:
      'Imposing monolith hoodie. The exaggerated architectural cowl stands independently around the face or drapes gracefully over the collarbones.',
    imageUrl: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Washed Basalt', hex: '#1c1c24' },
      { name: 'Pitch Black', hex: '#0a0a0c' }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'mantis-modular-cargo',
    code: 'SPECIMEN 09',
    name: 'Mantis Geometric Modular Trousers',
    category: 'trousers',
    categoryLabel: 'Trousers',
    price: 490,
    edition: 'Edition of 45 Units',
    tagline: 'Cordura ripstop trousers with magnetic kinetic pocket flaps',
    materials: [
      '65% High-Density Cotton Twill',
      '35% Cordura Nylon Ripstop',
      'Fidlock-Style Magnetic Enclosures',
      'Ankle Bungee Cinch Toggles'
    ],
    description:
      'Engineered for fluid motion. Multi-panel trousers cut with curved ergonomic inseams, 3D angular bellow cargo compartments, and quick-pull ankle toggles to switch from wide-leg to parachute fit.',
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Void Black', hex: '#0a0a0d' },
      { name: 'Basalt Charcoal', hex: '#2a2c33' }
    ],
    sizes: ['28-30 (S)', '31-33 (M)', '34-36 (L)', '38 (XL)']
  },
  {
    id: 'vertebral-split-denim',
    code: 'SPECIMEN 10',
    name: 'Vertebral Slit Flared Denim',
    category: 'trousers',
    categoryLabel: 'Trousers',
    price: 420,
    edition: 'Edition of 60 Pieces',
    tagline: '14oz Japanese selvedge with posterior ankle snap vents',
    materials: [
      '14oz Japanese Ring-Spun Cotton Selvedge',
      'Rear Calf Laser-Etched Rib Contours',
      'Oxidized Matte Rivets',
      'Double-Chainstitch Hem'
    ],
    description:
      'Low-slung relaxed denim that stacks effortlessly over boots or heels. The rear calves feature laser-etched anatomical ribbing and snap vents that allow the flare to open dramatically.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Vintage Basalt Black', hex: '#1c1e24' },
      { name: 'Raw Obsidian Indigo', hex: '#0f172a' }
    ],
    sizes: ['28', '30', '32', '34', '36']
  },
  {
    id: 'leviathan-lug-boot',
    code: 'SPECIMEN 11',
    name: 'Leviathan Vertebral Platform Boot',
    category: 'footwear',
    categoryLabel: 'Footwear',
    price: 880,
    edition: 'Edition of 35 Pairs',
    tagline: '70mm monolithic blown-rubber lug platform with spinal notches',
    materials: [
      'Heavy-Duty Oiled Box Calfskin',
      '70mm Segmented Spinal Lug Tread',
      'Dual Branded Grosgrain Pull-Loops',
      'Shock-Damping Orthopedic Footbed'
    ],
    description:
      'Monolithic presence. Set on a 70mm lightweight lugged sole featuring segmented spinal notches that flex naturally with the foot, finished in durable oiled calf leather.',
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Matte Obsidian', hex: '#090a0d' },
      { name: 'Oxide Grey', hex: '#374151' }
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '44']
  },
  {
    id: 'chimera-maw-stiletto',
    code: 'SPECIMEN 12',
    name: 'The Chimera Maw Stilettos',
    category: 'footwear',
    categoryLabel: 'Footwear',
    price: 1480,
    edition: 'Edition of 25 Numbered Pairs',
    tagline: 'Predatory monster jaw rear heel in obsidian patent & titanium',
    materials: [
      'Italian Obsidian Patent Calfskin',
      'Articulating Titanium Monster Jaws & Fangs',
      'Crimson Micro-Suede Velvet Throat Cushion',
      '105mm Carbon-Reinforced Heel Shaft'
    ],
    description:
      'The house’s conversation piece. A razor stiletto punctuated at the heel by an articulating predatory monster jaw with surgical titanium fangs and crimson velvet lining.',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Obsidian Gloss', hex: '#0a0a0c' },
      { name: 'Blood Chrome', hex: '#7f1d1d' },
      { name: 'Bleached Bone', hex: '#e8e2d5' }
    ],
    sizes: ['36', '37', '38', '39', '40', '41']
  },
  {
    id: 'molten-spine-harness',
    code: 'SPECIMEN 13',
    name: 'Molten Spine Leather Chest Harness',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 340,
    edition: 'Edition of 50 Pieces',
    tagline: 'Modular Belgian saddle leather harness with cast molten chrome rings',
    materials: [
      'Full-Grain Belgian Saddle Leather',
      'Cast Liquid-Chrome Hardware',
      'Hand-Burnished Beveled Edges',
      'Triple Roller-Pin Buckle Latches'
    ],
    description:
      'An architectural body harness designed to be layered over oversized hoodies, button-downs, or sheer gowns to instantly create a sculpted, anatomical posture.',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Nocturne Black / Chrome', hex: '#0a0a0c' },
      { name: 'Tan Bone / Brass', hex: '#a89f91' }
    ],
    sizes: ['Size 1 (XS-M)', 'Size 2 (L-XXL)']
  },
  {
    id: 'eclipse-insectoid-shades',
    code: 'SPECIMEN 14',
    name: 'Eclipse Insectoid Chrome Shades',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 280,
    edition: 'Edition of 80 Units',
    tagline: 'Monolithic aerodynamic rimless wrap shield with titanium temples',
    materials: [
      'UV400 Optical Polycarbonate Shield',
      'Cast Titanium Ergonomic Temples',
      'Hypoallergenic Silicone Nose Bridge',
      'Magnetic Hard Shell Case'
    ],
    description:
      'Ultra-futuristic wrap lenses evoking compound insectoid optics. Continuous rimless face shield with flash mirror coating that rests weightlessly on the brow.',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Smoke Black / Chrome', hex: '#111215' },
      { name: 'Oil Slick Iridescent', hex: '#233831' }
    ],
    sizes: ['One Size (Universal Fit)']
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Artefacts', count: 14 },
  { id: 'outerwear', label: 'Outerwear', count: 3 },
  { id: 'tops', label: 'Knits & Tops', count: 3 },
  { id: 'dresses', label: 'Column Dresses', count: 2 },
  { id: 'trousers', label: 'Trousers', count: 2 },
  { id: 'footwear', label: 'Footwear', count: 2 },
  { id: 'accessories', label: 'Accessories', count: 2 },
];
