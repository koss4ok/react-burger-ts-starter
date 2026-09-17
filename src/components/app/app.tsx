import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  addIngredient as addConstructorIngredient,
  removeIngredient,
  reorderIngredients,
} from '@services/constructor-slice';
import {
  clearSelectedIngredient,
  setSelectedIngredient,
} from '@services/ingredient-slice';
import { loadIngredients } from '@services/ingredients-slice';
import { clearOrder, submitOrder } from '@services/order-slice';

import type { AppDispatch, RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const { isLoading, error } = useSelector((state: RootState) => state.ingredients);
  const constructorIngredients = useSelector(
    (state: RootState) => state.constructor.items
  );
  const selectedIngredient = useSelector(
    (state: RootState) => state.ingredient.selectedIngredient
  );
  const {
    number: orderNumber,
    isLoading: isOrderLoading,
    error: orderError,
  } = useSelector((state: RootState) => state.order);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    void dispatch(loadIngredients());
  }, [dispatch]);

  const addIngredient = useCallback(
    (ingredient: TIngredient): void => {
      dispatch(addConstructorIngredient(ingredient));
    },
    [dispatch]
  );

  const removeConstructorIngredient = useCallback(
    (index: number): void => {
      dispatch(removeIngredient(index));
    },
    [dispatch]
  );

  const reorderConstructorIngredients = useCallback(
    (nextIngredients: TIngredient[]): void => {
      dispatch(reorderIngredients(nextIngredients));
    },
    [dispatch]
  );

  const selectIngredient = useCallback(
    (ingredient: TIngredient): void => {
      dispatch(setSelectedIngredient(ingredient));
    },
    [dispatch]
  );
  const closeIngredientModal = useCallback((): void => {
    dispatch(clearSelectedIngredient());
  }, [dispatch]);
  const closeOrderModal = useCallback((): void => {
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  }, [dispatch]);
  const openOrderModal = useCallback(async (): Promise<void> => {
    const bun = constructorIngredients.find((ingredient) => ingredient.type === 'bun');

    if (!bun || isOrderLoading) {
      return;
    }

    try {
      await dispatch(
        submitOrder([
          bun._id,
          ...constructorIngredients
            .filter((ingredient) => ingredient.type !== 'bun')
            .map((ingredient) => ingredient._id),
          bun._id,
        ])
      ).unwrap();
      setIsOrderModalOpen(true);
    } catch {
      setIsOrderModalOpen(false);
    }
  }, [constructorIngredients, dispatch, isOrderLoading]);

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
          onRemoveIngredient={removeConstructorIngredient}
          onReorderIngredients={reorderConstructorIngredients}
          onOrderClick={() => {
            void openOrderModal();
          }}
          isOrderLoading={isOrderLoading}
        />
      </main>
      {orderError && <p role="alert">Не удалось оформить заказ</p>}
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={closeIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && orderNumber !== null && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </div>
  );
};

export default App;
