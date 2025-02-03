import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
};

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  loaded: boolean;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  loaded: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.totalQuantity += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(
        (item) => item.productId === action.payload,
      );
      if (index !== -1) {
        state.totalQuantity -= state.items[index].quantity;
        state.totalPrice -=
          state.items[index].price * state.items[index].quantity;
        state.items.splice(index, 1);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item) {
        const diff = action.payload.quantity - item.quantity;
        state.totalQuantity += diff;
        state.totalPrice += diff * item.price;
        item.quantity = action.payload.quantity;
      }
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      );
      if (item) {
        const maxAllowedDecrement = item.quantity - 1;
        const actualDecrement = Math.min(
          action.payload.quantity,
          maxAllowedDecrement,
        );

        if (actualDecrement > 0) {
          state.totalQuantity -= actualDecrement;
          state.totalPrice -= actualDecrement * item.price;
          item.quantity -= actualDecrement;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    initializeCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalPrice = action.payload.totalPrice;
      state.loaded = true;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  decreaseQuantity,
  clearCart,
  initializeCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalQuantity = (state: RootState) =>
  state.cart.totalQuantity;
export const selectTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectCartLoaded = (state: RootState) => state.cart.loaded;

export default cartSlice.reducer;
