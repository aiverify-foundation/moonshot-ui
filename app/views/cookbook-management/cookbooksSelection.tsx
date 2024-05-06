import { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { calcTotalPromptsAndEstimatedTime } from '@/app/lib/cookbookUtils';
import {
  useGetAllCookbooksQuery,
  useLazyGetAllCookbooksQuery,
} from '@/app/services/cookbook-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { PopupSurface } from '@/app/views/shared-components/popupSurface/popupSurface';
import { TabsMenu, TabItem } from '@/app/views/shared-components/tabsMenu';
import {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  updateBenchmarkCookbooks,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { CookbookAbout } from './cookbookAbout';
import { CookbookSelectionItem } from './cookbookSelectionItem';

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
  const dispatch = useAppDispatch();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const [activeTab, setActiveTab] = useState('quality');
  const [cookbookDetails, setCookbookDetails] = useState<
    Cookbook | undefined
  >();

  // Determine the category
  const category =
    activeTab === 'quality'
      ? 'robustness'
      : activeTab === 'capability'
        ? 'capability'
        : activeTab === 'trustsafety'
          ? 'safety'
          : undefined;

  const { data: cookbooks, isFetching } = useGetAllCookbooksQuery(
    {
      categories: category,
      count: true,
    },
    {
      skip: !category,
    }
  );

  const { totalHours, totalMinutes } =
    calcTotalPromptsAndEstimatedTime(selectedCookbooks);

  function handleTabClick(id: string) {
    setActiveTab(id);
  }

  function handleCookbookSelect(cb: Cookbook) {
    if (selectedCookbooks.some((t) => t.id === cb.id)) {
      dispatch(removeBenchmarkCookbooks([cb]));
    } else {
      dispatch(addBenchmarkCookbooks([cb]));
    }
  }

  function handleAboutClick(cb: Cookbook) {
    console.log(cb);
    setCookbookDetails(cb);
  }

  const categoryDesc =
    activeTab === 'quality'
      ? "Quality evaluates the model's ability to consistently produce content that meets general correctness and application-specific standards."
      : "Capability assesses the AI model's ability to perform within the context of the unique requirements and challenges of a particular domain or task.";

  useEffect(() => {
    if (!cookbooks) return;
    const selectedCookbooksWithCounts = cookbooks.filter((cb) =>
      selectedCookbooks.some((scb) => scb.id === cb.id)
    );
    if (selectedCookbooksWithCounts.length) {
      dispatch(updateBenchmarkCookbooks(selectedCookbooksWithCounts));
    }
  }, [cookbooks]);

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
            className="relative flex flex-col gap-7 pt-6 h-full"
            style={{ height: 'calc(100% - 50px)' }}>
            <p className="text-white px-8">{categoryDesc}</p>
            <ul className="flex flex-row flex-wrap grow gap-[2%] w-[100%] overflow-y-auto custom-scrollbar px-8">
              {isFetching || !cookbooks ? (
                <LoadingAnimation />
              ) : (
                cookbooks.map((cookbook) => {
                  const selected = selectedCookbooks.some(
                    (t) => t.id === cookbook.id
                  );
                  return (
                    <CookbookSelectionItem
                      key={cookbook.id}
                      cookbook={cookbook}
                      selected={selected}
                      onSelect={handleCookbookSelect}
                      onAboutClick={handleAboutClick}
                    />
                  );
                })
              )}
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
                    {totalHours}
                    <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300 mr-2">
                      hrs
                    </span>
                    {totalMinutes}
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
