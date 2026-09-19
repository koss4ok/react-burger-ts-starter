import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import { selectIngredientCounts } from '@services/constructor/constructor-slice';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

const groups = [
  { title: 'Булки', type: 'bun' },
  { title: 'Соусы', type: 'sauce' },
  { title: 'Начинки', type: 'main' },
];

type TDraggableIngredientProps = {
  ingredient: TIngredient;
  count: number;
  onClick: (ingredient: TIngredient) => void;
};

const DraggableIngredient = ({
  ingredient,
  count,
  onClick,
}: TDraggableIngredientProps): React.JSX.Element => {
  const [{ isDragging }, drag] = useDrag<TIngredient, void, { isDragging: boolean }>(
    () => ({
      type: 'ingredient',
      item: ingredient,
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  return (
    <li
      ref={(element): void => {
        drag(element);
      }}
      className={`${styles.card} ${styles.card_clickable}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {count > 0 && <Counter count={count} size="default" />}
      <button
        className={styles.card_content}
        type="button"
        onClick={() => onClick(ingredient)}
      >
        <img
          className={styles.image}
          src={ingredient.image_large}
          alt={ingredient.name}
        />
        <div className={styles.price}>
          <span className="text text_type_digits-default">{ingredient.price}</span>
          <CurrencyIcon type="primary" />
        </div>
        <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
      </button>
    </li>
  );
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState('bun');
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});

  const ingredientGroups = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        ingredients: ingredients.filter((ingredient) => ingredient.type === group.type),
      })),
    [ingredients]
  );
  const ingredientCounts = useSelector(selectIngredientCounts);

  const updateActiveTab = useCallback((): void => {
    const ingredientsElement = ingredientsRef.current;

    if (!ingredientsElement) {
      return;
    }

    const ingredientsTop = ingredientsElement.getBoundingClientRect().top;
    const closestGroup = ingredientGroups.reduce<{
      type: string;
      distance: number;
    } | null>((closest, group) => {
      const heading = headingRefs.current[group.type];

      if (!heading) {
        return closest;
      }

      const distance = Math.abs(heading.getBoundingClientRect().top - ingredientsTop);

      return !closest || distance < closest.distance
        ? { type: group.type, distance }
        : closest;
    }, null);

    if (closestGroup) {
      setActiveTab(closestGroup.type);
    }
  }, [ingredientGroups]);

  useEffect(() => {
    const ingredientsElement = ingredientsRef.current;

    if (!ingredientsElement) {
      return;
    }

    updateActiveTab();
    ingredientsElement.addEventListener('scroll', updateActiveTab);

    return (): void => ingredientsElement.removeEventListener('scroll', updateActiveTab);
  }, [updateActiveTab]);

  const scrollToGroup = useCallback((type: string): void => {
    setActiveTab(type);
    document
      .getElementById(`ingredients-${type}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section className={styles.burger_ingredients}>
      <nav className={styles.navigation} aria-label="Категории ингредиентов">
        <ul className={styles.menu}>
          {groups.map((group) => (
            <li key={group.type} className={styles.menu_item}>
              <Tab
                value={group.type}
                active={activeTab === group.type}
                onClick={() => scrollToGroup(group.type)}
              >
                {group.title}
              </Tab>
            </li>
          ))}
        </ul>
      </nav>
      <div ref={ingredientsRef} className={`${styles.ingredients} custom-scroll`}>
        {ingredientGroups.map((group) => {
          return (
            <section
              key={group.type}
              id={`ingredients-${group.type}`}
              className={styles.group}
              aria-labelledby={`ingredients-title-${group.type}`}
            >
              <h2
                ref={(heading): void => {
                  headingRefs.current[group.type] = heading;
                }}
                id={`ingredients-title-${group.type}`}
                className="text text_type_main-medium mt-10 mb-6"
              >
                {group.title}
              </h2>
              <ul className={styles.cards}>
                {group.ingredients.map((ingredient) => (
                  <DraggableIngredient
                    key={ingredient._id}
                    ingredient={ingredient}
                    count={ingredientCounts.get(ingredient._id) ?? 0}
                    onClick={onIngredientClick}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
};
