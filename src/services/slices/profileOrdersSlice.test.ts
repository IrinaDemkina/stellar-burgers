import {
  profileOrdersReducer,
  fetchProfileOrders,
  initialProfileOrdersState
} from './profilOrdersSlice';
import { TOrder } from '@utils-types';
const mockOrders: TOrder[] = [
  { number: 1001, name: 'Test Order 1' } as TOrder,
  { number: 1002, name: 'Test Order 2' } as TOrder
];

describe('profileOrdersSlice', () => {
  describe('fetchProfileOrders.pending', () => {
    it('устанавливает isLoading и сбрасывает error', () => {
      const action = fetchProfileOrders.pending();
      const state = profileOrdersReducer(initialProfileOrdersState, action);
      expect(state).toEqual({
        ...initialProfileOrdersState,
        isLoading: true,
        error: null
      });
    });
  });

  describe('fetchProfileOrders.fulfilled', () => {
    it('сохраняет заказы и сбрасывает isLoading', () => {
      const action = fetchProfileOrders.fulfilled(mockOrders);
      const state = profileOrdersReducer(initialProfileOrdersState, action);
      expect(state).toEqual({
        ...initialProfileOrdersState,
        isLoading: false,
        orders: mockOrders,
        error: null
      });
    });
  });

  describe('fetchProfileOrders.rejected', () => {
    it('сохраняет ошибку и сбрасывает isLoading', () => {
      const loadingState = { ...initialProfileOrdersState, isLoading: true };
      const action = fetchProfileOrders.rejected(
        new Error('Fetch orders error')
      );
      const state = profileOrdersReducer(loadingState, action);
      expect(state).toEqual({
        ...initialProfileOrdersState,
        isLoading: false,
        error: 'Fetch orders error'
      });
    });
  });
});
