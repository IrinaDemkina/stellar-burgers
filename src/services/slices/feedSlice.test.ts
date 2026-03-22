import {
  feedReducer,
  fetchFeeds,
  fetchOrderByNumber,
  initialFeedState
} from './feedSlice';
import { TOrder } from '@utils-types';
const mockFeedsResponse = {
  orders: [{ number: 1 } as TOrder],
  total: 10,
  totalToday: 2
};
const mockOrder: TOrder = { number: 123 } as TOrder;

describe('feedSlice', () => {
  describe('fetchFeeds (лента заказов)', () => {
    it('pending: устанавливает isLoading и сбрасывает error', () => {
      const action = fetchFeeds.pending();
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        isLoading: true,
        error: null
      });
    });

    it('fulfilled: сохраняет данные ленты', () => {
      const action = fetchFeeds.fulfilled(mockFeedsResponse);
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
      const action = fetchFeeds.rejected(new Error('Fetch feeds error'));
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
      const action = fetchOrderByNumber.pending(1);
      const state = feedReducer(initialFeedState, action);
      expect(state).toEqual({
        ...initialFeedState,
        currentOrderLoading: true,
        currentOrderError: null,
        currentOrder: null
      });
    });

    it('fulfilled: сохраняет заказ', () => {
      const action = fetchOrderByNumber.fulfilled(mockOrder);
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
        'reqId',
        'Order not found'
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
