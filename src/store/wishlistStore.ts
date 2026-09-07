import { create } from 'zustand';
import { Product, CartItem } from '../types';

// ---------------------------------------------------------------------------
// Combined Wishlist + Cart store
// ---------------------------------------------------------------------------

interface AppStoreState {
  // ── Wishlist ──
  wishlistItems: Product[];
  toggleWishlistItem: (product: Product) => void;

  // ── Cart ──
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;

  // ── Hydration flag ──
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useWishlistStore = create<AppStoreState>()(
  (set) => ({
    // ── Wishlist state ──
    wishlistItems: [],
    toggleWishlistItem: (product) =>
      set((state) => {
        const exists = state.wishlistItems.some((i) => i.id === product.id);
        return {
          wishlistItems: exists
            ? state.wishlistItems.filter((i) => i.id !== product.id)
            : [...state.wishlistItems, product],
        };
      }),

    // ── Cart state ──
    cartItems: [],
    addToCart: (product) =>
      set((state) => {
        const existingIndex = state.cartItems.findIndex(
          (ci) => ci.product.id === product.id,
        );
        if (existingIndex !== -1) {
          // Increment quantity for existing item
          const updated = [...state.cartItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
          return { cartItems: updated };
        }
        // New item — add with quantity 1
        return {
          cartItems: [...state.cartItems, { product, quantity: 1 }],
        };
      }),
    removeFromCart: (id) =>
      set((state) => ({
        cartItems: state.cartItems.filter((ci) => ci.product.id !== id),
      })),

    // ── Hydration ──
    _hasHydrated: true,
    setHasHydrated: (v) => set({ _hasHydrated: v }),
  }),
);
