import { useCookbooks } from '@/app/benchmarking/contexts/cookbooksContext';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { calcTotalPromptsAndEstimatedTime } from '@/app/lib/cookbookUtils';
import { useAppSelector } from '@/lib/redux';
import config from '@/moonshot.config';
import { BenchmarkNewSessionViews } from './enums';
import { RequiredEndpoints } from './requiredEndpoints';

const requiredEndpoints = [
  'Together Llama Guard 7B Assistant',
  'Together Llama3 8B Chat HF',
  'LLM Judge - OpenAI GPT4',
];

type Props = {
  changeView: (view: BenchmarkNewSessionViews) => void;
};

function BenchmarkMainCookbooksPromptCount({ changeView }: Props) {
  const [allCookbooks, _] = useCookbooks();
  const selectedCookbooks = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );
  const { totalPrompts } = calcTotalPromptsAndEstimatedTime(
    selectedCookbooks,
    config.estimatedPromptResponseTime
  );

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
          <LoadingAnimation />
        ) : (
          <div className="flex flex-col gap-2">
            <h3 className="text-[3.5rem] font-bolder tracking-wide leading-[3rem] text-white mb-0 text-center">
              {totalPrompts}
            </h3>
            <p className="text-[1.1rem] leading-[1.1rem] text-moonpurplelight pl-1 text-center">
              Prompts
            </p>
            <RequiredEndpoints requiredEndpoints={requiredEndpoints} />
          </div>
        )}
      </section>
    </section>
  );
}

export { BenchmarkMainCookbooksPromptCount };
