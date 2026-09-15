import { useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { ingredients } from '@utils/ingredients';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [constructorIngredients, setConstructorIngredients] = useState<TIngredient[]>(
    () => {
      const bun = ingredients.find((ingredient) => ingredient.type === 'bun');

      return [
        ...(bun ? [bun] : []),
        ...ingredients.filter((ingredient) => ingredient.type !== 'bun'),
      ];
    }
  );

  const addIngredient = (ingredient: TIngredient): void => {
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
  };

  const removeIngredient = (index: number): void => {
    setConstructorIngredients((currentIngredients) =>
      currentIngredients.filter((_, ingredientIndex) => ingredientIndex !== index)
    );
  };

  const reorderIngredients = (nextIngredients: TIngredient[]): void => {
    setConstructorIngredients(nextIngredients);
  };

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
        />
        <BurgerConstructor
          ingredients={constructorIngredients}
          onRemoveIngredient={removeIngredient}
          onReorderIngredients={reorderIngredients}
        />
      </main>
    </div>
  );
};

export default App;
