import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type TIngredientState = {
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientState = {
  selectedIngredient: null,
};

const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient | null>) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    },
  },
});

export const { clearSelectedIngredient, setSelectedIngredient } =
  ingredientSlice.actions;
export default ingredientSlice.reducer;
