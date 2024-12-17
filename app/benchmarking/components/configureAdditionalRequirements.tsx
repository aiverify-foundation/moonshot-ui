import React, { useState } from 'react';
import { ConfigureRequirementsItemCard } from './configureRequirementsItemCard';
import { CookbookAbout } from './cookbookAbout';
import { PopupSurface } from '@/app/components/popupSurface';
type ConfigureAdditionalRequirementsProps = {
  cookbooks: Cookbook[];
  onCookbookAboutClick: () => void;
  onCookbookAboutClose: () => void;
};

function ConfigureAdditionalRequirements(
  props: ConfigureAdditionalRequirementsProps
) {
  const { cookbooks, onCookbookAboutClick, onCookbookAboutClose } = props;
  const [cookbookDetails, setCookbookDetails] = useState<
    Cookbook | undefined
  >();
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
            {cookbooks.map((cookbook) => (
              <ConfigureRequirementsItemCard
                key={cookbook.id}
                cookbook={cookbook}
                onAboutClick={handleAboutClick}
              />
            ))}
          </section>
        </React.Fragment>
      )}
    </div>
  );
}

export { ConfigureAdditionalRequirements };
