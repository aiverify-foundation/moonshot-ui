import React, { useState } from 'react';
import { PopupSurface } from '@/app/components/popupSurface';
import { useModelsList } from '@/app/hooks/useLLMEndpointList';
import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';
import { ConfigureRequirementsItemCard } from './configureRequirementsItemCard';
import { CookbookAbout } from './cookbookAbout';

type ConfigureAdditionalRequirementsProps = {
  cookbooks: Cookbook[];
  onConfigureEndpointClick: (endpoint: LLMEndpoint) => void;
  onCookbookAboutClick: () => void;
  onCookbookAboutClose: () => void;
};

function ConfigureAdditionalRequirements(
  props: ConfigureAdditionalRequirementsProps
) {
  const {
    cookbooks,
    onConfigureEndpointClick,
    onCookbookAboutClick,
    onCookbookAboutClose,
  } = props;
  const [cookbookDetails, setCookbookDetails] = useState<
    Cookbook | undefined
  >();
  const { models, isLoading } = useModelsList();

  function handleCloseAbout() {
    setCookbookDetails(undefined);
    onCookbookAboutClose();
  }

  function handleAboutClick(cookbook: Cookbook) {
    setCookbookDetails(cookbook);
    onCookbookAboutClick();
  }

  return (
    <div className="flex flex-col pt-4 w-full h-full z-[100]">
      {cookbookDetails ? (
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
          <section className="flex flex-col items-center justify-top gap-5 px-8 h-full">
            <h2 className="text-[1.6rem] leading-[2rem] tracking-wide text-white w-full text-center pt-4">
              Provide these additional requirements
            </h2>
            {!isLoading
              ? cookbooks.map((cookbook) => {
                  const requiredEndpointIds = getEndpointsFromRequiredConfig(
                    cookbook.required_config
                  );
                  const endpoints = models.filter((model) =>
                    requiredEndpointIds.includes(model.id)
                  );
                  return (
                    <ConfigureRequirementsItemCard
                      key={cookbook.id}
                      cookbook={cookbook}
                      requiredEndpoints={endpoints}
                      onConfigureEndpointClick={onConfigureEndpointClick}
                      onAboutClick={handleAboutClick}
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
