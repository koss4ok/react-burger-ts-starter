import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const groups = [
    { title: 'Булки', type: 'bun' },
    { title: 'Соусы', type: 'sauce' },
    { title: 'Начинки', type: 'main' },
  ];

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={true} onClick={() => {}}>
            Булки
          </Tab>
          <Tab value="main" active={false} onClick={() => {}}>
            Начинки
          </Tab>
          <Tab value="sauce" active={false} onClick={() => {}}>
            Соусы
          </Tab>
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
                {groupIngredients.map((ingredient, index) => (
                  <li key={ingredient._id} className={styles.card}>
                    {index === 0 && <Counter count={1} size="default" />}
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
