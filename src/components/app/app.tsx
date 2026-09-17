import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useGetIngredientsQuery } from '@services/burger-api';
import { setSelectedIngredient } from '@services/ingredient-slice';

import type { AppDispatch, RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { data: ingredients = [], isLoading, error } = useGetIngredientsQuery();
  const dispatch = useDispatch<AppDispatch>();
  const selectedIngredient = useSelector(
    (state: RootState) => state.ingredient.selectedIngredient
  );
  const [constructorIngredients, setConstructorIngredients] = useState<TIngredient[]>(
    []
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

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
    (ingredient: TIngredient): void => {
      dispatch(setSelectedIngredient(ingredient));
    },
    [dispatch]
  );
  const closeIngredientModal = useCallback((): void => {
    dispatch(setSelectedIngredient(null));
  }, [dispatch]);
  const closeOrderModal = useCallback((): void => setIsOrderModalOpen(false), []);
  const openOrderModal = useCallback((): void => setIsOrderModalOpen(true), []);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Не удалось загрузить ингредиенты</p>;
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
