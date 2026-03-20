import type { Product } from './products';

// Simple cart using React context pattern
export type CartItem = {
  product: Product;
  quantity: number;
};

let cartItems: CartItem[] = [];
let listeners: (() => void)[] = [];

const notifyListeners = () => listeners.forEach(l => l());

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return cartItems;
  },
  addItem(product: Product) {
    const existing = cartItems.find(i => i.product.id === product.id);
    if (existing) {
      cartItems = cartItems.map(i =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      cartItems = [...cartItems, { product, quantity: 1 }];
    }
    notifyListeners();
  },
  removeItem(productId: string) {
    cartItems = cartItems.filter(i => i.product.id !== productId);
    notifyListeners();
  },
  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      cartStore.removeItem(productId);
      return;
    }
    cartItems = cartItems.map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    notifyListeners();
  },
  getTotal() {
    return cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },
  getCount() {
    return cartItems.reduce((sum, i) => sum + i.quantity, 0);
  },
  clear() {
    cartItems = [];
    notifyListeners();
  },
};
