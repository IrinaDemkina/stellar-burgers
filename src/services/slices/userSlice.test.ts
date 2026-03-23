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
const requestId = 'reqId';
const mockUser: TUser = { name: 'Test', email: 'test@test.com' };
const mockUserUpdated: TUser = { name: 'Updated', email: 'test@test.com' };

const loginPayload = { email: mockUser.email, password: 'password' };
const registerPayload = { ...loginPayload, name: mockUser.name };
const updatePayload = { name: mockUserUpdated.name, email: mockUser.email };

const authResponse = {
  success: true,
  user: mockUser,
  accessToken: '',
  refreshToken: ''
};
const authUpdatedResponse = { success: true, user: mockUserUpdated };

describe('userSlice', () => {
  describe('checkUserAuth', () => {
    it('pending: состояние не меняется (нет handler)', () => {
      const action = checkUserAuth.pending(requestId, undefined);
      const state = userReducer(initialUserState, action);
      expect(state).toEqual(initialUserState);
    });

    it('fulfilled: устанавливает пользователя и авторизацию', () => {
      const action = checkUserAuth.fulfilled(
        authResponse,
        requestId,
        undefined
      );
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        isAuthChecked: true,
        isAuthenticated: true,
        user: mockUser
      });
    });

    it('rejected: проверяет авторизацию без пользователя', () => {
      const action = checkUserAuth.rejected(
        new Error('Auth error'),
        requestId,
        undefined
      );
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
      const action = loginUser.fulfilled(authResponse, requestId, loginPayload);
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        isAuthenticated: true,
        user: mockUser,
        error: null
      });
    });

    it('loginUser.rejected: сохраняет ошибку', () => {
      const action = loginUser.rejected(
        new Error('Login failed'),
        requestId,
        loginPayload
      );
      const state = userReducer(initialUserState, action);
      expect(state).toEqual({
        ...initialUserState,
        error: 'Login failed'
      });
    });

    it('registerUser.fulfilled: регистрирует (аналогично login)', () => {
      const action = registerUser.fulfilled(
        authResponse,
        requestId,
        registerPayload
      );
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
        checkUserAuth.fulfilled(authResponse, requestId, undefined)
      );
      const action = updateUser.fulfilled(
        authUpdatedResponse,
        requestId,
        updatePayload
      );
      const state = userReducer(stateWithUser, action);
      expect(state.user).toEqual(mockUserUpdated);
    });
  });

  describe('logoutUser', () => {
    it('fulfilled: сбрасывает авторизацию', () => {
      const stateWithUser = userReducer(
        initialUserState,
        loginUser.fulfilled(authResponse, requestId, loginPayload)
      );
      const action = logoutUser.fulfilled(undefined, requestId, undefined);
      const state = userReducer(stateWithUser, action);
      expect(state).toEqual({
        ...initialUserState,
        user: null,
        isAuthenticated: false
      });
    });
  });
});
