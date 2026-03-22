import {
  userReducer,
  checkUserAuth,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  initialUserState
} from './userSlice';
import { TUser } from '@utils-types';
const mockUser: TUser = { name: 'Test', email: 'test@test.com' };
const mockUserUpdated = { name: 'Updated', email: 'test@test.com' };

describe('userSlice', () => {
  describe('checkUserAuth', () => {
    it('pending: состояние не меняется (нет handler)', () => {
      const action = checkUserAuth.pending();
      const state = userReducer(initialUserState, action);
      expect(state).toEqual(initialUserState);
    });

    it('fulfilled: устанавливает пользователя и авторизацию', () => {
      const action = checkUserAuth.fulfilled({ user: mockUser });
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        isAuthChecked: true,
        isAuthenticated: true,
        user: mockUser
      });
    });

    it('rejected: проверяет авторизацию без пользователя', () => {
      const action = checkUserAuth.rejected();
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        isAuthChecked: true,
        isAuthenticated: false
      });
    });
  });

  describe('loginUser & registerUser', () => {
    it('loginUser.fulfilled: авторизует', () => {
      const action = loginUser.fulfilled({ user: mockUser });
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        isAuthenticated: true,
        user: mockUser,
        error: null
      });
    });

    it('loginUser.rejected: сохраняет ошибку', () => {
      const action = loginUser.rejected(new Error('Login failed'));
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        error: 'Login failed'
      });
    });

    it('registerUser.fulfilled: регистрирует (аналогично login)', () => {
      const action = registerUser.fulfilled({ user: mockUser });
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        isAuthenticated: true,
        user: mockUser,
        error: null
      });
    });
  });

  describe('updateUser', () => {
    it('fulfilled: обновляет пользователя', () => {
      const stateWithUser = userReducer(
        initialUserState,
        checkUserAuth.fulfilled({ user: mockUser })
      );
      const action = updateUser.fulfilled({ user: mockUserUpdated });
      const state = userReducer(stateWithUser, action);
      expect(state.user).toEqual(mockUserUpdated);
    });
  });

  describe('logoutUser', () => {
    it('fulfilled: сбрасывает авторизацию', () => {
      const stateWithUser = userReducer(
        initialUserState,
        loginUser.fulfilled({ user: mockUser })
      );
      const action = logoutUser.fulfilled();
      const state = userReducer(stateWithUser, action);
      expect(state).toEqual({
        ...initialUserState,
        user: null,
        isAuthenticated: false
      });
    });
  });
});
