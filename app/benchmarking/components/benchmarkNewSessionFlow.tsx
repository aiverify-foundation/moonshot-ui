'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CookbooksSelection } from '@/app/benchmarking/components/cookbooksSelection';
import { EndpointSelector } from '@/app/benchmarking/components/endpointsSelector';
import { CookbooksProvider } from '@/app/benchmarking/contexts/cookbooksContext';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { Modal } from '@/app/components/modal';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { colors } from '@/app/customColors';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import {
  addBenchmarkModels,
  removeBenchmarkModels,
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import {
  benchmarkNewSessionFlowReducer,
  initialState,
} from './benchmarkNewSessionFlowReducer';
import BenchmarkRunForm from './benchmarkRunForm';
import { BenchmarkNewSessionViews } from './enums';

function BenchmarkNewSessionFlow() {
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const [flowState, dispatch] = React.useReducer(
    benchmarkNewSessionFlowReducer,
    initialState
  );
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const selectedModels = useAppSelector(
    (state) => state.benchmarkModels.entities
  );
  const [showExitModal, setShowExitModal] = React.useState(false);

  const requiredEndpoints = React.useMemo(
    () =>
      selectedCookbooks.reduce((acc, cookbook) => {
        if (cookbook.endpoint_required && cookbook.endpoint_required.length) {
          acc = [...acc, ...cookbook.endpoint_required];
        }
        return acc;
      }, [] as string[]),
    [selectedCookbooks.length]
  );

  function handleNextIconClick() {
    if (flowState.view === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
      const requiredEndpoints = selectedCookbooks.reduce((acc, cookbook) => {
        if (cookbook.endpoint_required && cookbook.endpoint_required.length) {
          acc = [...acc, ...cookbook.endpoint_required];
        }
        return acc;
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
      view = (
        <NewEndpointForm
          endpointToEdit={flowState.modelToEdit}
          onClose={() => dispatch({ type: 'CLOSE_MODEL_FORM' })}
        />
      );
      break;
    case BenchmarkNewSessionViews.COOKBOOKS_SELECTION:
      view = (
        <CookbooksSelection
          onCookbookAboutClose={() =>
            dispatch({
              type: 'HIDE_SURFACE_OVERLAY',
            })
          }
          onCookbookAboutClick={() =>
            dispatch({
              type: 'SHOW_SURFACE_OVERLAY',
            })
          }
          onCookbookSelected={(updatedSelectedCookbooks) =>
            dispatch({
              type: 'COOKBOOK_SELECTION_CLICK',
              cookbooksLength: updatedSelectedCookbooks.length,
              hasAddtionalRequirements: requiredEndpoints.length > 0,
            })
          }
          onCookbookUnselected={(updatedSelectedCookbooks) => {
            dispatch({
              type: 'COOKBOOK_SELECTION_CLICK',
              cookbooksLength: updatedSelectedCookbooks.length,
              hasAddtionalRequirements: requiredEndpoints.length > 0,
            });
          }}
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
          minHeight={750}
          bgColor={surfaceColor}
          headerHeight={80}
          bodyHeight="calc(100% - 80px)"
          showHeaderDivider
          bodyClassName="!p-0"
          showSurfaceOverlay={flowState.showSurfaceOverlay}
          headerContent={
            <SimpleStepsIndicator
              textColor={colors.moongray[300]}
              stepColor={colors.moonpurplelight}
              steps={flowState.steps}
              currentStepIndex={flowState.stepIndex}
              className="!w-[80%]"
            />
          }>
          <div className="flex flex-col items-center h-full">
            <div
              className="flex flex-col gap-5 justify-center w-full"
              style={{ height: 'calc(100% - 60px)' }}>
              {view}
            </div>
            <div
              className={`flex 
                ${!flowState.hidePrevBtn && !flowState.hideNextBtn ? 'justify-between' : ''} 
                ${flowState.hidePrevBtn && !flowState.hideNextBtn ? 'justify-end' : ''} 
                ${!flowState.hidePrevBtn && flowState.hideNextBtn ? 'justify-start' : ''} 
                items-center w-full h-[60px] px-4
             bg-moongray-950 shadow-[0_-2px_5px_-2px_rgba(0,0,0,0.3)] rounded-b-2xl`}>
              {!flowState.hidePrevBtn ? (
                <Button
                  ariaLabel="Previous View"
                  mode={ButtonType.TEXT}
                  text="BACK"
                  textSize="1.3rem"
                  textColor={colors.moonpurplelight}
                  leftIconName={IconName.ThinArrowLeft}
                  iconSize={24}
                  iconColor={colors.moonpurplelight}
                  disabled={flowState.disablePrevBtn}
                  onClick={handlePreviousIconClick}
                />
              ) : null}
              {!flowState.hideNextBtn ? (
                <Button
                  ariaLabel="Next View"
                  mode={ButtonType.TEXT}
                  text="NEXT"
                  textSize="1.3rem"
                  textColor={colors.moonpurplelight}
                  rightIconName={IconName.ThinArrowRight}
                  iconSize={24}
                  iconColor={colors.moonpurplelight}
                  disabled={flowState.disableNextBtn}
                  onClick={
                    flowState.disableNextBtn ? undefined : handleNextIconClick
                  }
                />
              ) : null}
            </div>
          </div>
        </MainSectionSurface>
      </CookbooksProvider>
    </React.Fragment>
  );
}

export { BenchmarkNewSessionFlow };
