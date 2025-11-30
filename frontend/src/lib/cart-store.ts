import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  product: any; // Full product object for display
  variantId?: string;
  variant?: any; // Full variant object for display
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  isCartSheetOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  openCartSheet: () => void;
  closeCartSheet: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartSheetOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItemIndex > -1) {
          // Update quantity if item exists
          const newItems = [...items];
          newItems[existingItemIndex].quantity += item.quantity;
          set({ items: newItems, isCartSheetOpen: true }); // Auto-open sheet
        } else {
          // Add new item
          // Generate a unique ID for the new cart item
          const id = `${item.productId}-${item.variantId || 'no-variant'}-${Date.now()}`;
          set({ items: [...items, { ...item, id }], isCartSheetOpen: true }); // Auto-open sheet
        }
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        });
      },

      updateQuantity: (productId, quantity, variantId) => {
        const { items } = get();
        const newItems = items.map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            return {
              ...item,
              quantity,
            };
          }
          return item;
        });
        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      openCartSheet: () => set({ isCartSheetOpen: true }),
      
      closeCartSheet: () => set({ isCartSheetOpen: false }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
