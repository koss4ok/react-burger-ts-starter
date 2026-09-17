import { configureStore } from '@reduxjs/toolkit';

import { burgerApi } from './burger-api';
import ingredientReducer from './ingredient-slice';

export const store = configureStore({
  reducer: {
    [burgerApi.reducerPath]: burgerApi.reducer,
    ingredient: ingredientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(burgerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
