import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useProcessImagesMutation, useRunTestDataMutation } from '../containers/images/imagesService';

const ImageProcess = () => {
  const { hasImageResults } = useSelector((state) => state.images);
  const [processImages, { isLoading, isError, isSuccess, error }] = useProcessImagesMutation();
  const [runTestData, { isLoading: isLoadingTestData, isSuccess: isSuccessTestData, isError: hasTestDataError, error: testDataError }] = useRunTestDataMutation();
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

  const onProcessTestData = () => {
    handleClearAlllDocuments();
    runTestData();
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

  const handleClearAlllDocuments = () => {
    fields.map(({ documentId, file }, index) => remove(index));
  }

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
        <button alt="submit"
          onClick={handleSubmit(onFormSubmit)}
          disabled={isLoading || isLoadingTestData || fields.length < 1}
        >
          Submit
        </button>

        <button
          alt="process"
          className="test-data"
          onClick={onProcessTestData} disabled={isLoading || isLoadingTestData}
        >
          Run test dataset
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
        <span hidden={!isError && !hasTestDataError} className="error">
          {error?.data?.message || testDataError?.data?.message}
        </span>
        <i hidden={!isLoading && !isLoadingTestData}>Images processing...</i>
        <i hidden={hasImageResults || isLoading || isLoadingTestData}>No images to display...</i>
        <i hidden={!hasImageResults && (!isSuccess || !isSuccessTestData)}>Image Results:</i>
        <div id="images">
        </div>
      </section>
    </div>
  );
};

export default ImageProcess;
