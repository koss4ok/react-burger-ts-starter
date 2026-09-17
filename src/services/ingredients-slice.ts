import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './api';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const loadIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/load', async (_, { rejectWithValue }) => {
  try {
    return await fetchIngredients();
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось загрузить ингредиенты'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export default ingredientsSlice.reducer;
