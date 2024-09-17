import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import JSZip from 'jszip';

export const imagesApi = createApi({
  reducerPath: 'imagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:8080/',
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
    processImages: builder.mutation({
      query(files) {
        return {
          url: '/v1/batch-process',
          method: 'POST',
          body: files,
          responseHandler: async (response) => {
            const data = await response.blob();
            const new_zip = new JSZip();
            const zipFile = await new_zip.loadAsync(data, { base64: true });
            let extractedFiles = [];
            const promises = [];

            zipFile.forEach((relativePath, zipEntry) => {
              promises.push(new_zip.file(zipEntry.name).async("text"));

              extractedFiles.push({
                name: zipEntry.name,
                content: zipEntry.async('text'),
              });
            });

            const unzippedResponse = await Promise.all(promises).then(function () {
              const newValues = [];
              const canvas = document.createElement('canvas');
              Object.entries(extractedFiles).map(async ([key, val]) =>
                {
                  var content = await val.content;
                  const dataUrl = canvas.toDataURL();
                  newValues.push({name: val.name, content: content, dataUrl: dataUrl});
                }
              );

              return newValues;
            });

            return { data: unzippedResponse };
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
