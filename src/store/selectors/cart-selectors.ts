import { createSelector } from "@reduxjs/toolkit";
import { selectCartItems } from "../slices/cart";
import { RootState } from "..";

export const selectIsItemInCart = createSelector(
  [selectCartItems, (state: RootState, productId: string) => productId],
  (items, productId) => items.some((item) => item.productId === productId),
);

export const selectItemQuantity = createSelector(
  [selectCartItems, (state: RootState, productId: string) => productId],
  (items, productId) =>
    items.find((item) => item.productId === productId)?.quantity || 0,
);

export const selectUniqueItemsCount = createSelector(
  [selectCartItems],
  (items) => items.length,
);

export const selectCartItem = createSelector(
  [selectCartItems, (state: RootState, productId: string) => productId],
  (items, productId) => items.find((item) => item.productId === productId),
);
