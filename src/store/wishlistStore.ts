import { create } from 'zustand';
import { Product } from '../types';

interface WishlistState {
  wishlistItems: Product[];
  toggleWishlistItem: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
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
}));
