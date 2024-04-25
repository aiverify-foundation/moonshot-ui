import { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import SimpleStepsIndicator from '@/app/components/simpleStepsIndicator';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import tailwindConfig from '@/tailwind.config';
import { BenchMarkPrimaryUseCaseView } from './benchmarkPrimaryUseCaseView';
import { BenchmarkTopicsSelection } from './benchmarkTopicsSelection';
import { benchmarkTopics } from './constants';
import { BenchmarkNewSessionViews } from './enums';
import { BenchmarkRecommendedTests } from './benchmarkRecommendedTests';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type Props = {
  onCloseIconClick: () => void;
};

const flowSteps = ['Your LLM', 'Recommended Tests', 'Connect Endpoint', 'Run'];

function BenchmarkNewSessionFlow(props: Props) {
  const { onCloseIconClick } = props;
  const [activeView, setActiveView] = useState<BenchmarkNewSessionViews>(
    BenchmarkNewSessionViews.PRIMARY_USE_CASE
  );
  const [selectedTopics, setSelectedTopics] = useState<BenchmarkTopic[]>([]);

  function changeView(view: BenchmarkNewSessionViews) {
    setActiveView(view);
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
    if (activeView === BenchmarkNewSessionViews.PRIMARY_USE_CASE) {
      setActiveView(BenchmarkNewSessionViews.TOPICS_SELECTION);
      return;
    }
    if (activeView === BenchmarkNewSessionViews.TOPICS_SELECTION) {
      setActiveView(BenchmarkNewSessionViews.RECOMMENDED_TESTS);
      return;
    }
  }

  function previousViewHandler() {
    if (activeView === BenchmarkNewSessionViews.TOPICS_SELECTION) {
      setActiveView(BenchmarkNewSessionViews.PRIMARY_USE_CASE);
      return;
    }
    if (activeView === BenchmarkNewSessionViews.RECOMMENDED_TESTS) {
      setActiveView(BenchmarkNewSessionViews.TOPICS_SELECTION);
      return;
    }
  }

  useEffect(() => {
    console.dir(selectedTopics);
  }, [selectedTopics]);

  return (
    <MainSectionSurface onCloseIconClick={onCloseIconClick}>
      <div className="flex flex-col items-center pt-4 gap-10 pb-10">
        <div className="w-[700px] flex justify-center">
          <SimpleStepsIndicator
            textColor={colors.moongray[300]}
            stepColor={colors.logocolor}
            steps={flowSteps}
            currentStepIndex={0}
          />
        </div>
        <div className="flex justify-center">
          {activeView !== BenchmarkNewSessionViews.PRIMARY_USE_CASE && (
            <Icon
              name={IconName.WideArrowUp}
              size={28}
              onClick={previousViewHandler}
            />
          )}
        </div>
        {activeView === BenchmarkNewSessionViews.PRIMARY_USE_CASE && (
          <BenchMarkPrimaryUseCaseView changeView={changeView} />
        )}
        {activeView === BenchmarkNewSessionViews.TOPICS_SELECTION && (
          <BenchmarkTopicsSelection
            topics={benchmarkTopics}
            selectedTopics={selectedTopics}
            onTopicClick={handleTopicClick}
          />
        )}
        {activeView === BenchmarkNewSessionViews.RECOMMENDED_TESTS && (
          <BenchmarkRecommendedTests />
        )}
        <div className="flex justify-center">
          <Icon
            name={IconName.WideArrowDown}
            size={28}
            onClick={nextViewHandler}
          />
        </div>
      </div>
    </MainSectionSurface>
  );
}

export { BenchmarkNewSessionFlow };
