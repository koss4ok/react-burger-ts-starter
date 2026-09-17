import { configureStore } from '@reduxjs/toolkit';

import { burgerApi } from './burger-api';

export const store = configureStore({
  reducer: {
    [burgerApi.reducerPath]: burgerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(burgerApi.middleware),
});
