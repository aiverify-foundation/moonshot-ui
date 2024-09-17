import { useContext } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Badge } from './badge';
import { PrintingContext } from './reportViewer';

type RunSummaryProps = {
  resultId: string;
  cookbooksInReport: Cookbook[];
  cookbookCategoryLabels: Record<string, string[]>;
  endpointId: string;
  totalPrompts: number;
  startTime: string;
  endTime: string;
};

export function RunSummary(props: RunSummaryProps) {
  const {
    resultId,
    cookbooksInReport,
    cookbookCategoryLabels,
    endpointId,
    totalPrompts,
    startTime,
    endTime,
  } = props;
  const downloadUrl = `/api/v1/benchmarks/results/${resultId}?download=true`;
  const { prePrintingFlagEnabled } = useContext(PrintingContext);

  return (
    <div className="px-6 flex flex-col text-reportText">
      <section className="grid grid-cols-2 grid-rows-2 gap-4 mb-16">
        <div>
          <h5 className="font-bold text-white">Model Endpoints</h5>
          <p>{endpointId}</p>
        </div>
        <div>
          <h5 className="font-bold text-white">Number of prompts ran</h5>
          <p>{totalPrompts}</p>
        </div>
        <div>
          <h5 className="font-bold text-white">Started on</h5>
          <p>{startTime}</p>
        </div>
        <div>
          <h5 className="font-bold text-white">Completed on</h5>
          <p>{endTime}</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-[1.8rem] text-white mb-8">Areas Tested</h2>
        <div className="grid grid-cols-2 gap-5 text-reportText">
          <hgroup>
            <div className="flex items-start gap-2">
              <Icon name={IconName.Book} />
              <p className="w-[80%]">
                Moonshot offers <span className="font-bold">cookbooks</span>{' '}
                containing recipes (benchmark tests) that evaluate comparable
                areas.
              </p>
            </div>
          </hgroup>

          <ol
            className="list-decimal list-inside text-white font-semi-bold text-[1rem]"
            style={{ color: '#ffffff' }}>
            {cookbooksInReport.map((cookbook) => {
              return (
                <li
                  key={cookbook.id}
                  className={`mb-1 ${prePrintingFlagEnabled ? 'w-[300px]' : 'w-[500px]'}`}>
                  <span className="mr-3">{cookbook.name}</span>
                  <span className="inline-flex gap-2 justify-start">
                    {cookbookCategoryLabels[cookbook.id].map(
                      (categoryLetter) => (
                        <Badge
                          key={categoryLetter}
                          label={categoryLetter}
                        />
                      )
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="text-[0.9rem]">
        <section className="bg-[#202020] rounded-lg p-6">
          <h3 className="text-white pb-6">Legend</h3>
          <p className="pb-6">
            <span className="font-bold text-fuchsia-400 ">Q - Quality</span>
            &nbsp;evaluates the model&apos;s ability to consistently produce
            content that meets general correctness and application-specific
            standards.
          </p>
          <p className="pb-6">
            <span className="font-bold text-fuchsia-400 ">C - Capability</span>
            &nbsp;assesses the AI model&apos;s ability to perform within the
            context of the unique requirements and challenges of a particular
            domain or task.
          </p>
          <p className="pb-6">
            <span className="font-bold text-fuchsia-400 ">
              T - Trust & Safety
            </span>
            &nbsp;addresses the reliability, ethical considerations, and
            inherent risks of the AI model. It also examines potential scenarios
            where the AI system could be used maliciously or unethically.
          </p>
        </section>

        <p
          className="p-6"
          data-download="hide">
          This report summarises the results for the benchmark tests ran on the
          endpoint. For the full detailed test results, &nbsp;
          <a
            className="text-fuchsia-400"
            href={downloadUrl}>
            Download the JSON file here
          </a>
          .
        </p>
      </section>
    </div>
  );
}
