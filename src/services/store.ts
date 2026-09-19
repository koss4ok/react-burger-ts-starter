import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerApi } from './api/burger-api';
import constructorReducer from './constructor/constructor-slice';
import ingredientReducer from './ingredient/ingredient-slice';
import ingredientsReducer from './ingredients/ingredients-slice';
import orderReducer from './order/order-slice';

const rootReducer = combineSlices({
  [burgerApi.reducerPath]: burgerApi.reducer,
  burgerConstructor: constructorReducer,
  ingredient: ingredientReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(burgerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
