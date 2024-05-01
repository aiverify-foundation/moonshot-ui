import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { useGetCookbooksByIdsQuery } from '@/app/services/cookbook-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import config from '@/moonshot.config';
import { useEffect } from 'react';

type Props = {
  setHiddenNavButtons: React.Dispatch<React.SetStateAction<[boolean, boolean]>>;
};

function BenchmarkTopicsSelection({ setHiddenNavButtons }: Props) {
  const dispatch = useAppDispatch();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const { data: topics, isLoading } = useGetCookbooksByIdsQuery(
    config.initialCookbooks
  );

  function handleTopicClick(topic: Cookbook) {
    if (selectedCookbooks.some((t) => t.id === topic.id)) {
      dispatch(removeBenchmarkCookbooks([topic]));
    } else {
      dispatch(addBenchmarkCookbooks([topic]));
    }
  }

  const topicsBtns = topics
    ? topics.map((topic) => {
        const isSelected = selectedCookbooks.some((t) => t.id === topic.id);
        return (
          <Button
            key={topic.id}
            size="sm"
            text={topic.name}
            textSize="1.1rem"
            textWeight="600"
            textColor={colors.white}
            mode={ButtonType.OUTLINE}
            type="button"
            leftIconName={IconName.Plus}
            btnColor={isSelected ? colors.moongray[700] : undefined}
            hoverBtnColor={colors.moongray[800]}
            onClick={() => handleTopicClick(topic)}
          />
        );
      })
    : undefined;

  useEffect(() => {
    if (!isLoading && topics) {
      setHiddenNavButtons([true, false]);
    }
  }, [isLoading, topics, setHiddenNavButtons]);

  return (
    <section className="relative flex flex-col items-center min-h-[300px]">
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
            Would you like to test any of these?
          </h2>
          <p className="text-[1.1rem] text-moongray-300 w-full text-center py-0">
            <span className="font-bold">Optional tests</span> to evaluate a
            model&apos;s performance in specific topics or languages
          </p>
          <div className="flex flex-wrap gap-4 mt-10 w-[80%] justify-center">
            {topicsBtns}
          </div>
        </>
      )}
    </section>
  );
}

export { BenchmarkTopicsSelection };
