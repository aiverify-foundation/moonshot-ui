import React from 'react';
import {
  updateAllCookbooks,
  useCookbooks,
} from '@/app/benchmarking/contexts/cookbooksContext';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import { colors } from '@/app/customColors';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  useAppDispatch,
} from '@/lib/redux';
import config from '@/moonshot.config';

type Props = {
  selectedCookbooks: Cookbook[];
  onCookbookSelected: () => void;
  onCookbookUnselected: () => void;
};

function BenchmarkDefaultSelection({
  selectedCookbooks,
  onCookbookSelected,
  onCookbookUnselected,
}: Props) {
  const dispatch = useAppDispatch();
  const [_, setAllCookbooks, isFirstCookbooksFetch, setIsFirstCookbooksFetch] =
    useCookbooks();
  const {
    data: defaultCookbooksForSelection,
    isFetching: isFetchingDefaultCookbooksForSelection,
  } = useGetCookbooksQuery({
    count: true,
  });

  function handleCookbookBtnClick(cb: Cookbook) {
    if (selectedCookbooks.some((t) => t.id === cb.id)) {
      dispatch(removeBenchmarkCookbooks([cb]));
      onCookbookUnselected();
    } else {
      dispatch(addBenchmarkCookbooks([cb]));
      onCookbookSelected();
    }
  }

  React.useEffect(() => {
    if (isFetchingDefaultCookbooksForSelection || !defaultCookbooksForSelection)
      return;
    updateAllCookbooks(setAllCookbooks, defaultCookbooksForSelection);
    if (isFirstCookbooksFetch === true) {
      const preselectedCookbooks: Cookbook[] = config.baselineSelectedCookbooks
        .map((id) => defaultCookbooksForSelection?.find((cb) => cb.id === id))
        .filter((cb) => cb !== undefined) as Cookbook[];
      dispatch(addBenchmarkCookbooks(preselectedCookbooks));
      setIsFirstCookbooksFetch(false);
    }
  }, [isFetchingDefaultCookbooksForSelection, defaultCookbooksForSelection]);

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
            Evaluate a model&apos;s performance in specific topics, languages
            and safety
          </p>
          <div
            className="flex flex-wrap gap-4 mt-10 w-[80%] justify-center
            max-h-[350px] overflow-y-auto custom-scrollbar p-1">
            {defaultCookbookBtns}
          </div>
        </>
      )}
    </section>
  );
}

export { BenchmarkDefaultSelection };
