'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CookbooksSelection } from '@/app/benchmarking/components/cookbooksSelection';
import { EndpointSelector } from '@/app/benchmarking/components/endpointsSelector';
import { CookbooksProvider } from '@/app/benchmarking/contexts/cookbooksContext';
import { Icon, IconName } from '@/app/components/IconSVG';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { Modal } from '@/app/components/modal';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { colors } from '@/app/customColors';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';
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
import {
  benchmarkNewSessionFlowReducer,
  initialState,
  threeStepsFlowInitialState,
} from './benchmarkNewSessionFlowReducer';
import BenchmarkRunForm from './benchmarkRunForm';
import { BenchmarkNewSessionViews } from './enums';

type BenchmarkNewSessionFlowProps = {
  threeStepsFlow?: boolean;
};

function BenchmarkNewSessionFlow(props: BenchmarkNewSessionFlowProps) {
  const { threeStepsFlow = false } = props;
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const [flowState, dispatch] = React.useReducer(
    benchmarkNewSessionFlowReducer,
    threeStepsFlow ? threeStepsFlowInitialState : initialState
  );
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const selectedModels = useAppSelector(
    (state) => state.benchmarkModels.entities
  );
  const [showExitModal, setShowExitModal] = React.useState(false);

  function handleNextIconClick() {
    if (flowState.view === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
      const requiredEndpoints = selectedCookbooks.reduce((acc, cookbook) => {
        return [
          ...acc,
          ...getEndpointsFromRequiredConfig(cookbook.required_config),
        ];
      }, [] as string[]);
      dispatch({
        type: 'NEXT_BTN_CLICK',
        cookbooksLength: selectedCookbooks.length,
        modelsLength: selectedModels.length,
        requiredEndpoints,
      });
      return;
    }

    dispatch({
      type: 'NEXT_BTN_CLICK',
      cookbooksLength: selectedCookbooks.length,
      modelsLength: selectedModels.length,
    });
  }

  function handlePreviousIconClick() {
    dispatch({
      type: 'PREV_BTN_CLICK',
      cookbooksLength: selectedCookbooks.length,
      modelsLength: selectedModels.length,
    });
  }

  function handleOnCloseIconClick() {
    setShowExitModal(true);
  }

  function handleExitWorkflow() {
    appDispatch(resetBenchmarkCookbooks());
    appDispatch(resetBenchmarkModels());
    router.push('/benchmarking');
  }

  function handleModelClick(model: LLMEndpoint) {
    if (selectedModels.find((endpoint) => endpoint.id === model.id)) {
      appDispatch(removeBenchmarkModels([model]));
      dispatch({
        type: 'MODEL_SELECTION_CLICK',
        modelsLength: selectedModels.length - 1,
      });
    } else {
      appDispatch(addBenchmarkModels([model]));
      dispatch({
        type: 'MODEL_SELECTION_CLICK',
        modelsLength: selectedModels.length + 1,
      });
    }
  }

  function handleEditModelClick(model: LLMEndpoint) {
    dispatch({
      type: 'EDIT_MODEL_CLICK',
      modelToEdit: model,
    });
  }

  function handleCreateModelClick() {
    dispatch({
      type: 'CREATE_MODEL_CLICK',
    });
  }

  let surfaceColor = colors.moongray['950'];
  let view: React.ReactElement | undefined;

  switch (flowState.view) {
    case BenchmarkNewSessionViews.TOPICS_SELECTION:
      view = (
        <BenchmarkDefaultSelection
          selectedCookbooks={selectedCookbooks}
          onCookbookSelected={() =>
            dispatch({
              type: 'COOKBOOK_SELECTION_CLICK',
              cookbooksLength: selectedCookbooks.length + 1,
            })
          }
          onCookbookUnselected={() =>
            dispatch({
              type: 'COOKBOOK_SELECTION_CLICK',
              cookbooksLength: selectedCookbooks.length - 1,
            })
          }
        />
      );
      break;
    case BenchmarkNewSessionViews.RECOMMENDED_TESTS:
      view = (
        <BenchmarkMainCookbooksPromptCount
          selectedCookbooks={selectedCookbooks}
          onCookbooksLinkClick={() =>
            dispatch({ type: 'MORE_COOKBOOKS_LINK_CLICK' })
          }
        />
      );
      break;
    case BenchmarkNewSessionViews.ENDPOINTS_SELECTION:
      view = (
        <EndpointSelector
          selectedModels={selectedModels}
          totalSelected={selectedModels.length}
          onModelClick={handleModelClick}
          onEditClick={handleEditModelClick}
          onCreateClick={handleCreateModelClick}
        />
      );
      break;
    case BenchmarkNewSessionViews.NEW_ENDPOINT_FORM:
      surfaceColor = colors.moongray['800'];
      view = (
        <NewEndpointForm
          onClose={() =>
            dispatch({
              type: 'CLOSE_MODEL_FORM',
              modelsLength: selectedModels.length,
            })
          }
        />
      );
      break;
    case BenchmarkNewSessionViews.EDIT_ENDPOINT_FORM:
      surfaceColor = colors.moongray['800'];
      view = (
        <NewEndpointForm
          endpointToEdit={flowState.modelToEdit}
          onClose={() => dispatch({ type: 'CLOSE_MODEL_FORM' })}
        />
      );
      break;
    case BenchmarkNewSessionViews.COOKBOOKS_SELECTION:
      surfaceColor = colors.moongray['800'];
      view = (
        <CookbooksSelection
          isThreeStepsFlow={flowState.isThreeStepsFlow}
          onClose={() =>
            dispatch({
              type: 'CLOSE_MORE_COOKBOOKS',
            })
          }
        />
      );
      break;
    case BenchmarkNewSessionViews.BENCHMARK_RUN_FORM:
      surfaceColor = colors.moongray['950'];
      view = (
        <BenchmarkRunForm
          selectedCookbooks={selectedCookbooks}
          selectedEndpoints={selectedModels}
        />
      );
      break;
  }

  return (
    <React.Fragment>
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
      {flowState.requiredEndpoints && flowState.requiredEndpoints.length > 0 ? (
        <Modal
          width={600}
          height={280}
          heading=""
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Yes"
          secondaryBtnLabel="No"
          enableScreenOverlay
          hideCloseIcon
          onSecondaryBtnClick={() =>
            dispatch({
              type: 'CLOSE_REQUIRED_ENDPOINTS_MODAL',
              requiredEndpointsTokensFilled: false,
            })
          }
          onPrimaryBtnClick={() =>
            dispatch({
              type: 'CLOSE_REQUIRED_ENDPOINTS_MODAL',
              requiredEndpointsTokensFilled: true,
            })
          }>
          <div className="flex gap-4 items-start mt-1">
            <Icon
              size={30}
              name={IconName.OutlineBox}
              color={colors.moonpurplelight}
              style={{ marginTop: 4 }}
            />
            <h3 className="text-[1rem] font-medium tracking-wide justify-center text-moonpurplelight">
              Have you entered API key(s) for the following endpoint(s) to run
              the selected test(s)?
            </h3>
          </div>

          <ul className="text-white mt-4 p-4 list-disc list-inside h-[120px] overflow-y-auto custom-scrollbar">
            {flowState.requiredEndpoints.map((endpoint) => (
              <li key={endpoint}>{endpoint}</li>
            ))}
          </ul>
        </Modal>
      ) : null}
      <CookbooksProvider>
        <MainSectionSurface
          onCloseIconClick={handleOnCloseIconClick}
          height="100%"
          bgColor={surfaceColor}>
          <div className="flex flex-col items-center h-full">
            <div className="w-[700px] flex shrink-0 justify-center">
              <SimpleStepsIndicator
                textColor={colors.moongray[300]}
                stepColor={colors.moonpurplelight}
                steps={flowState.steps}
                currentStepIndex={flowState.stepIndex}
              />
            </div>
            <div
              className="flex flex-col gap-5 ipad11Inch:gap-2 ipadPro:gap-2 justify-center w-full"
              style={{ height: 'calc(100% - 33px)' }}>
              {!flowState.hidePrevBtn && (
                <div className="flex justify-center">
                  <div
                    role="button"
                    className="flex justify-center hover:opacity-70"
                    aria-label="Previous View"
                    onClick={handlePreviousIconClick}>
                    <Icon
                      name={IconName.WideArrowUp}
                      size={28}
                    />
                  </div>
                </div>
              )}
              {view}
              {!flowState.hideNextBtn && (
                <div className="flex justify-center">
                  <div
                    role="button"
                    className={`flex justify-center ${flowState.disableNextBtn ? 'opacity-30 cursor-default' : ''} 
                      ${!flowState.disableNextBtn ? 'hover:opacity-60 cursor-pointer' : ''}`}
                    aria-label="Next View"
                    onClick={
                      flowState.disableNextBtn ? undefined : handleNextIconClick
                    }>
                    <Icon
                      name={IconName.WideArrowDown}
                      size={28}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </MainSectionSurface>
      </CookbooksProvider>
    </React.Fragment>
  );
}

export { BenchmarkNewSessionFlow };
