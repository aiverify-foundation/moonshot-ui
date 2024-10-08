import { useContext } from 'react';
import { ReportLogo } from './reportLogo';
import { PrintingContext } from './reportViewer';

type ReportHeadingProps = {
  runnerNameAndDescription: RunnerHeading;
};

export function ReportHeading({
  runnerNameAndDescription,
}: ReportHeadingProps) {
  const { prePrintingFlagEnabled } = useContext(PrintingContext);
  return (
    <hgroup className="p-6 pb-0 text-reportText">
      <ReportLogo
        width={280}
        className={prePrintingFlagEnabled ? 'mb-6' : 'mb-10'}
      />
      <h1 className="text-[2.3rem] text-white mb-2">Benchmark Report</h1>
      <div className="mb-3 font-bold break-words">
        {runnerNameAndDescription.name}
      </div>
      <div className="mb-5 break-words">
        {runnerNameAndDescription.description}
      </div>
    </hgroup>
  );
}
