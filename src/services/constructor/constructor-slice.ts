import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

export type TConstructorIngredient = TIngredient & {
  uuid: string;
};

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

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

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = { ...action.payload, uuid: nanoid() };

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }

      state.ingredients.push(ingredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.uuid !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ draggedUuid: string; targetUuid: string }>
    ) => {
      const draggedIndex = state.ingredients.findIndex(
        (ingredient) => ingredient.uuid === action.payload.draggedUuid
      );
      const targetIndex = state.ingredients.findIndex(
        (ingredient) => ingredient.uuid === action.payload.targetUuid
      );

      if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        return;
      }

      const [draggedIngredient] = state.ingredients.splice(draggedIndex, 1);

      if (draggedIngredient) {
        const insertionIndex =
          draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        state.ingredients.splice(insertionIndex, 0, draggedIngredient);
      }
    },
  },
});

export const { addIngredient, moveIngredient, removeIngredient } =
  constructorSlice.actions;
export default constructorSlice.reducer;
