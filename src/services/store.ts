import { configureStore } from '@reduxjs/toolkit';

import { burgerApi } from './burger-api';
import constructorReducer from './constructor-slice';
import ingredientReducer from './ingredient-slice';
import ingredientsReducer from './ingredients-slice';
import orderReducer from './order-slice';

export const store = configureStore({
  reducer: {
    [burgerApi.reducerPath]: burgerApi.reducer,
    burgerConstructor: constructorReducer,
    ingredient: ingredientReducer,
    ingredients: ingredientsReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(burgerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
