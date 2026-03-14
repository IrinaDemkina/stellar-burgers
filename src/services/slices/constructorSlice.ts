import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import type { RootState } from '../store';
import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];

  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'burger/createOrder',
  async (ingredientIds: string[]) => await orderBurgerApi(ingredientIds)
);

export const orderBurger = createAsyncThunk(
  'burger/order',
  async (ingredientIds: string[]) => {
    await orderBurgerApi(ingredientIds);
  }
);

export const constructorSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      if (
        fromIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex < 0 ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }
      const ingredient = state.ingredients[fromIndex];
      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order as unknown as TOrder;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
export const selectConstructorBun = (state: RootState) => state.burger.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burger.ingredients;
export const selectOrderRequest = (state: RootState) =>
  state.burger.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burger.orderModalData;
