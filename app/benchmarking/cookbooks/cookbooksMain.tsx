'use client';
import React from 'react';
import { CookbooksViewList } from '@/app/benchmarking/cookbooks/cookbooksViewList';
import { Icon, IconName } from '@/app/components/IconSVG';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { EndpointSelectVew } from '@/app/views/models-management/endpointsSelector';
import { colors } from '@/app/views/shared-components/customColors';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';

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
  const [currentStep, setCurrentStep] = React.useState(
    FlowSteps.SelectCookbooks
  );
  const [endpointFormView, setEndpointFormView] = React.useState<
    EndpointFormViews | undefined
  >();
  const [selectedEndpoints, setSelectedEndpoints] = React.useState<
    LLMEndpoint[]
  >([]);
  const [endpointToEdit, setEndpointToEdit] = React.useState<
    LLMEndpoint | undefined
  >();

  let view: React.ReactElement | undefined;

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

  switch (currentStep) {
    case FlowSteps.ConnectEndpoint:
      if (endpointFormView == undefined) {
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
        view = (
          <NewEndpointForm onClose={() => setEndpointFormView(undefined)} />
        );
      } else if (endpointFormView === EndpointFormViews.Edit) {
        view = (
          <NewEndpointForm
            endpointToEdit={endpointToEdit}
            onClose={() => setEndpointFormView(undefined)}
          />
        );
      }
      break;
    case FlowSteps.Run:
      view = <div>Run</div>;
      break;
  }

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      {currentStep === FlowSteps.SelectCookbooks && (
        <CookbooksViewList
          cookbooks={cookbooks}
          onRunClick={() => setCurrentStep(FlowSteps.ConnectEndpoint)}
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
            <div className="flex justify-center">
              <Icon
                name={IconName.WideArrowUp}
                size={28}
                onClick={() => setCurrentStep(currentStep - 1)}
              />
            </div>
            {view}
            {currentStep !== FlowSteps.Run && (
              <div
                className="flex justify-center"
                style={{ opacity: false ? 0.3 : 1 }}>
                <Icon
                  name={IconName.WideArrowDown}
                  size={28}
                  onClick={() => setCurrentStep(currentStep + 1)}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {currentStep === FlowSteps.Run && <div>Run</div>}
    </MainSectionSurface>
  );
}

export { CookbooksMain };
