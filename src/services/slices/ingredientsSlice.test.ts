import {
  ingredientsReducer,
  fetchIngredients,
  initialIngredientsState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const requestId = 'reqId';
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  }
];

describe('ingredientsSlice', () => {
  describe('fetchIngredients.pending', () => {
    it('устанавливает isLoading=true и сбрасывает error', () => {
      const action = fetchIngredients.pending(requestId, undefined);
      const state = ingredientsReducer(initialIngredientsState, action);
      expect(state).toEqual({
        ...initialIngredientsState,
        isLoading: true,
        error: null
      });
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('сохраняет ингредиенты и сбрасывает isLoading', () => {
      const action = fetchIngredients.fulfilled(
        mockIngredients,
        requestId,
        undefined
      );
      const state = ingredientsReducer(initialIngredientsState, action);
      expect(state).toEqual({
        ...initialIngredientsState,
        isLoading: false,
        ingredients: mockIngredients,
        error: null
      });
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('сохраняет ошибку и сбрасывает isLoading (из состояния с загрузкой)', () => {
      const loadingState = {
        ...initialIngredientsState,
        isLoading: true
      };
      const action = fetchIngredients.rejected(
        new Error('Network error'),
        requestId,
        undefined
      );
      const state = ingredientsReducer(loadingState, action);
      expect(state).toEqual({
        ...initialIngredientsState,
        isLoading: false,
        error: 'Network error'
      });
    });
  });
});
