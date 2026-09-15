import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [constructorIngredients, setConstructorIngredients] = useState<TIngredient[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    getIngredients()
      .then((data) => {
        setIngredients(data);
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

  const addIngredient = useCallback((ingredient: TIngredient): void => {
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
  }, []);

  const removeIngredient = useCallback((index: number): void => {
    setConstructorIngredients((currentIngredients) =>
      currentIngredients.filter((_, ingredientIndex) => ingredientIndex !== index)
    );
  }, []);

  const reorderIngredients = useCallback((nextIngredients: TIngredient[]): void => {
    setConstructorIngredients(nextIngredients);
  }, []);

  const selectIngredient = useCallback(
    (ingredient: TIngredient): void => setSelectedIngredient(ingredient),
    []
  );
  const closeIngredientModal = useCallback((): void => setSelectedIngredient(null), []);
  const closeOrderModal = useCallback((): void => setIsOrderModalOpen(false), []);
  const openOrderModal = useCallback((): void => setIsOrderModalOpen(true), []);

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
          onIngredientClick={selectIngredient}
        />
        <BurgerConstructor
          ingredients={constructorIngredients}
          onRemoveIngredient={removeIngredient}
          onReorderIngredients={reorderIngredients}
          onOrderClick={openOrderModal}
        />
      </main>
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={closeIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
