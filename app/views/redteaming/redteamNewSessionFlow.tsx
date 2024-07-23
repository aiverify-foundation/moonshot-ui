'use client';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import { EndpointSelectVew } from '@/app/views/models-management/endpointsSelector';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { Modal } from '@/app/views/shared-components/modal/modal';
import {
  addRedteamModels,
  removeRedteamModels,
  resetAttackModule,
  resetRedteamModels,
  setAttackModule,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { AttackModuleSelectView } from './components/attackModuleSelector';
import { RedteamingNewSessionViews } from './enums';
import { RedteamRunForm } from './redteamRunForm';

const flowSteps = [
  'Connect Endpoint',
  'Set Optional Utilities',
  'Start Red Teaming',
];

function RedteamNewSessionFlow() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedModels = useAppSelector(
    (state) => state.redteamModels.entities
  );
  const selectedAttack = useAppSelector((state) => state.attackModule.entity);
  const [currentView, setCurrentView] = useState<RedteamingNewSessionViews>(
    RedteamingNewSessionViews.ENDPOINTS_SELECTION
  );
  const [endpointToEdit, setEndpointToEdit] = useState<
    LLMEndpoint | undefined
  >();
  const [hiddenNavButtons, setHiddenNavButtons] = useState<[boolean, boolean]>([
    true,
    true,
  ]);
  const [showExitModal, setShowExitModal] = useState(false);

  function changeView<T = undefined>(
    view: RedteamingNewSessionViews,
    data?: T
  ) {
    if (view === RedteamingNewSessionViews.EDIT_ENDPOINT_FORM) {
      setEndpointToEdit(data as LLMEndpoint);
    }
    setCurrentView(view);
  }

  function nextViewHandler() {
    if (currentView === RedteamingNewSessionViews.ENDPOINTS_SELECTION) {
      setCurrentView(RedteamingNewSessionViews.ATTACK_SELECTION);
      return;
    }
    if (currentView === RedteamingNewSessionViews.ATTACK_SELECTION) {
      setCurrentView(RedteamingNewSessionViews.RUN_FORM);
      return;
    }
  }

  function previousViewHandler() {
    if (currentView === RedteamingNewSessionViews.RUN_FORM) {
      setCurrentView(RedteamingNewSessionViews.ATTACK_SELECTION);
      return;
    }
    if (currentView === RedteamingNewSessionViews.ATTACK_SELECTION) {
      setCurrentView(RedteamingNewSessionViews.ENDPOINTS_SELECTION);
      return;
    }
  }

  function handleModelClick(model: LLMEndpoint) {
    if (selectedModels.find((endpoint) => endpoint.id === model.id)) {
      dispatch(removeRedteamModels([model]));
    } else {
      dispatch(addRedteamModels([model]));
    }
  }

  function handleOnCloseIconClick() {
    setShowExitModal(true);
  }

  function handleExitWorkflow() {
    dispatch(resetRedteamModels());
    dispatch(resetAttackModule());
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

  let stepIndex = 0;
  let surfaceColor = colors.moongray['950'];
  let view: React.ReactElement | undefined;
  let showSkipButton = false;

  useLayoutEffect(() => {
    if (currentView === RedteamingNewSessionViews.ENDPOINTS_SELECTION) {
      setHiddenNavButtons([true, false]);
      return;
    }
    if (
      currentView === RedteamingNewSessionViews.NEW_ENDPOINT_FORM ||
      currentView === RedteamingNewSessionViews.EDIT_ENDPOINT_FORM
    ) {
      setHiddenNavButtons([true, true]);
      return;
    }
    if (currentView === RedteamingNewSessionViews.ATTACK_SELECTION) {
      setHiddenNavButtons([false, selectedAttack ? false : true]);
      return;
    }
    if (currentView === RedteamingNewSessionViews.RUN_FORM) {
      setHiddenNavButtons([false, true]);
      return;
    }
  }, [currentView, selectedAttack]);

  switch (currentView) {
    case RedteamingNewSessionViews.ENDPOINTS_SELECTION:
      stepIndex = 0;
      showSkipButton = false;
      view = (
        <EndpointSelectVew
          selectedModels={selectedModels}
          totalSelected={selectedModels.length}
          onModelClick={handleModelClick}
          onEditClick={(model) =>
            changeView(RedteamingNewSessionViews.EDIT_ENDPOINT_FORM, model)
          }
          onCreateClick={() =>
            changeView(RedteamingNewSessionViews.NEW_ENDPOINT_FORM)
          }
        />
      );
      break;
    case RedteamingNewSessionViews.NEW_ENDPOINT_FORM:
      stepIndex = 0;
      showSkipButton = false;
      surfaceColor = colors.moongray['800'];
      view = (
        <NewEndpointForm
          onClose={() =>
            changeView(RedteamingNewSessionViews.ENDPOINTS_SELECTION)
          }
        />
      );
      break;
    case RedteamingNewSessionViews.EDIT_ENDPOINT_FORM:
      stepIndex = 0;
      showSkipButton = false;
      surfaceColor = colors.moongray['800'];
      view = (
        <NewEndpointForm
          endpointToEdit={endpointToEdit}
          onClose={() =>
            changeView(RedteamingNewSessionViews.ENDPOINTS_SELECTION)
          }
        />
      );
      break;
    case RedteamingNewSessionViews.ATTACK_SELECTION:
      stepIndex = 1;
      showSkipButton = !selectedAttack;
      view = (
        <AttackModuleSelectView
          selectedAttack={selectedAttack}
          onAttackClick={handleAttackClick}
          onSkipClick={
            !selectedAttack
              ? () => changeView(RedteamingNewSessionViews.RUN_FORM)
              : undefined
          }
        />
      );
      break;
    case RedteamingNewSessionViews.RUN_FORM:
      stepIndex = 2;
      showSkipButton = false;
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
              <div className="flex justify-center">
                <Icon
                  name={IconName.WideArrowDown}
                  disabled={selectedModels.length === 0}
                  size={28}
                  onClick={
                    selectedModels.length > 0 ? nextViewHandler : undefined
                  }
                />
              </div>
            )}
            {showSkipButton && (
              <div className="flex justify-center">
                <Button
                  mode={ButtonType.OUTLINE}
                  size="md"
                  text="Skip for now"
                  hoverBtnColor={colors.moongray[800]}
                  onClick={nextViewHandler}
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
