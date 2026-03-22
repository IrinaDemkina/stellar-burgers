import {
  feedReducer,
  fetchFeeds,
  fetchOrderByNumber,
  initialFeedState
} from './feedSlice';
import { TOrder } from '@utils-types';

const requestId = 'reqId';
const orderNumber = 12345;

const mockOrder: TOrder = {
  _id: 'order-1',
  ingredients: ['643d69a5c3f7b9001cfa093c'],
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-01T10:05:00.000Z',
  number: orderNumber
};

const mockFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 10,
  totalToday: 2
};

describe('feedSlice', () => {
  describe('fetchFeeds (лента заказов)', () => {
    it('pending: устанавливает isLoading и сбрасывает error', () => {
      const action = fetchFeeds.pending(requestId, undefined);
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        isLoading: true,
        error: null
      });
    });

    it('fulfilled: сохраняет данные ленты', () => {
      const action = fetchFeeds.fulfilled(
        mockFeedsResponse,
        requestId,
        undefined
      );
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        isLoading: false,
        orders: mockFeedsResponse.orders,
        total: mockFeedsResponse.total,
        totalToday: mockFeedsResponse.totalToday,
        error: null
      });
    });

    it('rejected: сохраняет ошибку', () => {
      const action = fetchFeeds.rejected(
        new Error('Fetch feeds error'),
        requestId,
        undefined
      );
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        isLoading: false,
        error: 'Fetch feeds error'
      });
    });
  });

  describe('fetchOrderByNumber (детальный заказ)', () => {
    it('pending: устанавливает currentOrderLoading', () => {
      const action = fetchOrderByNumber.pending(requestId, orderNumber);
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        currentOrderLoading: true,
        currentOrderError: null,
        currentOrder: null
      });
    });

    it('fulfilled: сохраняет заказ', () => {
      const action = fetchOrderByNumber.fulfilled(
        mockOrder,
        requestId,
        orderNumber
      );
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        currentOrderLoading: false,
        currentOrder: mockOrder,
        currentOrderError: null
      });
    });

    it('rejected: сбрасывает и сохраняет ошибку', () => {
      const action = fetchOrderByNumber.rejected(
        new Error('Order not found'),
        requestId,
        orderNumber
      );
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        currentOrderLoading: false,
        currentOrder: null,
        currentOrderError: 'Order not found'
      });
    });
  });
});
