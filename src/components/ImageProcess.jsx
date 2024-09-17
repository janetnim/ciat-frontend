import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useProcessImagesMutation } from '../containers/images/imagesService';

const ImageProcess = () => {
  const { images } = useSelector((state) => state.images);
  const [processImages, { isLoading, isError, error }] = useProcessImagesMutation();
  const {
    control, handleSubmit } = useForm({
    defaultValues: {
      documents: []
    }
  });

  const onFormSubmit = async ({
    documents
  }) => {
    const formData = new FormData();
    documents.map(doc => formData.append('files', doc.file, doc.file.name));
    await processImages(formData);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
    keyName: "documentId"
  });

  const hiddenFileInput = useRef(null);

  const handleAddDocuments = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const files = uploadedFiles.map((file) => ({file}));
    append(files);
    hiddenFileInput.current.value = "";
  };

  return (
    <div className="image-process-container">
      <section className="form">
        <h5 className='form-title'>Images</h5>
        <label htmlFor='file-upload' className='custom-file-upload'>
          <span className='file-upload-icon'>&#128206;</span>
          <span>Select files to upload</span>
        </label>
        <input
          id='file-upload'
          ref={hiddenFileInput}
          type="file"
          multiple
          onChange={handleAddDocuments}
        />
        <button alt="submit" onClick={handleSubmit(onFormSubmit)} disabled={fields.length < 1}>
          Submit
        </button>

        {fields.map(({ documentId, file }, index) => (
          <div key={documentId} className='uploaded-file-names'>
            <Controller
              control={control}
              name={`documents.${index}`}
              render={() => (
                <>
                  <span className="name">{file.name}</span>
                  <span
                    aria-label="Remove"
                    onClick={() => remove(index)}
                  >
                    X
                  </span>
                </>
              )}
            />
          </div>
        ))}
      </section>
      <section className="image-results" hidden={isLoading}>
        <span hidden={!isError} className='error'>{error?.data?.message}</span>
        <i hidden={!isLoading}>Images processing...</i>
        <i hidden={images.length >= 1 || isLoading}>No images to display...</i>
        {images.map((file, index) => (
          <img key={index} src={file.dataUrl} />
        ))}
      </section>
    </div>
  );
};

export default ImageProcess;
