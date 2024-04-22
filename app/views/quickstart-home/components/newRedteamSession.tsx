import { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { RedTeamingViewSteps } from '@/app/views/quickstart-home/enums';
import { ModelSelectView } from './endpointsSelector';
import { MainSectionSurface } from './mainSectionSurface';
import { SessionDetailsForm } from './sessionDetailsForm';

type Props = {
  onCloseIconClick: () => void;
};

function NewRedTeamSession(props: Props) {
  const { onCloseIconClick } = props;
  const [selectedModels, setSelectedModels] = useState<LLMEndpoint[]>([]);
  const [currentStep, setCurrentStep] = useState(
    RedTeamingViewSteps.SELECT_MODEL
  );

  function handleNextStep() {
    if (currentStep === RedTeamingViewSteps.SELECT_MODEL) {
      setCurrentStep(RedTeamingViewSteps.SESSION_DETAILS);
    }
  }

  function handleModelSelectClick(model: LLMEndpoint) {
    const modelIndex = selectedModels.findIndex((m) => m.id === model.id);
    if (modelIndex > -1) {
      const newSelectedModels = [...selectedModels];
      newSelectedModels.splice(modelIndex, 1);
      setSelectedModels(newSelectedModels);
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  }

  function handleCloseView() {
    setSelectedModels([]);
    onCloseIconClick();
  }

  useEffect(() => {
    console.log(selectedModels);
  }, [selectedModels]);

  return (
    <MainSectionSurface onCloseIconClick={handleCloseView}>
      {currentStep == RedTeamingViewSteps.SELECT_MODEL && (
        <ModelSelectView onModelSelectClick={handleModelSelectClick} />
      )}
      {currentStep == RedTeamingViewSteps.SESSION_DETAILS && (
        <SessionDetailsForm selectedEndpoints={selectedModels} />
      )}
      {currentStep != RedTeamingViewSteps.SESSION_DETAILS && (
        <div className="flex flex-col gap-2 w-full">
          <Icon
            name={IconName.WideArrowDown}
            size={40}
            onClick={handleNextStep}
          />
        </div>
      )}
    </MainSectionSurface>
  );
}

export { NewRedTeamSession };
