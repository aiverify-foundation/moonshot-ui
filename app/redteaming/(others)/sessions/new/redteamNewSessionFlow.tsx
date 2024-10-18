'use client';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { EndpointSelector } from '@/app/benchmarking/components/endpointsSelector';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { Modal } from '@/app/components/modal';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { colors } from '@/app/customColors';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import { AttackModuleSelectView } from '@/app/redteaming/(fullscreen)/components/attackModuleSelector';
import {
  addRedteamModels,
  removeRedteamModels,
  resetAttackModule,
  resetRedteamModels,
  setAttackModule,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { RedteamingNewSessionViews } from './enums';
import {
  initialState,
  redteamNewSessionFlowReducer,
} from './redteamNewSessionFlowReducer';
import { RedteamRunForm } from './redteamRunForm';

const flowSteps = [
  'Connect Endpoint',
  'Set Optional Utilities',
  'Start Red Teaming',
];

function RedteamNewSessionFlow() {
  const router = useRouter();
  const appDispatch = useAppDispatch();
  const [flowState, dispatch] = React.useReducer(
    redteamNewSessionFlowReducer,
    initialState
  );
  const selectedModels = useAppSelector(
    (state) => state.redteamModels.entities
  );
  const selectedAttack = useAppSelector((state) => state.attackModule.entity);
  const [endpointToEdit, setEndpointToEdit] = useState<
    LLMEndpoint | undefined
  >();
  const [showExitModal, setShowExitModal] = useState(false);

  function handleNextBtnClick() {
    dispatch({ type: 'NEXT_BTN_CLICK', modelsLength: selectedModels.length });
  }

  function handlePreviousBtnClick() {
    dispatch({ type: 'PREV_BTN_CLICK', modelsLength: selectedModels.length });
  }

  function handleModelClick(model: LLMEndpoint) {
    if (selectedModels.find((endpoint) => endpoint.id === model.id)) {
      appDispatch(removeRedteamModels([model]));
    } else {
      appDispatch(addRedteamModels([model]));
    }
  }

  function handleOnCloseIconClick() {
    setShowExitModal(true);
  }

  function handleExitWorkflow() {
    appDispatch(resetRedteamModels());
    appDispatch(resetAttackModule());
    router.push('/');
  }

  function handleAttackClick(attack: AttackModule) {
    if (!selectedAttack) {
      dispatch(setAttackModule(attack));
      return;
    }
    if (selectedAttack.id === attack.id) {
      dispatch(resetAttackModule());
      return;
    }
    dispatch(setAttackModule(attack));
  }

  function handleSkipAttackBtnClick() {
    dispatch({ type: 'SKIP_BTN_CLICK' });
  }

  let surfaceColor = colors.moongray['950'];
  let view: React.ReactElement | undefined;

  switch (flowState.view) {
    case RedteamingNewSessionViews.ENDPOINTS_SELECTION:
      view = (
        <EndpointSelector
          selectedModels={selectedModels}
          totalSelected={selectedModels.length}
          onModelClick={handleModelClick}
          onEditClick={(model) => null}
          onCreateClick={() => null}
        />
      );
      break;
    case RedteamingNewSessionViews.NEW_ENDPOINT_FORM:
      surfaceColor = colors.moongray['800'];
      view = <NewEndpointForm onClose={() => null} />;
      break;
    case RedteamingNewSessionViews.EDIT_ENDPOINT_FORM:
      surfaceColor = colors.moongray['800'];
      view = (
        <NewEndpointForm
          endpointToEdit={endpointToEdit}
          onClose={() => null}
        />
      );
      break;
    case RedteamingNewSessionViews.ATTACK_SELECTION:
      view = (
        <AttackModuleSelectView
          selectedAttack={selectedAttack}
          onAttackClick={handleAttackClick}
          onSkipClick={handleSkipAttackBtnClick}
        />
      );
      break;
    case RedteamingNewSessionViews.RUN_FORM:
      surfaceColor = colors.moongray['950'];
      view = <RedteamRunForm />;
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
              currentStepIndex={flowState.stepIndex}
            />
          </div>
          <div
            className="flex flex-col gap-5 justify-center w-full"
            style={{ height: 'calc(100% - 33px)' }}>
            {!flowState.hidePrevBtn && (
              <div className="flex justify-center">
                <div
                  role="button"
                  onClick={handlePreviousBtnClick}
                  className="flex justify-center hover:opacity-70"
                  aria-label="Previous View">
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
                  onClick={handleNextBtnClick}
                  className="flex justify-center hover:opacity-70"
                  aria-label="Next View">
                  <Icon
                    name={IconName.WideArrowDown}
                    size={28}
                  />
                </div>
              </div>
            )}
            {flowState.showSkipBtn && (
              <div className="flex justify-center">
                <Button
                  mode={ButtonType.OUTLINE}
                  size="md"
                  text="Skip for now"
                  aria-label="skip attack modules selection"
                  hoverBtnColor={colors.moongray[800]}
                  onClick={handleSkipAttackBtnClick}
                />
              </div>
            )}
          </div>
        </div>
      </MainSectionSurface>
    </>
  );
}

export { RedteamNewSessionFlow };
