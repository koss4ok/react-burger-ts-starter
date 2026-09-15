import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onRemoveIngredient: (index: number) => void;
  onReorderIngredients: (ingredients: TIngredient[]) => void;
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  onRemoveIngredient,
  onReorderIngredients,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const bun = useMemo(
    () => ingredients.find((ingredient) => ingredient.type === 'bun'),
    [ingredients]
  );
  const fillings = useMemo(
    () =>
      ingredients
        .map((ingredient, index) => ({ ingredient, index }))
        .filter(({ ingredient }) => ingredient.type !== 'bun'),
    [ingredients]
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const totalPrice = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      fillings.reduce((total, { ingredient }) => total + ingredient.price, 0),
    [bun, fillings]
  );

  const removeFilling = useCallback(
    (index: number): void => {
      onRemoveIngredient(index);
    },
    [onRemoveIngredient]
  );

  const moveFilling = useCallback(
    (fromIndex: number, toIndex: number): void => {
      if (fromIndex === toIndex) {
        return;
      }

      const nextFillings = fillings.map(({ ingredient }) => ingredient);
      const [movedFilling] = nextFillings.splice(fromIndex, 1);

      if (movedFilling) {
        nextFillings.splice(toIndex, 0, movedFilling);
        onReorderIngredients(bun ? [bun, ...nextFillings] : nextFillings);
      }
    },
    [bun, fillings, onReorderIngredients]
  );

  const handleDragStart = useCallback((index: number): void => {
    setDraggedIndex(index);
  }, []);

  const handleDrop = useCallback(
    (index: number): void => {
      if (draggedIndex !== null) {
        moveFilling(draggedIndex, index);
      }

      setDraggedIndex(null);
    },
    [draggedIndex, moveFilling]
  );

  return (
    <section className={styles.burger_constructor}>
      <div className={styles.bun}>
        {bun && (
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
            extraClass={styles.element}
          />
        )}
      </div>
      <div className={`${styles.fillings} custom-scroll`}>
        {fillings.map(({ ingredient, index: ingredientIndex }, index) => (
          <div
            key={`${ingredient._id}-${ingredientIndex}`}
            className={styles.filling}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => setDraggedIndex(null)}
          >
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
              handleClose={() => removeFilling(ingredientIndex)}
              extraClass={styles.element}
            />
          </div>
        ))}
      </div>
      <div className={styles.bun}>
        {bun && (
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
            extraClass={styles.element}
          />
        )}
      </div>
      <div className={styles.order}>
        <div className={styles.total}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
