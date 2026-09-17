import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TIngredientsResponse = {
  data: TIngredient[];
};

export const burgerApi = createApi({
  reducerPath: 'burgerApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getIngredients: builder.query<TIngredient[], void>({
      query: () => '/ingredients',
      transformResponse: (response: TIngredientsResponse) => response.data,
    }),
  }),
});

export const { useGetIngredientsQuery } = burgerApi;
