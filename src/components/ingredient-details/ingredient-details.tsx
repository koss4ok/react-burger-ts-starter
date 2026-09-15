import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => (
  <div className={styles.content}>
    <img src={ingredient.image_large} alt={ingredient.name} />
    <h3 className="text text_type_main-medium mt-4">{ingredient.name}</h3>
    <ul className={styles.nutrition}>
      <li>
        <span className="text text_type_main-default text_color_inactive">
          Калории, ккал
        </span>
        <span className="text text_type_digits-default text_color_inactive">
          {ingredient.calories}
        </span>
      </li>
      <li>
        <span className="text text_type_main-default text_color_inactive">Белки, г</span>
        <span className="text text_type_digits-default text_color_inactive">
          {ingredient.proteins}
        </span>
      </li>
      <li>
        <span className="text text_type_main-default text_color_inactive">Жиры, г</span>
        <span className="text text_type_digits-default text_color_inactive">
          {ingredient.fat}
        </span>
      </li>
      <li>
        <span className="text text_type_main-default text_color_inactive">
          Углеводы, г
        </span>
        <span className="text text_type_digits-default text_color_inactive">
          {ingredient.carbohydrates}
        </span>
      </li>
    </ul>
  </div>
);
