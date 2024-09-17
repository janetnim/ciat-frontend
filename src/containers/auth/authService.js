import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8080/', // to be replaced with the current env's backend URL
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
       // include token in req header
        headers.set('authorization', `Bearer ${token}`) ;

        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query(params) {
        return {
          url: '/v1/signup',
          method: 'POST',
          body: params,
        };
      },
    }),
    userLogin: builder.mutation({
      query(params) {
        return {
          url: '/v1/login',
          method: 'POST',
          credentials: 'include',
          body: params,
        };
      },
    }),
    getUserDetails: builder.query({
      query: () => ({
        url: '/v1/batch-process',
        method: 'GET',
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useUserLoginMutation, useGetUserDetailsQuery } = authApi;
