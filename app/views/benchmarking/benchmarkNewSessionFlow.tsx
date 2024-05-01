import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { CookbooksSelection } from '@/app/views/cookbook-management/cookbooksSelection';
import { ModelSelectView } from '@/app/views/quickstart-home/components/endpointsSelector';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { useAppSelector } from '@/lib/redux';
import { BenchmarkRecommendedTests } from './benchmarkRecommendedTests';
import { BenchmarkTopicsSelection } from './benchmarkTopicsSelection';
import { BenchmarkNewSessionViews } from './enums';

type Props = {
  onCloseIconClick: () => void;
};

const flowSteps = ['Your LLM', 'Recommended Tests', 'Connect Endpoint', 'Run'];

function BenchmarkNewSessionFlow(props: Props) {
  const { onCloseIconClick } = props;
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const [currentView, setCurrentView] = useState<BenchmarkNewSessionViews>(
    BenchmarkNewSessionViews.TOPICS_SELECTION
  );
  const [hiddenNavButtons, setHiddenNavButtons] = useState<[boolean, boolean]>([
    true,
    true,
  ]);

  function changeView(view: BenchmarkNewSessionViews) {
    setCurrentView(view);
  }

  function nextViewHandler() {
    if (currentView === BenchmarkNewSessionViews.RECOMMENDED_TESTS) {
      setCurrentView(BenchmarkNewSessionViews.ENDPOINTS_SELECTION);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.TOPICS_SELECTION) {
      if (selectedCookbooks.length > 0) {
        setCurrentView(BenchmarkNewSessionViews.RECOMMENDED_TESTS);
      }
      return;
    }
  }

  function previousViewHandler() {
    if (currentView === BenchmarkNewSessionViews.RECOMMENDED_TESTS) {
      setCurrentView(BenchmarkNewSessionViews.TOPICS_SELECTION);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
      setCurrentView(BenchmarkNewSessionViews.RECOMMENDED_TESTS);
      return;
    }
  }

  let stepIndex = 0;
  let surfaceColor = colors.moongray['950'];
  let view: React.ReactElement | undefined;

  useLayoutEffect(() => {
    if (currentView === BenchmarkNewSessionViews.TOPICS_SELECTION) {
      setHiddenNavButtons([true, true]);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.COOKBOOKS_SELECTION) {
      setHiddenNavButtons([true, true]);
      return;
    }
  }, [currentView]);

  switch (currentView) {
    case BenchmarkNewSessionViews.TOPICS_SELECTION:
      stepIndex = 0;
      view = (
        <BenchmarkTopicsSelection setHiddenNavButtons={setHiddenNavButtons} />
      );
      break;
    case BenchmarkNewSessionViews.RECOMMENDED_TESTS:
      stepIndex = 1;
      view = (
        <BenchmarkRecommendedTests
          cookbookIds={selectedCookbooks.map((t) => t.id)}
          changeView={changeView}
        />
      );
      break;
    case BenchmarkNewSessionViews.ENDPOINTS_SELECTION:
      stepIndex = 2;
      view = (
        <ModelSelectView onModelSelectClick={(model) => console.dir(model)} />
      );
      break;
    case BenchmarkNewSessionViews.COOKBOOKS_SELECTION:
      stepIndex = 1;
      surfaceColor = colors.moongray['800'];
      view = (
        <CookbooksSelection
          onClose={() => changeView(BenchmarkNewSessionViews.RECOMMENDED_TESTS)}
        />
      );
      break;
  }

  return (
    <MainSectionSurface
      onCloseIconClick={onCloseIconClick}
      height="100%"
      minHeight={750}
      bgColor={surfaceColor}>
      <div className="flex flex-col items-center h-full">
        <div className="w-[700px] flex shrink-0 justify-center">
          <SimpleStepsIndicator
            textColor={colors.moongray[300]}
            stepColor={colors.moonpurplelight}
            steps={flowSteps}
            currentStepIndex={stepIndex}
          />
        </div>
        <div
          className="flex flex-col gap-5 justify-center"
          style={{ height: 'calc(100% - 33px)' }}>
          {!hiddenNavButtons[0] && (
            <div className="flex justify-center">
              <Icon
                name={IconName.WideArrowUp}
                size={28}
                onClick={previousViewHandler}
              />
            </div>
          )}
          {view}
          {!hiddenNavButtons[1] && (
            <div
              className="flex justify-center"
              style={{
                opacity: selectedCookbooks.length > 0 ? 1 : 0.1,
              }}>
              <Icon
                name={IconName.WideArrowDown}
                size={28}
                onClick={
                  selectedCookbooks.length > 0 ? nextViewHandler : undefined
                }
              />
            </div>
          )}
        </div>
      </div>
    </MainSectionSurface>
  );
}

export { BenchmarkNewSessionFlow };
