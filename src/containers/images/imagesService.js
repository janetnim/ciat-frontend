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
                path: zipEntry.unsafeOriginalName
              });
            });

            const stuff = await Promise.all(promises).then(function () {
              const newValues = [];
              const canvas = document.createElement('canvas');
              Object.entries(extractedFiles).map(async ([key, val]) =>
                {
                  var content = await val.content;
                  // const ctx = canvas.getContext('2d');
                  // ctx.font = '30px Arial';
                  // ctx.fillText(content, 10, 50);
                  const dataUrl = canvas.toDataURL();
                  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', {content});
                  // var image = new Image();
                  // image.onload = function(){
                  //   console.log(image.width); // image is loaded and we have image width
                  // }
                  // image.src = dataUrl;
                  // document.body.appendChild(image);
                  var newImage = document.createElement('img');
                  newImage.src = dataUrl;
                  // newImage.width = newImage.height = "80";
                  // document.querySelector('#imageContainer').innerHTML = newImage.outerHTML;
                  // console.log('|||||||||', {val}, {content});

                  newValues.push({name: val.name, content: content, path: val.path, dataUrl: "data:image/png;base64," + content});
                }
              );

              return newValues;
            });

            console.log('|||||||||stuff', {stuff});

            // new_zip.loadAsync(data).then(function(resp) {
            //     // var jsonFile = await zipped.file("theJsonFile.json").async("text");
            //     console.log('???????????????resp', resp.files);
            //     const fileNames = Object.keys(resp.files);
            //     fileNames.map(name => console.log('===========', resp.files[name]));
            //     fileNames.map(name => console.log('===========', window.URL.createObjectURL(resp.files[name])));
            //     // resp.files.map(([key, val]) => console.log('===========', {key}, {val}));
            // })
            return { data: stuff };
          },
          headers: {
            // "content-type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        };
      },
    }),
  }),
});

export const { useProcessImagesMutation } = imagesApi;
