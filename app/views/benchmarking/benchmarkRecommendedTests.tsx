import { useEffect } from 'react';
import { useGetSelectedCookbooksMetadataQuery } from '@/app/services/cookbook-api-service';
import { colors } from '@/app/views/shared-components/customColors';

type Props = {
  cookbookIds: string[];
};

function BenchmarkRecommendedTests({ cookbookIds }: Props) {
  const { data, isLoading } = useGetSelectedCookbooksMetadataQuery(
    cookbookIds,
    {
      skip: cookbookIds.length === 0,
    }
  );

  let totalHours = undefined;
  let totalMinutes = undefined;
  let totalPrompts = undefined;
  if (data && data.estTotalPromptResponseTime != undefined) {
    totalHours = Math.floor(data?.estTotalPromptResponseTime / 3600);
    totalMinutes = Math.floor((data?.estTotalPromptResponseTime % 3600) / 60);
  }
  if (data && data.totalPrompts != undefined) {
    totalPrompts = data?.totalPrompts.toLocaleString();
  }

  useEffect(() => {
    console.dir(data);
  }, [data]);

  return (
    <section className="flex flex-col items-center min-h-[300px] gap-5">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
        We recommend you run{' '}
        <span className="decoration-2 underline">these cookbooks</span>{' '}
        containing:
      </h2>
      <section className="relative flex flex-nowrap gap-[100px] py-7">
        {isLoading ? (
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
              <p className="text-[1.1rem] leading-[1.1rem] text-moongray-300 pl-1">
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
              <p className="text-[1.1rem] leading-[1.1rem] text-moongray-300 pl-1">
                Estimated Time <br />{' '}
                <span className="text-[0.9rem]">assuming 10s per prompt</span>
              </p>
            </div>
          </>
        )}
      </section>
    </section>
  );
}

export { BenchmarkRecommendedTests };
