import { describe, expect, it } from 'vitest';

import { moveIngredient, type TConstructorIngredient } from './constructor-slice';
import reducer from './constructor-slice';

const ingredients: TConstructorIngredient[] = [
  { _id: '1', name: '1', type: 'main', uuid: 'uuid-1' },
  { _id: '2', name: '2', type: 'main', uuid: 'uuid-2' },
  { _id: '3', name: '3', type: 'main', uuid: 'uuid-3' },
].map((ingredient) => ({
  ...ingredient,
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: '',
  __v: 0,
}));

describe('moveIngredient', () => {
  it('moves ingredients before the target in either direction', () => {
    const state = {
      bun: null,
      ingredients,
    };

    const movedForward = reducer(
      state,
      moveIngredient({ draggedUuid: 'uuid-1', targetUuid: 'uuid-2' })
    );
    expect(movedForward.ingredients.map((ingredient) => ingredient.name)).toEqual([
      '2',
      '1',
      '3',
    ]);

    const movedBackward = reducer(
      state,
      moveIngredient({ draggedUuid: 'uuid-2', targetUuid: 'uuid-1' })
    );
    expect(movedBackward.ingredients.map((ingredient) => ingredient.name)).toEqual([
      '2',
      '1',
      '3',
    ]);
  });
});
