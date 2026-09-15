import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [constructorIngredients, setConstructorIngredients] = useState<TIngredient[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/ingredients`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка загрузки ингредиентов: ${response.status}`);
        }

        return response.json() as Promise<{ data: TIngredient[] }>;
      })
      .then(({ data }) => {
        setIngredients(data);
        const bun = data.find((ingredient) => ingredient.type === 'bun');
        setConstructorIngredients([
          ...(bun ? [bun] : []),
          ...data.filter((ingredient) => ingredient.type !== 'bun'),
        ]);
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Не удалось загрузить ингредиенты'
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addIngredient = (ingredient: TIngredient): void => {
    setConstructorIngredients((currentIngredients) => {
      if (ingredient.type === 'bun') {
        return [
          ingredient,
          ...currentIngredients.filter(
            (currentIngredient) => currentIngredient.type !== 'bun'
          ),
        ];
      }

      return [...currentIngredients, ingredient];
    });
  };

  const removeIngredient = (index: number): void => {
    setConstructorIngredients((currentIngredients) =>
      currentIngredients.filter((_, ingredientIndex) => ingredientIndex !== index)
    );
  };

  const reorderIngredients = (nextIngredients: TIngredient[]): void => {
    setConstructorIngredients(nextIngredients);
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients
          ingredients={ingredients}
          selectedIngredients={constructorIngredients}
          onAddIngredient={addIngredient}
        />
        <BurgerConstructor
          ingredients={constructorIngredients}
          onRemoveIngredient={removeIngredient}
          onReorderIngredients={reorderIngredients}
        />
      </main>
    </div>
  );
};

export default App;
