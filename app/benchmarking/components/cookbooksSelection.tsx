import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import { PopupSurface } from '@/app/components/popupSurface';
import { TabsMenu, TabItem } from '@/app/components/tabsMenu';
import { colors } from '@/app/customColors';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  updateBenchmarkCookbooks,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import config from '@/moonshot.config';
import { CookbookSelectionItem } from './cookbookSelectionItem';

const descQuality =
  "Quality evaluates the model's ability to consistently produce content that meets general correctness and application-specific standards.";
const descCapability =
  "Capability assesses the AI model's ability to perform within the context of the unique requirements and challenges of a particular domain or task.";
const descTrustAndSafety =
  'Trust & Safety addresses the reliability, ethical considerations, and inherent risks of the AI model. It also examines potential scenarios where the AI system could be used maliciously or unethically.';

const CookbookAbout = dynamic(
  () => import('./cookbookAbout').then((mod) => mod.CookbookAbout),
  {
    loading: () => <LoadingAnimation />,
    ssr: true,
  }
);

const tabItems: TabItem<string[]>[] = config.cookbookCategoriesTabs.map(
  (item) => ({
    id: item.id,
    label: item.label,
    data: item.categoryNames,
  })
);

type Props = {
  onClose: () => void;
};

function CookbooksSelection(props: Props) {
  const { onClose } = props;
  const dispatch = useAppDispatch();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const [activeTab, setActiveTab] = useState(tabItems[0]);
  const [cookbookDetails, setCookbookDetails] = useState<
    Cookbook | undefined
  >();

  const excludedCategories = activeTab.data
    ? activeTab.data.reduce<string[]>((acc, cat) => {
        if (cat.startsWith('exclude:')) {
          acc.push(cat.split(':')[1]);
        }
        return acc;
      }, [])
    : undefined;
  const selectedCategories =
    activeTab.data && excludedCategories
      ? activeTab.data.filter(
          (cat) =>
            !excludedCategories.includes(cat) && !cat.startsWith('exclude:')
        )
      : activeTab.data;

  const { data: cookbooks, isFetching } = useGetCookbooksQuery(
    {
      categories:
        selectedCategories && selectedCategories.length > 0
          ? selectedCategories
          : undefined,
      categories_excluded:
        excludedCategories && excludedCategories.length > 0
          ? excludedCategories
          : undefined,
      count: true,
    },
    {
      skip:
        (!selectedCategories || selectedCategories.length === 0) &&
        (!excludedCategories || excludedCategories.length === 0),
    }
  );

  function handleTabClick(tab: TabItem<string[]>) {
    setActiveTab(tab);
  }

  function handleCookbookSelect(cb: Cookbook) {
    if (selectedCookbooks.some((t) => t.id === cb.id)) {
      dispatch(removeBenchmarkCookbooks([cb]));
    } else {
      dispatch(addBenchmarkCookbooks([cb]));
    }
  }

  function handleAboutClick(cb: Cookbook) {
    setCookbookDetails(cb);
  }

  const categoryDesc =
    activeTab.id === 'quality'
      ? descQuality
      : activeTab.id === 'capability'
        ? descCapability
        : activeTab.id === 'trustAndSafety'
          ? descTrustAndSafety
          : '';

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
          padding="10px"
          onCloseIconClick={() => setCookbookDetails(undefined)}>
          <CookbookAbout
            cookbook={cookbookDetails}
            onSelectChange={handleCookbookSelect}
            checked={selectedCookbooks.some(
              (cb) => cb.id === cookbookDetails.id
            )}
          />
        </PopupSurface>
      ) : (
        <PopupSurface
          height="100%"
          headerContent={
            <section className="flex items-center justify-flex-start gap-5 pt-4">
              <TabsMenu
                tabItems={tabItems}
                barColor={colors.moongray['800']}
                tabHoverColor={colors.moongray['700']}
                selectedTabColor={colors.moonpurple}
                textColor={colors.white}
                activeTabId={activeTab.id}
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
            <footer className="flex justify-end items-center bg-moonpurple p-2 px-5 rounded-b-2xl w-full text-white h-[52px] shrink-0">
              {selectedCookbooks.length > 0 && (
                <span
                  role="button"
                  className="text-[1.5rem] decoration-1 underline text-white cursor-pointer"
                  onClick={onClose}>
                  OK
                </span>
              )}
            </footer>
          </section>
        </PopupSurface>
      )}
    </div>
  );
}

export { CookbooksSelection };
