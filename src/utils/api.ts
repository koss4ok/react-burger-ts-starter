import { API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TIngredientsResponse = {
  data: TIngredient[];
};

export const getIngredients = (): Promise<TIngredient[]> =>
  fetch(`${API_URL}/ingredients`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки ингредиентов: ${response.status}`);
      }

      return response.json() as Promise<TIngredientsResponse>;
    })
    .then(({ data }) => data);
