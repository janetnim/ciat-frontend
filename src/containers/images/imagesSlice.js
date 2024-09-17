import { createSlice } from '@reduxjs/toolkit';
import { imagesApi } from './imagesService';

const initialState = {
  loading: false,
  images: [],
  error: null,
  success: false,
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      imagesApi.endpoints.processImages.matchFulfilled,
      (state, {payload}) => {
        state.images = payload.data;
      }
    )
  },
});

export default imagesSlice.reducer;
