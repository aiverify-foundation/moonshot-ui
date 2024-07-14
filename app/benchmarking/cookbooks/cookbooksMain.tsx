'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CookbooksViewList } from '@/app/benchmarking/cookbooks/cookbooksViewList';
import { Icon, IconName } from '@/app/components/IconSVG';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import BenchmarkRunForm from '@/app/views/benchmarking/benchmarkRunForm';
import { EndpointSelectVew } from '@/app/views/models-management/endpointsSelector';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { Modal } from '@/app/views/shared-components/modal/modal';

const stepTitles = ['Select Cookbooks', 'Connect Endpoint', 'Run'];
enum FlowSteps {
  SelectCookbooks,
  ConnectEndpoint,
  Run,
}
enum EndpointFormViews {
  Edit,
  Create,
}

function CookbooksMain({ cookbooks }: { cookbooks: Cookbook[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(
    FlowSteps.SelectCookbooks
  );
  const [endpointFormView, setEndpointFormView] = React.useState<
    EndpointFormViews | undefined
  >();
  const [selectedEndpoints, setSelectedEndpoints] = React.useState<
    LLMEndpoint[]
  >([]);
  const [selectedCookbooks, setSelectedCookbooks] = React.useState<Cookbook[]>(
    []
  );
  const [endpointToEdit, setEndpointToEdit] = React.useState<
    LLMEndpoint | undefined
  >();
  const [showExitModal, setShowExitModal] = React.useState(false);

  let view: React.ReactElement | undefined;
  let showPreviousIcon = false;
  let showNextIcon = false;
  let surfaceColor = colors.moongray['950'];

  function handleEditEndpointBtnClick(endpoint: LLMEndpoint) {
    setEndpointToEdit(endpoint);
    setEndpointFormView(EndpointFormViews.Edit);
  }

  function handleEndpointClick(endpoint: LLMEndpoint) {
    if (selectedEndpoints.some((ep) => ep.id === endpoint.id)) {
      setSelectedEndpoints((prevSelectedEndpoints) =>
        prevSelectedEndpoints.filter((ep) => ep.id !== endpoint.id)
      );
    } else {
      setSelectedEndpoints((prevSelectedEndpoints) => [
        ...prevSelectedEndpoints,
        endpoint,
      ]);
    }
  }

  function handleRunClick(cookbooks: Cookbook[]) {
    setSelectedCookbooks(cookbooks);
    handleNextClick();
  }

  function handleNextClick() {
    setCurrentStep(currentStep + 1);
  }

  function handlePreviousClick() {
    setCurrentStep(currentStep - 1);
  }

  function handleExitWorkflow() {
    setSelectedCookbooks([]);
    setSelectedEndpoints([]);
    setCurrentStep(FlowSteps.SelectCookbooks);
    setEndpointFormView(undefined);
    setShowExitModal(false);
  }

  function handleOnCloseIconClick() {
    if (currentStep === FlowSteps.SelectCookbooks) {
      router.push('/');
    } else {
      setShowExitModal(true);
    }
  }

  switch (currentStep) {
    case FlowSteps.ConnectEndpoint:
      if (endpointFormView == undefined) {
        showPreviousIcon = true;
        showNextIcon = true;
        view = (
          <EndpointSelectVew
            selectedModels={selectedEndpoints}
            totalSelected={selectedEndpoints.length}
            onModelClick={handleEndpointClick}
            onEditClick={handleEditEndpointBtnClick}
            onCreateClick={() => setEndpointFormView(EndpointFormViews.Create)}
          />
        );
      } else if (endpointFormView === EndpointFormViews.Create) {
        showPreviousIcon = false;
        showNextIcon = false;
        surfaceColor = colors.moongray['800'];
        view = (
          <NewEndpointForm onClose={() => setEndpointFormView(undefined)} />
        );
      } else if (endpointFormView === EndpointFormViews.Edit) {
        showPreviousIcon = false;
        showNextIcon = false;
        surfaceColor = colors.moongray['800'];
        view = (
          <NewEndpointForm
            endpointToEdit={endpointToEdit}
            onClose={() => setEndpointFormView(undefined)}
          />
        );
      }
      break;
    case FlowSteps.Run:
      showPreviousIcon = true;
      showNextIcon = false;
      surfaceColor = colors.moongray['950'];
      view = (
        <BenchmarkRunForm
          defaultSelectedCookbooks={selectedCookbooks}
          defaultSelectedEndpoints={selectedEndpoints}
        />
      );
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
            If you exit this workflow now, your progress will not be saved.
          </p>
        </Modal>
      )}
      <MainSectionSurface
        onCloseIconClick={handleOnCloseIconClick}
        height="100%"
        minHeight={750}
        bgColor={surfaceColor}>
        {currentStep === FlowSteps.SelectCookbooks && (
          <CookbooksViewList
            cookbooks={cookbooks}
            defaultCheckedCookbooks={selectedCookbooks}
            onRunClick={handleRunClick}
          />
        )}
        {(currentStep === FlowSteps.ConnectEndpoint ||
          currentStep === FlowSteps.Run) && (
          <div className="flex flex-col items-center h-full">
            <div className="w-[700px] flex shrink-0 justify-center">
              <SimpleStepsIndicator
                textColor={colors.moongray[300]}
                stepColor={colors.moonpurplelight}
                steps={stepTitles}
                currentStepIndex={currentStep}
              />
            </div>
            <div
              className="flex flex-col gap-5 justify-center w-full"
              style={{ height: 'calc(100% - 33px)' }}>
              {showPreviousIcon && (
                <div className="flex justify-center">
                  <Icon
                    name={IconName.WideArrowUp}
                    size={28}
                    onClick={handlePreviousClick}
                  />
                </div>
              )}
              {view}
              {showNextIcon && (
                <div
                  className="flex justify-center"
                  style={{ opacity: selectedEndpoints.length ? 1 : 0.3 }}>
                  <Icon
                    name={IconName.WideArrowDown}
                    size={28}
                    onClick={
                      selectedEndpoints.length ? handleNextClick : undefined
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </MainSectionSurface>
    </>
  );
}

export { CookbooksMain };
