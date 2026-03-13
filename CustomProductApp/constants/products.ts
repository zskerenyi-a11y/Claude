import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'blanket-001',
    name: 'Egyedi Takaró',
    category: 'blanket',
    basePrice: 12990,
    description: 'Puha, meleg polár takaró egyedi nyomtatással. Méretezható és mosható.',
    sizes: ['100x140cm', '130x170cm', '150x200cm'],
    colors: ['Fehér', 'Szürke', 'Krém', 'Fekete'],
    thumbnail: 'blanket',
    mockupTemplate: 'blanket-mockup',
  },
  {
    id: 'wall-art-001',
    name: 'Fali Kép',
    category: 'wall-art',
    basePrice: 8990,
    description: 'Prémium minőségű vászonra nyomtatott egyedi kép UV-álló tintával.',
    sizes: ['20x30cm', '30x40cm', '40x60cm', '50x70cm', '60x90cm'],
    colors: ['Natúr vászon'],
    thumbnail: 'wall-art',
    mockupTemplate: 'wall-art-mockup',
  },
  {
    id: 'mug-001',
    name: 'Egyedi Bögre',
    category: 'mug',
    basePrice: 3990,
    description: 'Kerámia bögre egyedi nyomtatással. Mosogatógép-álló, 330ml.',
    sizes: ['330ml', '420ml'],
    colors: ['Fehér', 'Fekete', 'Piros'],
    thumbnail: 'mug',
    mockupTemplate: 'mug-mockup',
  },
  {
    id: 'pillow-001',
    name: 'Egyedi Párna',
    category: 'pillow',
    basePrice: 5990,
    description: 'Dekorációs párnahuzat egyedi nyomtatással, cipzáras.',
    sizes: ['40x40cm', '50x50cm', '40x60cm'],
    colors: ['Fehér', 'Szürke'],
    thumbnail: 'pillow',
    mockupTemplate: 'pillow-mockup',
  },
  {
    id: 'tshirt-001',
    name: 'Egyedi Póló',
    category: 'tshirt',
    basePrice: 6990,
    description: '100% pamut póló egyedi nyomtatással, tartós digitális nyomással.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Fehér', 'Fekete', 'Szürke', 'Navy', 'Piros'],
    thumbnail: 'tshirt',
    mockupTemplate: 'tshirt-mockup',
  },
  {
    id: 'phone-case-001',
    name: 'Telefon Tok',
    category: 'phone-case',
    basePrice: 4490,
    description: 'Ütésálló telefontok egyedi nyomtatással.',
    sizes: ['iPhone 15', 'iPhone 15 Pro', 'Samsung Galaxy S24', 'Samsung Galaxy S24+'],
    colors: ['Áttetsző'],
    thumbnail: 'phone-case',
    mockupTemplate: 'phone-case-mockup',
  },
];

export const PRODUCT_ICONS: Record<string, string> = {
  blanket: '🛏️',
  'wall-art': '🖼️',
  mug: '☕',
  pillow: '🛋️',
  tshirt: '👕',
  'phone-case': '📱',
};

export const FONTS = [
  { label: 'Alapértelmezett', value: 'System' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
];

export const COLORS_PALETTE = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FF8C00', '#8B008B',
  '#006400', '#DC143C', '#4169E1', '#FF69B4', '#FFD700',
  '#A0522D', '#708090', '#2E8B57', '#FF6347', '#40E0D0',
];
