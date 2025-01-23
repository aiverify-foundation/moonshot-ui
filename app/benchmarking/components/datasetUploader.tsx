import Link from 'next/link';
import { useState, useTransition } from 'react';
import { updateRecipeDataset } from '@/actions/updateRecipeDatasets';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { FileSelect } from '@/app/components/fileSelect';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import { colors } from '@/app/customColors';
import {
  ErrorWithMessage,
  isApiError,
  toErrorWithMessage,
} from '@/app/lib/error-utils';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export type FileUpload = {
  file: File;
  progress: number;
  status: UploadStatus;
  id: string;
};

type DatasetUploaderProps = {
  cookbook: Cookbook;
  onUploadSuccess: () => void;
};

const uploadUrl = '/api/v1/datasets/file'; // path is defined here because it is the only path that leverages the rewrites in next.config.js

function DatasetUploader(props: DatasetUploaderProps) {
  const { cookbook, onUploadSuccess } = props;
  const [fileUpload, setFileUpload] = useState<FileUpload | null>(null);
  const [error, setError] = useState<[string, ErrorWithMessage] | null>(null);
  const [_, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);

  function handleFileChange(files: File[]) {
    setError(null);
    if (files.length === 0) return;
    setIsPending(true);
    const droppedFiles = Array.from(files);
    const allowedExtensions = ['json', 'csv'];
    const fileExtension = droppedFiles[0].name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setError([
        droppedFiles[0].name,
        toErrorWithMessage({ message: 'Only .json and .csv files are supported' })
      ]);
      setIsPending(false);
      return;
    }
    const newUpload: FileUpload = {
      file: droppedFiles[0],
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
      console.log('error', toErrorWithMessage(result));
      setError([fileUpload.file.name, toErrorWithMessage(result)]);
      setFileUpload(null);
      setIsPending(false);
      return;
    }
    if (cookbook.recipes.length === 0) {
      setError([
        fileUpload.file.name,
        toErrorWithMessage({ message: 'No recipe found' }),
      ]);
      setFileUpload(null);
      setIsPending(false);
      return;
    }
    startTransition(() => {
      updateRecipeDataset({
        recipeId: cookbook.recipes[0],
        datasetIds: [result.data],
      }).then((result) => {
        if (result.statusCode !== 200) {
          setError([fileUpload.file.name, toErrorWithMessage(result)]);
          setFileUpload(null);
          setIsPending(false);
          return;
        }
        onUploadSuccess();
      });
    });
  }
  return (
    <section className="flex flex-col items-center text-white bg-moongray-800 h-full rounded-xl pt-8">
      <h3 className="text-[1.6rem] leading-[2rem] tracking-wide mb-8">
        Upload a custom dataset
      </h3>
      <div className="flex flex-col items-center w-[80%] gap-6">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="mb-[40px] flex gap-4">
            <Link
              href="/rag-sample-dataset.json"
              target="_blank">
              <Button
                mode={ButtonType.OUTLINE}
                hoverBtnColor={colors.moongray[700]}
                pressedBtnColor={colors.moongray[900]}
                size="sm"
                text="View JSON example"
                leftIconName={IconName.Download}
              />
            </Link>
            <Link
              href="/rag-sample-dataset.csv"
              target="_blank">
              <Button
                mode={ButtonType.OUTLINE}
                hoverBtnColor={colors.moongray[700]}
                pressedBtnColor={colors.moongray[900]}
                size="sm"
                text="View CSV example"
                leftIconName={IconName.Download}
              />
            </Link>
          </div>
          <FileSelect
            onFilesSelected={handleFileChange}
            disabled={isPending}>
            <FileSelect.Input
              accept=".csv,text/csv"
              multiple
            />
            <FileSelect.DropZone
              className="hover:bg-moongray-700 hover:opacity-70 h-[200px]
              w-[500px] !rounded-[20px] px-10 flex items-center justify-center">
              {isPending ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-[80px]">
                    <LoadingAnimation />
                  </div>
                  <p className="text-white">
                    Uploading {fileUpload?.file.name}
                  </p>
                </div>
              ) : (
                <p className="text-white">Drag and drop CSV file here</p>
              )}
            </FileSelect.DropZone>
          </FileSelect>
        </div>
        {error ? (
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-start gap-2">
              <Icon
                name={IconName.Alert}
                size={24}
                color="red"
              />
              <div>
                <h4 className="text-[1rem] leading-[1.5rem] tracking-wide text-moongray-400">
                  {error[0]}
                </h4>
                <p className="text-red-500">{error[1].message}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { DatasetUploader };
