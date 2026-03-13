export type ProductCategory = 'blanket' | 'wall-art' | 'mug' | 'pillow' | 'tshirt' | 'phone-case';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  description: string;
  sizes: string[];
  colors: string[];
  thumbnail: string;
  mockupTemplate: string;
}

export interface TextLayer {
  id: string;
  type: 'text';
  content: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  x: number;
  y: number;
  rotation: number;
}

export interface ImageLayer {
  id: string;
  type: 'image';
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export type DesignLayer = TextLayer | ImageLayer;

export interface Design {
  backgroundColor: string;
  layers: DesignLayer[];
}

export interface CartItem {
  id: string;
  product: Product;
  design: Design;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}
