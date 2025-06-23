import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import {
  updateAllCookbooks,
  useCookbooks,
} from '@/app/benchmarking/contexts/cookbooksContext';
import { ImdaStarterKitLink } from '@/app/components/link-constants';
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
const descImdaStarterKit =(
  <>
        {"Includes tests from IMDA's "} <ImdaStarterKitLink />{" to assess model or application's capability to respond to key risks like hallucination, undesirable content, data disclosure and adversarial prompts in a safe and trustworthy manner."}
  </>
);
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
  onCookbookSelected: (selectedCookbooks: Cookbook[]) => void;
  onCookbookUnselected: (selectedCookbooks: Cookbook[]) => void;
  onCookbookAboutClick: () => void;
  onCookbookAboutClose: () => void;
};

function CookbooksSelection(props: Props) {
  const {
    onCookbookSelected,
    onCookbookUnselected,
    onCookbookAboutClick,
    onCookbookAboutClose,
  } = props;
  const dispatch = useAppDispatch();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const [activeTab, setActiveTab] = useState(tabItems[0]);
  const [cookbookDetails, setCookbookDetails] = useState<
    Cookbook | undefined
  >();

  const [_, setAllCookbooks, isFirstCookbooksFetch, setIsFirstCookbooksFetch] =
    useCookbooks();

  const { data: allCookbooks, isFetching: isFetchingAllCookbooks } =
    useGetCookbooksQuery(
      {
        count: true,
      },
      { skip: !isFirstCookbooksFetch }
    );

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

  const { data: cookbooks = [], isFetching } = useGetCookbooksQuery(
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

  const orderedCookbooks = React.useMemo(() => {
    if (!cookbooks) return [];
    const order = config.cookbooksOrder;
    const ordered = [...cookbooks].sort((a, b) => {
      const indexA = order.indexOf(a.id);
      const indexB = order.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    return ordered;
  }, [cookbooks]);

  useEffect(() => {
    if (isFetchingAllCookbooks) return;
    if (isFirstCookbooksFetch && allCookbooks) {
      updateAllCookbooks(setAllCookbooks, allCookbooks);
      setIsFirstCookbooksFetch(false);
    }
  }, [isFetchingAllCookbooks, allCookbooks]);

  function handleTabClick(tab: TabItem<string[]>) {
    setActiveTab(tab);
  }

  function handleCookbookSelect(cb: Cookbook) {
    if (selectedCookbooks.some((t) => t.id === cb.id)) {
      dispatch(removeBenchmarkCookbooks([cb]));
      const updatedSelectedCookbooks = selectedCookbooks.filter(
        (c) => c.id !== cb.id
      );
      onCookbookUnselected(updatedSelectedCookbooks);
    } else {
      dispatch(addBenchmarkCookbooks([cb]));
      const updatedSelectedCookbooks = [...selectedCookbooks, cb];
      onCookbookSelected(updatedSelectedCookbooks);
    }
  }

  function handleAboutClick(cb: Cookbook) {
    setCookbookDetails(cb);
    onCookbookAboutClick();
  }

  function handleCloseAbout() {
    setCookbookDetails(undefined);
    onCookbookAboutClose();
  }

  const categoryDesc =
    activeTab.id === 'quality'
      ? descQuality
      : activeTab.id === 'capability'
        ? descCapability
        : activeTab.id === 'trustAndSafety'
          ? descTrustAndSafety
          : activeTab.id === 'imdaStarterKit'
            ? descImdaStarterKit
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
    <div className="flex flex-col pt-4 w-full h-full z-[100] overflow-y-hidden">
      {cookbookDetails ? (
        <PopupSurface
          height="100%"
          padding="10px"
          onCloseIconClick={handleCloseAbout}>
          <CookbookAbout
            cookbook={cookbookDetails}
            onSelectChange={handleCookbookSelect}
            checked={selectedCookbooks.some(
              (cb) => cb.id === cookbookDetails.id
            )}
          />
        </PopupSurface>
      ) : (
        <React.Fragment>
          <section className="flex flex-col items-center justify-center gap-5 px-8">
            <h2 className="text-[1.6rem] leading-[2rem] tracking-wide text-white w-full text-center">
              Select the cookbooks you want to run
            </h2>
            <div className="flex flex-col gap-5 w-full">
              <TabsMenu
                tabItems={tabItems}
                barColor={colors.moongray['800']}
                tabHoverColor={colors.moongray['700']}
                selectedTabColor={colors.moonpurple}
                textColor={colors.white}
                activeTabId={activeTab.id}
                onTabClick={handleTabClick}
              />
              <p className="flex-1 text-white px-8 text-[0.9rem] min-h-[65px]">
                {categoryDesc}
              </p>
            </div>
          </section>
          <section
            className="relative flex flex-col gap-7 mt-8 h-full"
            style={{ height: 'calc(100% - 155px)' }}>
            <ul className="flex flex-row flex-wrap grow gap-[2%] w-[100%] overflow-y-auto custom-scrollbar px-8 pb-[100px]">
              {isFetching ? (
                <LoadingAnimation />
              ) : cookbooks.length === 0 ? (
                <div className="text-white">No cookbooks found</div>
              ) : (
                orderedCookbooks.map((cookbook) => {
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
          </section>
        </React.Fragment>
      )}
    </div>
  );
}

export { CookbooksSelection };
