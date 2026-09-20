export const checkResponse = (response: Response): Response => {
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return response;
};
