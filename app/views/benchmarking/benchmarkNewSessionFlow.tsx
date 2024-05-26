'use client';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import { CookbooksSelection } from '@/app/views/cookbook-management/cookbooksSelection';
import { EndpointSelectVew } from '@/app/views/models-management/endpointsSelector';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { Modal } from '@/app/views/shared-components/modal/modal';
import {
  addBenchmarkModels,
  removeBenchmarkModels,
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { BenchmarkDefaultSelection } from './benchmarkDefaultSelection';
import { BenchmarkMainCookbooksPromptCount } from './benchmarkMainCookbooksPromptCount';
import BenchmarkRunForm from './benchmarkRunForm';
import { CookbooksProvider } from './contexts/cookbooksContext';
import { BenchmarkNewSessionViews } from './enums';

const flowSteps = ['Your LLM', 'Recommended Tests', 'Connect Endpoint', 'Run'];

function BenchmarkNewSessionFlow() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const selectedModels = useAppSelector(
    (state) => state.benchmarkModels.entities
  );
  const [currentView, setCurrentView] = useState<BenchmarkNewSessionViews>(
    BenchmarkNewSessionViews.TOPICS_SELECTION
  );
  const [endpointToEdit, setEndpointToEdit] = useState<
    LLMEndpoint | undefined
  >();
  const [hiddenNavButtons, setHiddenNavButtons] = useState<[boolean, boolean]>([
    true,
    true,
  ]);
  const [showExitModal, setShowExitModal] = useState(false);

  function changeView<T = undefined>(view: BenchmarkNewSessionViews, data?: T) {
    if (view === BenchmarkNewSessionViews.EDIT_ENDPOINT_FORM) {
      setEndpointToEdit(data as LLMEndpoint);
    }
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

  function handleOnCloseIconClick() {
    setShowExitModal(true);
  }

  function handleExitWorkflow() {
    dispatch(resetBenchmarkCookbooks());
    dispatch(resetBenchmarkModels());
    router.push('/benchmarking');
  }

  function handleModelClick(model: LLMEndpoint) {
    if (selectedModels.find((endpoint) => endpoint.id === model.id)) {
      dispatch(removeBenchmarkModels([model]));
    } else {
      dispatch(addBenchmarkModels([model]));
    }
  }

  let stepIndex = 0;
  let disableNextBtn = false;
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
    if (
      currentView === BenchmarkNewSessionViews.NEW_ENDPOINT_FORM ||
      currentView === BenchmarkNewSessionViews.EDIT_ENDPOINT_FORM
    ) {
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
      if (selectedCookbooks.length === 0) disableNextBtn = true;
      view = (
        <BenchmarkDefaultSelection setHiddenNavButtons={setHiddenNavButtons} />
      );
      break;
    case BenchmarkNewSessionViews.RECOMMENDED_TESTS:
      stepIndex = 1;
      view = <BenchmarkMainCookbooksPromptCount changeView={changeView} />;
      break;
    case BenchmarkNewSessionViews.ENDPOINTS_SELECTION:
      stepIndex = 2;
      if (selectedModels.length === 0) disableNextBtn = true;
      view = (
        <EndpointSelectVew
          selectedModels={selectedModels}
          totalSelected={selectedModels.length}
          onModelClick={handleModelClick}
          onEditClick={(model) =>
            changeView(BenchmarkNewSessionViews.EDIT_ENDPOINT_FORM, model)
          }
          onCreateClick={() =>
            changeView(BenchmarkNewSessionViews.NEW_ENDPOINT_FORM)
          }
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
    case BenchmarkNewSessionViews.EDIT_ENDPOINT_FORM:
      stepIndex = 2;
      surfaceColor = colors.moongray['800'];
      view = (
        <NewEndpointForm
          endpointToEdit={endpointToEdit}
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
      surfaceColor = colors.moongray['950'];
      view = <BenchmarkRunForm />;
      break;
  }

  return (
    <>
      {showExitModal && (
        <Modal
          heading="Exit this workflow?"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Exit Workflow"
          secondaryBtnLabel="Cancel"
          enableScreenOverlay
          onCloseIconClick={() => setShowExitModal(false)}
          onPrimaryBtnClick={handleExitWorkflow}
          onSecondaryBtnClick={() => setShowExitModal(false)}>
          <p className="text-[0.9rem] pt-3">
            If you exit this workflow now, your progress will not be saved.{' '}
            <br />
            You should complete this workflow before exiting.
          </p>
        </Modal>
      )}
      <CookbooksProvider>
        <MainSectionSurface
          onCloseIconClick={handleOnCloseIconClick}
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
                  style={{ opacity: disableNextBtn ? 0.3 : 1 }}>
                  <Icon
                    name={IconName.WideArrowDown}
                    size={28}
                    onClick={disableNextBtn ? undefined : nextViewHandler}
                  />
                </div>
              )}
            </div>
          </div>
        </MainSectionSurface>
      </CookbooksProvider>
    </>
  );
}

export { BenchmarkNewSessionFlow };
