import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { useCookbooks } from './contexts/cookbooksContext';
import { BenchmarkNewSessionViews } from './enums';

type Props = {
  changeView: (view: BenchmarkNewSessionViews) => void;
};

function BenchmarkRecommendedTests({ changeView }: Props) {
  const [allCookbooks, _] = useCookbooks();

  let totalHours = undefined;
  let totalMinutes = undefined;
  let totalPrompts = undefined;
  let estTotalPromptResponseTime = undefined;
  const estTimePerPromptInSeconds = 10;
  if (allCookbooks && allCookbooks.length) {
    totalPrompts = allCookbooks.reduce((acc, curr) => {
      return acc + curr.total_prompt_in_cookbook || 0;
    }, 0);
    estTotalPromptResponseTime = totalPrompts * estTimePerPromptInSeconds;
    if (estTotalPromptResponseTime) {
      totalHours = Math.floor(estTotalPromptResponseTime / 3600);
      totalMinutes = Math.floor((estTotalPromptResponseTime % 3600) / 60);
    }
    totalPrompts = totalPrompts.toLocaleString();
  }

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
              <p className="text-[1.1rem] leading-[1.1rem] text-moonpurplelight pl-1">
                Prompts
              </p>
            </div>
            <div className="flex flex-col gap-2">
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
                  assuming <span className="decoration-1 underline">10s</span>{' '}
                  per prompt
                </span>
              </p>
            </div>
          </>
        )}
      </section>
    </section>
  );
}

export { BenchmarkRecommendedTests };
