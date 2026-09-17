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
  },
});

export const { setSelectedIngredient } = ingredientSlice.actions;
export default ingredientSlice.reducer;
