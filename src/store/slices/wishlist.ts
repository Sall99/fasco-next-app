import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: number;
};

interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  loaded: boolean;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
  loaded: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (
      state,
      action: PayloadAction<Omit<WishlistItem, "addedAt">>,
    ) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (!existingItem) {
        const newItem = {
          ...action.payload,
          addedAt: Date.now(),
        };
        state.items.push(newItem);
        state.totalItems += 1;
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(
        (item) => item.productId === action.payload,
      );
      if (index !== -1) {
        state.items.splice(index, 1);
        state.totalItems -= 1;
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
    initializeWishlist: (state, action: PayloadAction<WishlistState>) => {
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.loaded = true;
    },
    moveToCart: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(
        (item) => item.productId === action.payload,
      );
      if (index !== -1) {
        state.items.splice(index, 1);
        state.totalItems -= 1;
      }
    },
    toggleWishlistItem: (
      state,
      action: PayloadAction<Omit<WishlistItem, "addedAt">>,
    ) => {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );

      if (existingIndex !== -1) {
        state.items.splice(existingIndex, 1);
        state.totalItems -= 1;
      } else {
        const newItem = {
          ...action.payload,
          addedAt: Date.now(),
        };
        state.items.push(newItem);
        state.totalItems += 1;
      }
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  initializeWishlist,
  moveToCart,
  toggleWishlistItem,
} = wishlistSlice.actions;

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistTotalItems = (state: RootState) =>
  state.wishlist.totalItems;
export const selectWishlistLoaded = (state: RootState) => state.wishlist.loaded;
export const selectIsInWishlist = (productId: string) => (state: RootState) =>
  state.wishlist.items.some((item) => item.productId === productId);

export default wishlistSlice.reducer;
