import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TIngredientsResponse = {
  data: TIngredient[];
  success: boolean;
};

type TCreateOrderRequest = {
  ingredients: string[];
};

type TCreateOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export const burgerApi = createApi({
  reducerPath: 'burgerApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => '/ingredients',
      transformResponse: (response: TIngredientsResponse) => {
        if (!response.success) {
          throw new Error('Ошибка загрузки ингредиентов');
        }

        return response.data;
      },
    }),
    createOrder: builder.mutation<TCreateOrderResponse, TCreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      transformResponse: (response: TCreateOrderResponse) => {
        if (!response.success) {
          throw new Error('Ошибка создания заказа');
        }

        return response;
      },
    }),
  }),
});

export const { useCreateOrderMutation, useGetIngredientsQuery } = burgerApi;
