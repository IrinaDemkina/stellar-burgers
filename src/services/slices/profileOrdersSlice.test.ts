import {
  profileOrdersReducer,
  fetchProfileOrders,
  initialProfileOrdersState
} from './profilOrdersSlice';
import { TOrder } from '@utils-types';

const requestId = 'reqId';
const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    ingredients: ['643d69a5c3f7b9001cfa093c'],
    status: 'done',
    name: 'Test Order 1',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:05:00.000Z',
    number: 1001
  },
  {
    _id: 'order-2',
    ingredients: ['643d69a5c3f7b9001cfa0942'],
    status: 'pending',
    name: 'Test Order 2',
    createdAt: '2026-01-02T10:00:00.000Z',
    updatedAt: '2026-01-02T10:05:00.000Z',
    number: 1002
  }
];

describe('profileOrdersSlice', () => {
  describe('fetchProfileOrders.pending', () => {
    it('устанавливает isLoading и сбрасывает error', () => {
      const action = fetchProfileOrders.pending(requestId, undefined);
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
      const action = fetchProfileOrders.fulfilled(
        mockOrders,
        requestId,
        undefined
      );
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
        new Error('Fetch orders error'),
        requestId,
        undefined
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
