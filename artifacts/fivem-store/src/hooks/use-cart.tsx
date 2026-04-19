import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Script } from '@workspace/api-client-react';

export interface CartItem {
  scriptId: number;
  script: Script;
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (script: Script) => void;
  removeItem: (scriptId: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (script) => set((state) => {
        if (state.items.find(item => item.scriptId === script.id)) {
          return state; // Already in cart
        }
        return { 
          items: [...state.items, { scriptId: script.id, script, price: script.price }],
          total: get().total + script.price
        };
      }),
      removeItem: (scriptId) => set((state) => {
        const itemToRemove = state.items.find(item => item.scriptId === scriptId);
        if (!itemToRemove) return state;
        return {
          items: state.items.filter(item => item.scriptId !== scriptId),
          total: state.total - itemToRemove.price
        };
      }),
      clearCart: () => set({ items: [], total: 0 }),
      total: 0,
    }),
    {
      name: 'fivem-store-cart',
    }
  )
);
