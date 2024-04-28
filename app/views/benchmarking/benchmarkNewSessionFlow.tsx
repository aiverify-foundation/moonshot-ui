import React, { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { CookbooksSelection } from '@/app/views/cookbook-management/cookbooksSelection';
import { ModelSelectView } from '@/app/views/quickstart-home/components/endpointsSelector';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import tailwindConfig from '@/tailwind.config';
import { BenchMarkPrimaryUseCaseView } from './benchmarkPrimaryUseCaseView';
import { BenchmarkRecommendedTests } from './benchmarkRecommendedTests';
import { BenchmarkTopicsSelection } from './benchmarkTopicsSelection';
import { benchmarkTopics } from './constants';
import { BenchmarkNewSessionViews } from './enums';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type Props = {
  onCloseIconClick: () => void;
};

const flowSteps = ['Your LLM', 'Recommended Tests', 'Connect Endpoint', 'Run'];

function BenchmarkNewSessionFlow(props: Props) {
  const { onCloseIconClick } = props;
  const [currentView, setCurrentView] = useState<BenchmarkNewSessionViews>(
    BenchmarkNewSessionViews.PRIMARY_USE_CASE
  );
  const [selectedTopics, setSelectedTopics] = useState<BenchmarkTopic[]>([]);

  function changeView(view: BenchmarkNewSessionViews) {
    setCurrentView(view);
  }

  function handleTopicClick(topic: BenchmarkTopic) {
    if (selectedTopics.some((t) => t.id === topic.id)) {
      setSelectedTopics((prevTopics) =>
        prevTopics.filter((t) => t.id !== topic.id)
      );
    } else {
      setSelectedTopics((prevTopics) => [...prevTopics, topic]);
    }
  }

  function nextViewHandler() {
    if (currentView === BenchmarkNewSessionViews.PRIMARY_USE_CASE) {
      setCurrentView(BenchmarkNewSessionViews.TOPICS_SELECTION);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.RECOMMENDED_TESTS) {
      setCurrentView(BenchmarkNewSessionViews.ENDPOINTS_SELECTION);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.TOPICS_SELECTION) {
      if (selectedTopics.length > 0) {
        setCurrentView(BenchmarkNewSessionViews.RECOMMENDED_TESTS);
      }
      return;
    }
  }

  function previousViewHandler() {
    if (currentView === BenchmarkNewSessionViews.TOPICS_SELECTION) {
      setCurrentView(BenchmarkNewSessionViews.PRIMARY_USE_CASE);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.RECOMMENDED_TESTS) {
      setCurrentView(BenchmarkNewSessionViews.TOPICS_SELECTION);
      return;
    }
    if (currentView === BenchmarkNewSessionViews.ENDPOINTS_SELECTION) {
      setCurrentView(BenchmarkNewSessionViews.RECOMMENDED_TESTS);
      return;
    }
  }

  let hidePrevNavButton = false;
  let hideNextNavButton = false;
  let surfaceColor = colors.moongray['950'];
  let view: React.ReactElement | undefined;

  switch (currentView) {
    case BenchmarkNewSessionViews.PRIMARY_USE_CASE:
      hidePrevNavButton = true;
      view = <BenchMarkPrimaryUseCaseView changeView={changeView} />;
      break;
    case BenchmarkNewSessionViews.TOPICS_SELECTION:
      view = (
        <BenchmarkTopicsSelection
          topics={benchmarkTopics}
          selectedTopics={selectedTopics}
          onTopicClick={handleTopicClick}
        />
      );
      break;
    case BenchmarkNewSessionViews.RECOMMENDED_TESTS:
      view = (
        <BenchmarkRecommendedTests
          cookbookIds={selectedTopics.map((t) => t.id)}
          changeView={changeView}
        />
      );
      break;
    case BenchmarkNewSessionViews.ENDPOINTS_SELECTION:
      view = (
        <ModelSelectView onModelSelectClick={(model) => console.dir(model)} />
      );
      break;
    case BenchmarkNewSessionViews.COOKBOOKS_SELECTION:
      hidePrevNavButton = true;
      hideNextNavButton = true;
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
      <div className="flex flex-col items-center pt-4 gap-5 h-full">
        <div className="w-[700px] flex justify-center">
          <SimpleStepsIndicator
            textColor={colors.moongray[300]}
            stepColor={colors.moonpurplelight}
            steps={flowSteps}
            currentStepIndex={0}
          />
        </div>
        {!hidePrevNavButton && (
          <div className="flex justify-center">
            <Icon
              name={IconName.WideArrowUp}
              size={28}
              onClick={previousViewHandler}
            />
          </div>
        )}
        {view}
        {!hideNextNavButton && (
          <div
            className="flex justify-center"
            style={{
              opacity: selectedTopics.length > 0 ? 1 : 0.1,
            }}>
            <Icon
              name={IconName.WideArrowDown}
              size={28}
              onClick={selectedTopics.length > 0 ? nextViewHandler : undefined}
            />
          </div>
        )}
      </div>
    </MainSectionSurface>
  );
}

export { BenchmarkNewSessionFlow };
