import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

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
