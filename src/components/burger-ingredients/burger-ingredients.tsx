import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  selectedIngredients: TIngredient[];
  onAddIngredient: (ingredient: TIngredient) => void;
  onIngredientClick: (ingredient: TIngredient) => void;
};

const groups = [
  { title: 'Булки', type: 'bun' },
  { title: 'Соусы', type: 'sauce' },
  { title: 'Начинки', type: 'main' },
];

export const BurgerIngredients = ({
  ingredients,
  selectedIngredients,
  onAddIngredient,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState('bun');

  const ingredientGroups = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        ingredients: ingredients.filter((ingredient) => ingredient.type === group.type),
      })),
    [ingredients]
  );
  const ingredientCounts = useMemo(() => {
    const counts = new Map<string, number>();

    selectedIngredients.forEach((ingredient) => {
      counts.set(ingredient._id, (counts.get(ingredient._id) ?? 0) + 1);
    });

    return counts;
  }, [selectedIngredients]);

  const scrollToGroup = useCallback((type: string): void => {
    setActiveTab(type);
    document
      .getElementById(`ingredients-${type}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient): void => {
      onIngredientClick(ingredient);
    },
    [onIngredientClick]
  );

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
      <div className={`${styles.ingredients} custom-scroll`}>
        {ingredientGroups.map((group) => {
          return (
            <section
              key={group.type}
              id={`ingredients-${group.type}`}
              className={styles.group}
              aria-labelledby={`ingredients-title-${group.type}`}
            >
              <h2
                id={`ingredients-title-${group.type}`}
                className="text text_type_main-medium mt-10 mb-6"
              >
                {group.title}
              </h2>
              <ul className={styles.cards}>
                {group.ingredients.map((ingredient) => (
                  <li
                    key={ingredient._id}
                    className={`${styles.card} ${styles.card_clickable}`}
                  >
                    {(ingredientCounts.get(ingredient._id) ?? 0) > 0 && (
                      <Counter
                        count={ingredientCounts.get(ingredient._id) ?? 0}
                        size="default"
                      />
                    )}
                    <button
                      className={styles.card_content}
                      type="button"
                      onClick={() => handleIngredientClick(ingredient)}
                    >
                      <img
                        className={styles.image}
                        src={ingredient.image_large}
                        alt={ingredient.name}
                      />
                      <div className={styles.price}>
                        <span className="text text_type_digits-default">
                          {ingredient.price}
                        </span>
                        <CurrencyIcon type="primary" />
                      </div>
                      <p className={`${styles.name} text text_type_main-default`}>
                        {ingredient.name}
                      </p>
                    </button>
                    <button
                      className={styles.add_button}
                      type="button"
                      aria-label={`Добавить ${ingredient.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddIngredient(ingredient);
                      }}
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
};
