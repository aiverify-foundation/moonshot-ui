'use client';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { CookbooksSelection } from '@/app/views/cookbook-management/cookbooksSelection';
import { NewEndpointForm } from '@/app/views/models-management/newEnpointForm';
import { ModelSelectView } from '@/app/views/quickstart-home/components/endpointsSelector';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { useAppSelector } from '@/lib/redux';
import { BenchmarkRecommendedTests } from './benchmarkRecommendedTests';
import { BenchmarkTopicsSelection } from './benchmarkTopicsSelection';
import { BenchmarkNewSessionViews } from './enums';
import { CookbooksProvider } from './contexts/cookbooksContext';
import BenchmarkRunForm from './benchmarkRunForm';

const flowSteps = ['Your LLM', 'Recommended Tests', 'Connect Endpoint', 'Run'];

function BenchmarkNewSessionFlow() {
  const router = useRouter();
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
    if (currentView === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
      setCurrentView(BenchmarkNewSessionViews.BENCHMARK_RUN_FORM);
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
    if (currentView === BenchmarkNewSessionViews.BENCHMARK_RUN_FORM) {
      setCurrentView(BenchmarkNewSessionViews.ENDPOINTS_SELECTION);
      return;
    }
  }

  let stepIndex = 0;
  let surfaceColor = colors.moongray['950'];
  let view: React.ReactElement | undefined;

  useLayoutEffect(() => {
    if (
      currentView === BenchmarkNewSessionViews.TOPICS_SELECTION ||
      currentView === BenchmarkNewSessionViews.COOKBOOKS_SELECTION
    ) {
      setHiddenNavButtons([true, true]);
      return;
    }
    if (
      currentView === BenchmarkNewSessionViews.RECOMMENDED_TESTS ||
      currentView === BenchmarkNewSessionViews.ENDPOINTS_SELECTION
    ) {
      setHiddenNavButtons([false, false]);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.NEW_ENDPOINT_FORM) {
      setHiddenNavButtons([true, true]);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.BENCHMARK_RUN_FORM) {
      setHiddenNavButtons([false, true]);
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
      view = <BenchmarkRecommendedTests changeView={changeView} />;
      break;
    case BenchmarkNewSessionViews.ENDPOINTS_SELECTION:
      stepIndex = 2;
      view = (
        <ModelSelectView
          onModelSelectClick={(model) => console.dir(model)}
          changeView={changeView}
        />
      );
      break;
    case BenchmarkNewSessionViews.NEW_ENDPOINT_FORM:
      stepIndex = 2;
      surfaceColor = colors.moongray['800'];
      view = (
        <NewEndpointForm
          onClose={() =>
            changeView(BenchmarkNewSessionViews.ENDPOINTS_SELECTION)
          }
        />
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
    case BenchmarkNewSessionViews.BENCHMARK_RUN_FORM:
      stepIndex = 3;
      surfaceColor = colors.moongray['800'];
      view = <BenchmarkRunForm />;
      break;
  }

  return (
    <CookbooksProvider>
      <MainSectionSurface
        onCloseIconClick={() => router.push('/benchmarking')}
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
            className="flex flex-col gap-5 justify-center w-full"
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
    </CookbooksProvider>
  );
}

export { BenchmarkNewSessionFlow };
