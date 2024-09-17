import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authService';

const token = localStorage.getItem('token') || null;
const user = JSON.parse(localStorage.getItem('user') || null);

const initialState = {
  loading: false,
  user,
  token,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.userLogin.matchFulfilled,
      (state, {payload}) => {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        state.user = payload.user;
        state.token = payload.token;
      }
    )
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
