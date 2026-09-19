import { API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TIngredientsResponse = {
  data: TIngredient[];
  success: boolean;
};

export type TOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

const fetchWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
};

export const fetchIngredients = async (): Promise<TIngredient[]> => {
  const response = await fetchWithTimeout(`${API_URL}/ingredients`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки ингредиентов: ${response.status}`);
  }

  const data = (await response.json()) as TIngredientsResponse;

  if (!data.success) {
    throw new Error('Ошибка загрузки ингредиентов');
  }

  return data.data;
};

export const createOrder = async (ingredients: string[]): Promise<TOrderResponse> => {
  const response = await fetchWithTimeout(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка создания заказа: ${response.status}`);
  }

  const data = (await response.json()) as TOrderResponse;

  if (!data.success) {
    throw new Error('Ошибка создания заказа');
  }

  return data;
};
