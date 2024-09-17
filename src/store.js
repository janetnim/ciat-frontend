import { configureStore } from '@reduxjs/toolkit';
import authReducer from './containers/auth/authSlice';
import { authApi } from './containers/auth/authService';
import imagesReducer from './containers/images/imagesSlice';
import { imagesApi } from './containers/images/imagesService';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
    auth: authReducer,
    images: imagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(imagesApi.middleware),
});

export default store;
