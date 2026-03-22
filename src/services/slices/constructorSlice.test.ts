jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return { ...actual, nanoid: () => 'test-id' };
});

import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  createOrder,
  initialConstructorState
} from './constructorSlice';

import { TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
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
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  id: 'bun-test-id'
};
export const mockSauce: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png',
  id: 'sauce-test-id'
};
export const mockOrder = { number: 123, name: 'Test Order' };

describe('constructorSlice', () => {
  describe('reducers', () => {
    it('addIngredient: добавляет булку (заменяет старую)', () => {
      const state = constructorReducer(undefined, addIngredient(mockBun));
      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('addIngredient: добавляет начинку с nanoid', () => {
      const state = constructorReducer(undefined, addIngredient(mockSauce));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockSauce,
        id: 'test-id'
      });
    });

    it('removeIngredient: удаляет по id', () => {
      const stateWithIng = constructorReducer(
        undefined,
        addIngredient({ ...mockSauce })
      );
      const state = constructorReducer(
        stateWithIng,
        removeIngredient('test-id')
      );
      expect(state.ingredients).toHaveLength(0);
    });

    it('moveIngredient: переставляет (0 -> 2)', () => {
      const ing1 = { ...mockSauce, id: '1' };
      const ing2 = { ...mockSauce, id: '2' };
      const ing3 = { ...mockSauce, id: '3' };

      const stateWithAll = {
        ...initialConstructorState,
        ingredients: [ing1, ing2, ing3]
      };

      const state = constructorReducer(
        stateWithAll,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );
      expect(state.ingredients.map((i) => i.id)).toEqual(['2', '3', '1']);
    });

    it('clearConstructor: полный сброс', () => {
      const stateWithData = constructorReducer(
        constructorReducer(undefined, addIngredient(mockBun)),
        addIngredient(mockSauce)
      );
      const state = constructorReducer(stateWithData, clearConstructor());
      expect(state).toEqual(initialConstructorState);
    });
  });

  describe('extraReducers (createOrder)', () => {
    it('pending: orderRequest = true', () => {
      const action = createOrder.pending('reqId', [] as string[]);
      const state = constructorReducer(initialConstructorState, action);
      expect(state.orderRequest).toBe(true);
    });

    it('fulfilled: сбрасывает запрос, сохраняет order, очищает конструктор', () => {
      const action = createOrder.fulfilled(
        { order: mockOrder } as any,
        'reqId',
        [] as string[]
      );
      const state = constructorReducer(initialConstructorState, action);
      expect(state).toEqual({
        ...initialConstructorState,
        orderRequest: false,
        orderModalData: mockOrder,
        bun: null,
        ingredients: []
      });
    });

    it('rejected: сбрасывает orderRequest', () => {
      const action = createOrder.rejected(
        new Error('Order failed') as any,
        'reqId',
        [] as string[]
      );
      const state = constructorReducer(initialConstructorState, action);
      expect(state.orderRequest).toBe(false);
    });
  });
});
