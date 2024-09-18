import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import JSZip from 'jszip';

export const imagesApi = createApi({
  reducerPath: 'imagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8080/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
       // include token in request header
        headers.set('authorization', `Bearer ${token}`) ;

        return headers;
      }
    },
  }),
  endpoints: (builder) => ({
    processImages: builder.mutation({
      query(files) {
        return {
          url: '/v1/batch-process',
          method: 'POST',
          body: files,
          responseHandler: async (response) => {
            const data = await response.blob();
            const jszip = new JSZip();
            const parentImagesContainer = document.getElementById('images');
            const imageResults = await jszip.loadAsync(data).then(({files}) => {
              const imageFiles = Object.entries(files);
              imageFiles.forEach(([, image]) => {
                image.async('blob').then(blob => {
                  const img = new Image();
                  img.src = URL.createObjectURL(blob);
                  parentImagesContainer.append(img);
                });
              });

              return imageFiles.length > 0;
            })

            return { data: imageResults };
          },
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        };
      },
    }),
  }),
});

export const { useProcessImagesMutation } = imagesApi;
