import { useState, useTransition } from 'react';
import { updateRecipeDataset } from '@/actions/updateRecipeDatasets';
import { FileSelect } from '@/app/components/fileSelect';
import {
  ErrorWithMessage,
  isApiError,
  toErrorWithMessage,
} from '@/app/lib/error-utils';
import { LoadingAnimation } from '@/app/components/loadingAnimation';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export type FileUpload = {
  file: File;
  progress: number;
  status: UploadStatus;
  id: string;
};

type DatasetUploaderProps = {
  cookbook: Cookbook;
};

const uploadUrl = '/api/v1/datasets/upload'; // This path is defined here because it is the only path that leverages the rewrites in next.config.js

function DatasetUploader(props: DatasetUploaderProps) {
  const { cookbook } = props;
  const [fileUpload, setFileUpload] = useState<FileUpload | null>(null);
  const [error, setError] = useState<ErrorWithMessage | null>(null);
  const [_, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);

  function handleFileChange(files: File[]) {
    if (files.length === 0 || files.length > 1) return;
    setIsPending(true);
    const filesToUpload = Array.from(files);
    const newUpload: FileUpload = {
      file: filesToUpload[0],
      progress: 0,
      status: 'idle',
      id: Math.random().toString(36).substring(2, 9),
    };
    setFileUpload(newUpload);
    uploadDataset(newUpload);
  }

  async function uploadDataset(fileUpload: FileUpload) {
    if (!fileUpload) return;
    const formData = new FormData();
    formData.append('file', fileUpload.file);
    formData.append('name', fileUpload.file.name.split('.')[0]);
    formData.append('description', 'RAG dataset');
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    const result = {
      data: await response.json(),
      status: response.status,
    };
    if (isApiError(result)) {
      setError(toErrorWithMessage(result));
      setFileUpload(null);
      setIsPending(false);
      return;
    }
    startTransition(() => {
      updateRecipeDataset({
        recipeId: cookbook.id,
        datasetIds: [result.data.id],
      }).then((result) => {
        if (result.statusCode !== 200) {
          setError(toErrorWithMessage(result));
          setFileUpload(null);
          setIsPending(false);
        }
      });
    });
  }
  return (
    <section className="flex flex-col items-center text-white bg-moongray-800 h-full rounded-xl pt-8">
      <h3 className="text-[1.6rem] leading-[2rem] tracking-wide mb-8">
        Upload a custom dataset
      </h3>
      <div className="flex flex-col items-center w-[80%] gap-6">
        <div className="flex gap-2 justify-center">
          <FileSelect
            onFilesSelected={handleFileChange}
            disabled={isPending}>
            <FileSelect.Input
              accept=".csv,text/csv"
              multiple
            />
            <FileSelect.DropZone
              className="hover:bg-imdapurple hover:opacity-70 h-[200px]
              w-[500px] !rounded-[20px] px-10 flex items-center justify-center">
              {isPending ? (
                <div className="relative">
                  <LoadingAnimation />
                </div>
              ) : (
                <p className="text-white">Drag and drop CSV file here</p>
              )}
            </FileSelect.DropZone>
          </FileSelect>
        </div>
        {error ? <p className="text-red-500">{error.message}</p> : null}
      </div>
    </section>
  );
}

export { DatasetUploader };
