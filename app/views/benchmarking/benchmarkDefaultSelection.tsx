import React, { useEffect } from 'react';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import {
  useGetCookbooksQuery,
  useLazyGetCookbooksQuery,
} from '@/app/services/cookbook-api-service';
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

function BenchmarkDefaultSelection({ setHiddenNavButtons }: Props) {
  const dispatch = useAppDispatch();
  const [allCookbooks, setAllCookbooks] = useCookbooks();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const {
    data: defaultCookbooksForSelection,
    isFetching: isFetchingDefaultCookbooksForSelection,
  } = useGetCookbooksQuery(
    { ids: config.defaultCookbooksForSelection, count: true },
    {
      skip:
        !config.defaultCookbooksForSelection ||
        config.defaultCookbooksForSelection.length === 0,
    }
  );
  const [fetchCookbooks] = useLazyGetCookbooksQuery();

  function handleCookbookBtnClick(cb: Cookbook) {
    if (selectedCookbooks.some((t) => t.id === cb.id)) {
      dispatch(removeBenchmarkCookbooks([cb]));
    } else {
      dispatch(addBenchmarkCookbooks([cb]));
    }
  }

  const defaultCookbookBtns = defaultCookbooksForSelection
    ? defaultCookbooksForSelection.map((cb) => {
        const isSelected = selectedCookbooks.some((t) => t.id === cb.id);
        return (
          <Button
            key={cb.id}
            size="sm"
            text={cb.name}
            textSize="1.1rem"
            textWeight="600"
            textColor={colors.white}
            mode={ButtonType.OUTLINE}
            type="button"
            leftIconName={IconName.Plus}
            btnColor={isSelected ? colors.moonwine[700] : undefined}
            pressedBtnColor={colors.moonwine[700]}
            hoverBtnColor={
              isSelected ? colors.moonwine[600] : colors.moongray[800]
            }
            onClick={() => handleCookbookBtnClick(cb)}
          />
        );
      })
    : undefined;

  useEffect(() => {
    if (!defaultCookbooksForSelection) return;
    // After the default cookbooks for selection is updated, fetch all cookbooks in the background to store them in Context.
    // No need to handle situation where this component is unmounted while the fetch is in progress.
    async function fetchAllCookbooksWithCount() {
      const result = await fetchCookbooks({ count: true });
      updateAllCookbooks(setAllCookbooks, result.data || []);
      if (!result.data) return;
      const baselineRecommendedCookbooks = result.data.filter((cookbook) =>
        config.baselineSelectedCookbooks.includes(cookbook.id)
      );
      dispatch(addBenchmarkCookbooks(baselineRecommendedCookbooks));
    }
    if (defaultCookbooksForSelection.length > 0) {
      setHiddenNavButtons([true, false]);
    }
    if (!allCookbooks.length) {
      fetchAllCookbooksWithCount();
    }
  }, [defaultCookbooksForSelection, setHiddenNavButtons]);

  return (
    <section className="relative flex flex-col items-center min-h-[300px]">
      {isFetchingDefaultCookbooksForSelection ? (
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
            {defaultCookbookBtns}
          </div>
        </>
      )}
    </section>
  );
}

export { BenchmarkDefaultSelection };
