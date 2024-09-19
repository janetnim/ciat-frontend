import { createSlice } from '@reduxjs/toolkit';
import { imagesApi } from './imagesService';

const initialState = {
  loading: false,
  hasImageResults: false,
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
        state.hasImageResults = payload.data;
      }
    ),
    builder.addMatcher(
      imagesApi.endpoints.runTestData.matchFulfilled,
      (state, {payload}) => {
        state.hasImageResults = payload.data;
      }
    )
  },
});

export default imagesSlice.reducer;
