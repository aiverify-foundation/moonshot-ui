import React, { useEffect, useState, useTransition } from 'react';
import { getAllEndpoints } from '@/actions/getAllEndpoints';
import { PopupSurface } from '@/app/components/popupSurface';
import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';
import { ConfigureRequirementsItemCard } from './configureRequirementsItemCard';
import { CookbookAbout } from './cookbookAbout';
import { DatasetUploader } from './datasetUploader';

type ConfigureAdditionalRequirementsProps = {
  cookbooks: Cookbook[];
  onConfigureEndpointClick: (endpoint: LLMEndpoint) => void;
  onCookbookAboutClick: () => void;
  onCookbookAboutClose: () => void;
  onUploadDatasetClick: () => void;
  onUploadDatasetClose: () => void;
};

function ConfigureAdditionalRequirements(
  props: ConfigureAdditionalRequirementsProps
) {
  const {
    cookbooks,
    onConfigureEndpointClick,
    onCookbookAboutClick,
    onCookbookAboutClose,
    onUploadDatasetClick,
    onUploadDatasetClose,
  } = props;
  const [showUploader, setShowUploader] = useState(false);
  const [cookbookDetails, setCookbookDetails] = useState<
    Cookbook | undefined
  >();
  const [cookbookToUploadDataset, setCookbookToUploadDataset] = useState<
    Cookbook | undefined
  >();
  const [isPending, startTransition] = useTransition();
  const [endpoints, setEndpoints] = useState<LLMEndpoint[]>([]);

  useEffect(() => {
    async function callServerAction() {
      startTransition(async () => {
        const result = await getAllEndpoints();
        if (result.status === 'success') {
          setEndpoints(result.data);
        }
      });
    }
    callServerAction();
  }, []);

  function handleCloseAbout() {
    setCookbookDetails(undefined);
    onCookbookAboutClose();
  }

  function handleAboutClick(cookbook: Cookbook) {
    setCookbookDetails(cookbook);
    onCookbookAboutClick();
  }

  function handleDatasetUploaderClick(cookbook: Cookbook) {
    setCookbookToUploadDataset(cookbook);
    setShowUploader(true);
    onUploadDatasetClick();
  }

  function handleDatasetUploaderClose() {
    setShowUploader(false);
    onUploadDatasetClose();
  }

  function handleUploadCompleted() {
    setCookbookToUploadDataset(undefined);
    setShowUploader(false);
    onUploadDatasetClose();
  }

  return (
    <div className="flex flex-col w-full h-full z-[100] overflow-y-auto custom-scrollbar">
      {showUploader && cookbookToUploadDataset ? (
        <PopupSurface
          height="100%"
          padding="10px"
          onCloseIconClick={handleDatasetUploaderClose}>
          <DatasetUploader
            cookbook={cookbookToUploadDataset}
            onUploadSuccess={handleUploadCompleted}
          />
        </PopupSurface>
      ) : cookbookDetails ? (
        <PopupSurface
          height="100%"
          padding="10px"
          onCloseIconClick={handleCloseAbout}>
          <CookbookAbout
            cookbook={cookbookDetails}
            onSelectChange={() => null}
            checked={true}
          />
        </PopupSurface>
      ) : (
        <React.Fragment>
          <section className="flex flex-col items-center justify-top gap-5 px-8 mb-4">
            <h2 className="text-[1.6rem] leading-[2rem] tracking-wide text-white w-full text-center pt-4">
              Provide these additional requirements
            </h2>
            {!isPending
              ? cookbooks.map((cookbook) => {
                  const requiredEndpointIds = getEndpointsFromRequiredConfig(
                    cookbook.required_config
                  );
                  const requiredEndpoints = endpoints.filter((model) =>
                    requiredEndpointIds.includes(model.id)
                  );
                  return (
                    <ConfigureRequirementsItemCard
                      key={cookbook.id}
                      cookbook={cookbook}
                      requiredEndpoints={requiredEndpoints}
                      onConfigureEndpointClick={onConfigureEndpointClick}
                      onAboutClick={handleAboutClick}
                      onUploadDatasetClick={handleDatasetUploaderClick}
                    />
                  );
                })
              : null}
          </section>
        </React.Fragment>
      )}
    </div>
  );
}

export { ConfigureAdditionalRequirements };
