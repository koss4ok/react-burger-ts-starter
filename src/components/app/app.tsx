import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  addIngredient,
  moveIngredient,
  removeIngredient,
} from '@services/constructor/constructor-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  clearSelectedIngredient,
  setSelectedIngredient,
} from '@services/ingredient/ingredient-slice';
import { loadIngredients } from '@services/ingredients/ingredients-slice';
import { clearOrder, submitOrder } from '@services/order/order-slice';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.ingredients);
  const bun = useAppSelector((state) => state.burgerConstructor.bun);
  const constructorIngredients = useAppSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const selectedIngredient = useAppSelector(
    (state) => state.ingredient.selectedIngredient
  );
  const {
    number: orderNumber,
    isLoading: isOrderLoading,
    error: orderError,
  } = useAppSelector((state) => state.order);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    void dispatch(loadIngredients());
  }, [dispatch]);

  const addConstructorIngredient = useCallback(
    (ingredient: TIngredient): void => {
      dispatch(addIngredient(ingredient));
    },
    [dispatch]
  );
  const removeConstructorIngredient = useCallback(
    (uuid: string): void => {
      dispatch(removeIngredient(uuid));
    },
    [dispatch]
  );
  const moveConstructorIngredient = useCallback(
    (draggedUuid: string, targetUuid: string): void => {
      dispatch(moveIngredient({ draggedUuid, targetUuid }));
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
    if (!bun || isOrderLoading) {
      return;
    }

    try {
      await dispatch(
        submitOrder([
          bun._id,
          ...constructorIngredients.map((ingredient) => ingredient._id),
          bun._id,
        ])
      ).unwrap();
      setIsOrderModalOpen(true);
    } catch {
      setIsOrderModalOpen(false);
    }
  }, [bun, constructorIngredients, dispatch, isOrderLoading]);

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
        <BurgerIngredients onIngredientClick={selectIngredient} />
        <BurgerConstructor
          onAddIngredient={addConstructorIngredient}
          onMoveIngredient={moveConstructorIngredient}
          onRemoveIngredient={removeConstructorIngredient}
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
