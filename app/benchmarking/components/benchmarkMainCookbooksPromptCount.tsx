import { useCookbooks } from '@/app/benchmarking/contexts/cookbooksContext';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { calcTotalPromptsAndEstimatedTime } from '@/app/lib/cookbookUtils';
import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';
import config from '@/moonshot.config';
import { RequiredEndpoints } from './requiredEndpoints';

type Props = {
  selectedCookbooks: Cookbook[];
  onCookbooksLinkClick: () => void;
};

function BenchmarkMainCookbooksPromptCount({
  selectedCookbooks,
  onCookbooksLinkClick,
}: Props) {
  const [allCookbooks, _] = useCookbooks();
  const { totalPrompts } = calcTotalPromptsAndEstimatedTime(
    selectedCookbooks,
    config.estimatedPromptResponseTime
  );
  const requiredEndpoints = selectedCookbooks.reduce((acc, cookbook) => {
    return [
      ...acc,
      ...getEndpointsFromRequiredConfig(cookbook.required_config),
    ];
  }, [] as string[]);

  return (
    <section className="flex flex-col items-center justify-center min-h-[300px] gap-5">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full flex justify-center">
        We recommend you run{' '}
        <Tooltip
          position={TooltipPosition.top}
          content="See Details">
          <span
            className="decoration-2 underline hover:text-moonpurplelight cursor-pointer px-2"
            onClick={onCookbooksLinkClick}>
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
            {requiredEndpoints.length > 0 && (
              <RequiredEndpoints requiredEndpoints={requiredEndpoints} />
            )}
          </div>
        )}
      </section>
    </section>
  );
}

export { BenchmarkMainCookbooksPromptCount };
