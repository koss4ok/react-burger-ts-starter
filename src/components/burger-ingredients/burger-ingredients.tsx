import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  selectedIngredients: TIngredient[];
  onAddIngredient: (ingredient: TIngredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  selectedIngredients,
  onAddIngredient,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState('bun');

  const groups = [
    { title: 'Булки', type: 'bun' },
    { title: 'Соусы', type: 'sauce' },
    { title: 'Начинки', type: 'main' },
  ];

  const scrollToGroup = (type: string): void => {
    setActiveTab(type);
    document
      .getElementById(`ingredients-${type}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getIngredientCount = (id: string): number =>
    selectedIngredients.filter((ingredient) => ingredient._id === id).length;

  const handleIngredientClick = (ingredient: TIngredient): void => {
    onAddIngredient(ingredient);
  };

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
        {groups.map((group) => {
          const groupIngredients = ingredients.filter(
            (ingredient) => ingredient.type === group.type
          );

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
                {groupIngredients.map((ingredient) => (
                  <li
                    key={ingredient._id}
                    className={`${styles.card} ${styles.card_clickable}`}
                    onClick={() => handleIngredientClick(ingredient)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        handleIngredientClick(ingredient);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {getIngredientCount(ingredient._id) > 0 && (
                      <Counter
                        count={getIngredientCount(ingredient._id)}
                        size="default"
                      />
                    )}
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
