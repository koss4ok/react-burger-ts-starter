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
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.items = [
          action.payload,
          ...state.items.filter((ingredient) => ingredient.type !== 'bun'),
        ];
        return;
      }

      state.items.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
    reorderIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addIngredient, removeIngredient, reorderIngredients } =
  constructorSlice.actions;
export default constructorSlice.reducer;
