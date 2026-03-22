import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null | undefined;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  currentOrderError: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  currentOrderLoading: false,
  currentOrderError: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchAll',
  async () => await getFeedsApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);

      if (!data?.success || !data.orders?.length) {
        return rejectWithValue('Заказ не найден');
      }

      return data.orders[0];
    } catch (e) {
      return rejectWithValue('Ошибка загрузки заказа');
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrderError = null;
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = null;
        state.currentOrderError =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка загрузки заказа';
      });
  }
});

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectCurrentOrder = (state: RootState) => state.feed.currentOrder;
export const selectCurrentOrderLoading = (state: RootState) =>
  state.feed.currentOrderLoading;
export const selectCurrentOrderError = (state: RootState) =>
  state.feed.currentOrderError;
export const feedReducer = feedSlice.reducer;
export const initialFeedState = initialState;
