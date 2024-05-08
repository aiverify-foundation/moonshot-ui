import React, { useEffect } from 'react';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { useLazyGetAllCookbooksQuery } from '@/app/services/cookbook-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import config from '@/moonshot.config';
import { updateAllCookbooks, useCookbooks } from './contexts/cookbooksContext';

type Props = {
  setHiddenNavButtons: React.Dispatch<React.SetStateAction<[boolean, boolean]>>;
};

function BenchmarkTopicsSelection({ setHiddenNavButtons }: Props) {
  const dispatch = useAppDispatch();
  const [_, setAllCookbooks] = useCookbooks();
  const [defaultCookbooks, setDefaultCookbooks] = React.useState<
    Cookbook[] | undefined
  >();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const [fetchAllCookbooks] = useLazyGetAllCookbooksQuery();

  function handleTopicClick(topic: Cookbook) {
    if (selectedCookbooks.some((t) => t.id === topic.id)) {
      dispatch(removeBenchmarkCookbooks([topic]));
    } else {
      dispatch(addBenchmarkCookbooks([topic]));
    }
  }

  const topicsBtns = defaultCookbooks
    ? defaultCookbooks.map((topic) => {
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
    async function fetchDefaultCookbooksWithoutCount() {
      const result = await fetchAllCookbooks({
        ids: config.initialCookbooks,
        count: false,
      });
      console.dir(result);
      setDefaultCookbooks(result.data || []);
    }
    fetchDefaultCookbooksWithoutCount();
  }, [fetchAllCookbooks]);

  useEffect(() => {
    if (!defaultCookbooks) return;
    async function fetchAllCookbooksWithCount() {
      const result = await fetchAllCookbooks({ count: true });
      updateAllCookbooks(setAllCookbooks, result.data || []);
    }
    if (defaultCookbooks.length > 0) {
      setHiddenNavButtons([true, false]);
    }
    fetchAllCookbooksWithCount();
  }, [defaultCookbooks, setHiddenNavButtons]);

  return (
    <section className="relative flex flex-col items-center min-h-[300px]">
      {!defaultCookbooks ? (
        <LoadingAnimation />
      ) : (
        <>
          <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
            Would you like to test any of these?
          </h2>
          <p className="text-[1.1rem] text-moongray-300 w-full text-center py-0">
            <span className="font-bold">Optional tests</span> to evaluate a
            model&apos;s performance in specific defaultCookbooks or languages
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
