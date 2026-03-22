import { rootReducer } from './store';

describe('rootReducer', () => {
  it('проверяем правильно ли инициализируются все слайсы', () => {
    const initialState = rootReducer(undefined, { type: '@@redux/INIT' });

    expect(initialState.ingredients.ingredients).toEqual([]);
    expect(initialState.ingredients.isLoading).toBe(false);
    expect(initialState.ingredients.error).toBeNull();

    expect(initialState.burger.bun).toBeNull();
    expect(initialState.burger.ingredients).toEqual([]);
    expect(initialState.burger.orderRequest).toBe(false);
    expect(initialState.burger.orderModalData).toBeNull();

    expect(initialState.feed.orders).toEqual([]);
    expect(initialState.feed.isLoading).toBe(false);
    expect(initialState.feed.error).toBeNull();

    expect(initialState.profileOrders.orders).toEqual([]);
    expect(initialState.profileOrders.isLoading).toBe(false);
    expect(initialState.profileOrders.error).toBeNull();

    expect(initialState.user.user).toBeNull();
    expect(initialState.user.isAuthChecked).toBe(false);
    expect(initialState.user.isAuthenticated).toBe(false);
    expect(initialState.user.error).toBeNull();
  });
  it('возвращает initialState на UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});
