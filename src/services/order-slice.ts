import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { createOrder } from './api';

type TOrderState = {
  number: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  number: null,
  isLoading: false,
  error: null,
};

export const submitOrder = createAsyncThunk<number, string[], { rejectValue: string }>(
  'order/submit',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await createOrder(ingredients);
      return response.order.number;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось оформить заказ'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.number = null;
      state.error = null;
    },
    setOrderNumber: (state, action: PayloadAction<number>) => {
      state.number = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.number = action.payload;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder, setOrderNumber } = orderSlice.actions;
export default orderSlice.reducer;
