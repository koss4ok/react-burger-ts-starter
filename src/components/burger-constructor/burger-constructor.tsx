import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';

import { selectBurgerTotal } from '@services/constructor-selectors';

import type { TConstructorIngredient } from '@services/constructor-slice';
import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  onAddIngredient: (ingredient: TIngredient) => void;
  onMoveIngredient: (draggedUuid: string, targetUuid: string) => void;
  onRemoveIngredient: (uuid: string) => void;
  onOrderClick: () => void;
  isOrderLoading: boolean;
};

type TConstructorDragItem = {
  uuid: string;
};

type TDraggableConstructorIngredientProps = {
  ingredient: TConstructorIngredient;
  onMove: (draggedUuid: string, targetUuid: string) => void;
  onRemove: (uuid: string) => void;
};

const DraggableConstructorIngredient = ({
  ingredient,
  onMove,
  onRemove,
}: TDraggableConstructorIngredientProps): React.JSX.Element => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<
    TConstructorDragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: 'constructorIngredient',
      item: { uuid: ingredient.uuid },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient.uuid, onRemove]
  );
  const [{ isOver }, drop] = useDrop<TConstructorDragItem, void, { isOver: boolean }>(
    () => ({
      accept: 'constructorIngredient',
      drop: (item): void => {
        onMove(item.uuid, ingredient.uuid);
      },
      collect: (monitor): { isOver: boolean } => ({ isOver: monitor.isOver() }),
    }),
    [ingredient.uuid, onMove]
  );

  drag(drop(elementRef));

  return (
    <div
      ref={elementRef}
      className={`${styles.filling} ${isOver ? styles.drop_active : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => onRemove(ingredient.uuid)}
        extraClass={styles.element}
      />
    </div>
  );
};

export const BurgerConstructor = ({
  bun,
  ingredients,
  onAddIngredient,
  onMoveIngredient,
  onRemoveIngredient,
  onOrderClick,
  isOrderLoading,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [{ isOverBun }, bunDrop] = useDrop<TIngredient, void, { isOverBun: boolean }>(
    () => ({
      accept: 'ingredient',
      drop: (ingredient): void => {
        if (ingredient.type === 'bun') {
          onAddIngredient(ingredient);
        }
      },
      collect: (monitor): { isOverBun: boolean } => ({
        isOverBun: monitor.isOver() && monitor.getItem()?.type === 'bun',
      }),
    }),
    [onAddIngredient]
  );
  const [{ isOverIngredients }, ingredientsDrop] = useDrop<
    TIngredient,
    void,
    { isOverIngredients: boolean }
  >(
    () => ({
      accept: 'ingredient',
      drop: (ingredient): void => {
        if (ingredient.type !== 'bun') {
          onAddIngredient(ingredient);
        }
      },
      collect: (monitor): { isOverIngredients: boolean } => ({
        isOverIngredients: monitor.isOver() && monitor.getItem()?.type !== 'bun',
      }),
    }),
    [onAddIngredient]
  );
  const totalPrice = useSelector(selectBurgerTotal);

  return (
    <section className={styles.burger_constructor}>
      <div
        ref={(element): void => {
          bunDrop(element);
        }}
        className={styles.bun}
      >
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
            extraClass={`${styles.element} ${isOverBun ? styles.drop_active : ''}`}
          />
        ) : (
          <div
            className={`${styles.placeholder} text text_type_main-default ${
              isOverBun ? styles.drop_active : ''
            }`}
          >
            Выберите булки
          </div>
        )}
      </div>
      <div
        ref={(element): void => {
          ingredientsDrop(element);
        }}
        className={`${styles.fillings} custom-scroll`}
      >
        {ingredients.length === 0 ? (
          <div
            className={`${styles.placeholder} text text_type_main-default ${
              isOverIngredients ? styles.drop_active : ''
            }`}
          >
            Выберите начинку
          </div>
        ) : (
          ingredients.map((ingredient) => (
            <DraggableConstructorIngredient
              key={ingredient.uuid}
              ingredient={ingredient}
              onMove={onMoveIngredient}
              onRemove={onRemoveIngredient}
            />
          ))
        )}
      </div>
      <div className={styles.bun}>
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
            extraClass={styles.element}
          />
        ) : (
          <div className={`${styles.placeholder} text text_type_main-default`}>
            Выберите булки
          </div>
        )}
      </div>
      <div className={styles.order}>
        <div className={styles.total}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          disabled={isOrderLoading}
          onClick={onOrderClick}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
