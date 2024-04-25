import { colors } from '@/app/views/shared-components/customColors';

type Props = {};

function BenchmarkRecommendedTests({}: Props) {
  return (
    <section className="flex flex-col items-center min-h-[300px] gap-5">
      <h2 className="text-[1.6rem] font-medium tracking-wide text-white w-full text-center">
        We recommend you run{' '}
        <span className="decoration-2 underline">these cookbooks</span>{' '}
        containing:
      </h2>
      <section className="flex flex-nowrap gap-[100px] py-7">
        <div className="flex flex-col gap-2">
          <h3 className="text-[3.5rem] font-bolder tracking-wide leading-[3rem] text-white mb-0">
            425,192
          </h3>
          <p className="text-[1.1rem] leading-[1.1rem] text-moongray-300 pl-1">
            Prompts
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-[3.5rem] font-bolder tracking-wide leading-[3rem] text-white mb-0">
            13
            <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
              hrs
            </span>
            48
            <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
              mins
            </span>
          </h3>
          <p className="text-[1.1rem] leading-[1.1rem] text-moongray-300 pl-1">
            Estimated Time <br />{' '}
            <span className="text-[0.9rem]">assuming 10s per prompt</span>
          </p>
        </div>
      </section>
    </section>
  );
}

export { BenchmarkRecommendedTests };
