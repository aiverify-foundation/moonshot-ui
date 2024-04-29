import { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';
import { PopupSurface } from '@/app/views/shared-components/popupSurface.tsx/popupSurface';
import { TabsMenu, TabItem } from '@/app/views/shared-components/tabsMenu';
import { CookbookAbout } from './cookbookAbout';
import { CookbookSelectionItem } from './cookbookSelectionItem';
import { mockCookbooksCapability, mockCookbooksQuality } from './mockData';

const tabItems: TabItem[] = [
  { id: 'quality', label: 'Quality' },
  { id: 'capability', label: 'Capability' },
  { id: 'trustsafety', label: 'Trust & Safety' },
  { id: 'others', label: 'Others' },
];

type Props = {
  onClose: () => void;
};

function CookbooksSelection(props: Props) {
  const { onClose } = props;
  const [activeTab, setActiveTab] = useState('quality');
  const [cookbookDetails, setCookbookDetails] = useState<
    CookbookWithRecipe | undefined
  >();

  function handleTabClick(id: string) {
    setActiveTab(id);
  }

  function handleCookbookSelect(cb: CookbookWithRecipe) {
    console.log(cb);
  }

  function handleAboutClick(cb: CookbookWithRecipe) {
    console.log(cb);
    setCookbookDetails(cb);
  }

  const cookbooks =
    activeTab === 'quality' ? mockCookbooksQuality : mockCookbooksCapability;

  const categoryDesc =
    activeTab === 'quality'
      ? "Quality evaluates the model's ability to consistently produce content that meets general correctness and application-specific standards."
      : "Capability assesses the AI model's ability to perform within the context of the unique requirements and challenges of a particular domain or task.";

  return (
    <div className="flex flex-col pt-4 w-full h-full">
      {cookbookDetails ? (
        <PopupSurface
          height="100%"
          padding="0px"
          onCloseIconClick={() => setCookbookDetails(undefined)}>
          <CookbookAbout
            cookbook={cookbookDetails}
            checked
          />
        </PopupSurface>
      ) : (
        <PopupSurface
          height="100%"
          onCloseIconClick={onClose}
          headerContent={
            <section className="flex items-center justify-flex-start gap-5 pt-4">
              <TabsMenu
                tabItems={tabItems}
                barColor={colors.moongray['800']}
                tabHoverColor={colors.moongray['700']}
                selectedTabColor={colors.moonpurple}
                textColor={colors.white}
                activeTabId={activeTab}
                onTabClick={handleTabClick}
              />
            </section>
          }>
          <section
            className="flex flex-col gap-7 pt-6 h-full"
            style={{ height: 'calc(100% - 50px)' }}>
            <p className="text-white px-8">{categoryDesc}</p>
            <ul className="flex flex-row flex-wrap grow gap-[2%] w-[100%] overflow-y-auto custom-scrollbar px-8">
              {cookbooks.map((cookbook) => (
                <CookbookSelectionItem
                  key={cookbook.id}
                  cookbook={cookbook}
                  selected={false}
                  onSelect={handleCookbookSelect}
                  onAboutClick={handleAboutClick}
                />
              ))}
            </ul>
            <footer className="flex justify-between items-center bg-moonpurple p-2 px-5 rounded-b-2xl w-full text-white">
              <div className="flex gap-5">
                <div className="flex flex-col justify-center">
                  <div className="text-[1rem] leading-[1.1rem] text-end">
                    Estimated time
                  </div>
                  <div className="text-[0.8rem] leading-[1.1rem] text-moongray-300 text-end">
                    assuming <span className="decoration-1 underline">10s</span>{' '}
                    per prompt
                  </div>
                </div>
                <div className="flex">
                  <h3 className="text-[2.4rem] font-bolder tracking-wide leading-[3rem] text-white mb-0">
                    13
                    <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
                      hrs
                    </span>
                    48
                    <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
                      mins
                    </span>
                  </h3>
                </div>
              </div>
              <span
                className="text-[1.5rem] decoration-1 underline text-white cursor-pointer"
                onClick={onClose}>
                OK
              </span>
            </footer>
          </section>
        </PopupSurface>
      )}
    </div>
  );
}

export { CookbooksSelection };
