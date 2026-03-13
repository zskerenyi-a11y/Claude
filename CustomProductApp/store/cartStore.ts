import { create } from 'zustand';
import { CartItem, Design, Order, ShippingAddress } from '../constants/types';

interface CartStore {
  items: CartItem[];
  orders: Order[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: ShippingAddress) => Order;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orders: [],

  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }));
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  placeOrder: (shippingAddress) => {
    const { items } = get();
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      totalPrice: get().totalPrice(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress,
    };
    set((state) => ({
      orders: [...state.orders, order],
      items: [],
    }));
    return order;
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
}));
