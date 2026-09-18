import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type TConstructorState = {
  items: TIngredient[];
};

const initialState: TConstructorState = {
  items: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
    reorderIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
    },
  },
});

export const { removeIngredient, reorderIngredients } = constructorSlice.actions;
export default constructorSlice.reducer;
