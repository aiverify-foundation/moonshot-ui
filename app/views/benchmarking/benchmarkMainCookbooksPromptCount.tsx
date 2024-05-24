import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { calcTotalPromptsAndEstimatedTime } from '@/app/lib/cookbookUtils';
import { useAppSelector } from '@/lib/redux';
import config from '@/moonshot.config';
import { useCookbooks } from './contexts/cookbooksContext';
import { BenchmarkNewSessionViews } from './enums';

type Props = {
  changeView: (view: BenchmarkNewSessionViews) => void;
};

const enableEstimatedTime = false;

function BenchmarkMainCookbooksPromptCount({ changeView }: Props) {
  const [allCookbooks, _] = useCookbooks();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const { totalHours, totalMinutes, totalPrompts } =
    calcTotalPromptsAndEstimatedTime(
      selectedCookbooks,
      config.estimatedPromptResponseTime
    );

  const timeDisplay = enableEstimatedTime && (<div className="flex flex-col gap-2">
    <h3 className="text-[3.5rem] font-bolder tracking-wide leading-[3rem] text-white mb-0">
      {totalHours}
      <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
        hrs
      </span>
      {totalMinutes}
      <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
        mins
      </span>
    </h3>
    <p className="text-[1.1rem] leading-[1.1rem] text-moongray-300 pl-1 ">
      <span className="text-moonpurplelight">Estimated Time</span>{' '}
      <br />{' '}
      <span className="text-[0.9rem]">
        assuming{' '}
        <span className="decoration-1 underline">
          {config.estimatedPromptResponseTime}s
        </span>{' '}
        per prompt
      </span>
    </p>
  </div>)

  return (
    <section className="flex flex-col items-center justify-center min-h-[300px] gap-5">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full flex justify-center">
        We recommend you run{' '}
        <Tooltip
          position={TooltipPosition.top}
          content="See Details">
          <span
            className="decoration-2 underline hover:text-moonpurplelight cursor-pointer px-2"
            onClick={() =>
              changeView(BenchmarkNewSessionViews.COOKBOOKS_SELECTION)
            }>
            these cookbooks
          </span>
        </Tooltip>{' '}
        containing:
      </h2>
      <section className="relative flex flex-nowrap h-full gap-[100px] py-7">
        {!allCookbooks.length ? (
          <div className="ring">
            Loading
            <span />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="text-[3.5rem] font-bolder tracking-wide leading-[3rem] text-white mb-0">
                {totalPrompts}
              </h3>
              <p className="text-[1.1rem] leading-[1.1rem] text-moonpurplelight pl-1 text-center">
                Prompts
              </p>
            </div>
            {timeDisplay}
          </>
        )}
      </section>
    </section>
  );
}

export { BenchmarkMainCookbooksPromptCount };
