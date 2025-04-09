// src/hooks/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

interface CartState {
  items: CartItem[];
  lastAdded: number;
  
  addToCart: (item: Omit<CartItem, "quantity" | "note">) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateNote: (id: string, note: string) => void;
  setLastAdded: (time: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAdded: 0,

      // Métodos
      addToCart: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);

        const newItems = existingItem
          ? items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          : [...items, { ...item, quantity: 1 }];

        set({ items: newItems, lastAdded: Date.now() });
      },

      increaseQuantity: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        });
      },

      decreaseQuantity: (id) => {
        set({
          items: get().items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
            )
            .filter((item) => item.quantity > 0)
        });
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clearCart: () => set({ items: [] }),
      
      updateNote: (id, note) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, note } : item
          )
        });
      },

      setLastAdded: (time) => set({ lastAdded: time }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ 
        items: state.items 
      }) as Pick<CartState, "items">,
    }
  )
);