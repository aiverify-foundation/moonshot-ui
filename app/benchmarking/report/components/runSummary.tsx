import { useContext } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Badge } from './badge';
import { PrintingContext } from './reportViewer';

type RunSummaryProps = {
  cookbooksInReport: Cookbook[];
  cookbookCategoryLabels: Record<string, string[]>;
  endpointName: string;
  totalPrompts: number;
  startTime: string;
  endTime: string;
};

export function RunSummary(props: RunSummaryProps) {
  const {
    cookbooksInReport,
    cookbookCategoryLabels,
    endpointName,
    totalPrompts,
    startTime,
    endTime,
  } = props;
  const { prePrintingFlagEnabled } = useContext(PrintingContext);

  return (
    <div className="px-6 flex flex-col text-reportText">
      <section
        className={`grid grid-cols-2 grid-rows-2 gap-4 ${prePrintingFlagEnabled ? 'mb-6' : 'mb-10'}`}>
        <div>
          <h5 className="font-bold text-white">Model Endpoint</h5>
          <div>{endpointName}</div>
        </div>
        <div>
          <h5 className="font-bold text-white">Number of prompts ran</h5>
          <div>{totalPrompts}</div>
        </div>
        <div>
          <h5 className="font-bold text-white">Started on</h5>
          <div>{startTime}</div>
        </div>
        <div>
          <h5 className="font-bold text-white">Completed on</h5>
          <div>{endTime}</div>
        </div>
      </section>

      <section className="mb-1">
        <h2 className="text-[1.8rem] text-white mb-8">Areas Tested</h2>
        <div className="grid grid-cols-2 gap-5 text-reportText">
          <hgroup>
            <div className="flex items-start gap-2">
              <Icon name={IconName.Book} />
              <div className="w-[80%]">
                Moonshot offers <span className="font-bold">cookbooks</span>{' '}
                containing recipes (benchmark tests) that evaluate comparable
                areas.
              </div>
            </div>
          </hgroup>

          <ol
            className="list-decimal list-inside text-white font-semi-bold text-[1rem]"
            style={{ color: '#ffffff' }}>
            {cookbooksInReport.map((cookbook) => {
              return (
                <li
                  key={cookbook.id}
                  className={`mb-1 ${prePrintingFlagEnabled ? 'w-[300px]' : 'w-[500px]'} overflow-hidden overflow-ellipsis`}>
                  <span className="mr-3">{cookbook.name}</span>
                  <span className="inline-flex gap-2 justify-start">
                    {cookbookCategoryLabels[cookbook.id].map(
                      (categoryLetter) => (
                        <Badge
                          key={categoryLetter}
                          label={categoryLetter}
                          style={{
                            fontWeight: 'bold',
                          }}
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
    </div>
  );
}
