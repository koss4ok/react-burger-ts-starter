import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';

const selectBun = (state: RootState): RootState['burgerConstructor']['bun'] =>
  state.burgerConstructor.bun;
const selectConstructorIngredients = (
  state: RootState
): RootState['burgerConstructor']['ingredients'] => state.burgerConstructor.ingredients;

export const selectIngredientCounts = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const counts = new Map<string, number>();

    if (bun) {
      counts.set(bun._id, 2);
    }

    ingredients.forEach((ingredient) => {
      counts.set(ingredient._id, (counts.get(ingredient._id) ?? 0) + 1);
    });

    return counts;
  }
);

export const selectBurgerTotal = createSelector(
  [selectBun, selectConstructorIngredients],
  (bun, ingredients) =>
    (bun ? bun.price * 2 : 0) +
    ingredients.reduce((total, ingredient) => total + ingredient.price, 0)
);
