import React from 'react';
import { CookbookResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/customColors';
import { RecipeGradeBadge } from './badge';
import { gradeColorsMoonshot } from './gradeColors';

type BenchmarkReportCookbookResultsProps = {
  result: CookbookResult;
  cookbook: Cookbook;
  endpointId: string;
  children?: React.ReactNode | React.ReactNode[];
};

function CookbookReportCard(props: BenchmarkReportCookbookResultsProps) {
  const { result, cookbook, endpointId, children } = props;
  const evaluationSummary = result.overall_evaluation_summary.find(
    (summary) => summary.model_id === endpointId
  );
  const [showSection, setShowSection] = React.useState(false);

  if (!evaluationSummary) {
    return <p>CookbookReportCard: No evaluation summary</p>;
  }

  return (
    <section className="bg-moongray-1000 rounded-lg">
      <header
        data-download="collapsible-trigger"
        className={`flex justify-between items-center bg-moongray-800 p-4 
        rounded-t-lg cursor-pointer hover:bg-moongray-700
        ${showSection ? 'rounded-b-none' : 'rounded-b-lg'}`}
        style={{
          transition: 'background-color 0.3s ease-in-out',
          border: `1px solid ${gradeColorsMoonshot[evaluationSummary.overall_grade as keyof typeof gradeColorsMoonshot]}`,
        }}
        onClick={() => setShowSection(!showSection)}>
        <div className="flex items-center gap-2">
          <Icon name={IconName.Book} />
          <h3 className="font-semibold text-white text-[1.2rem]">
            {cookbook.name}
          </h3>
          <Icon
            name={showSection ? IconName.WideArrowUp : IconName.WideArrowDown}
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[0.8rem]">Overall rating:</span>
          {evaluationSummary && (
            <RecipeGradeBadge
              grade={evaluationSummary.overall_grade}
              gradeColors={gradeColorsMoonshot}
              size={35}
              textSize="1rem"
              textColor={colors.white}
            />
          )}
        </div>
      </header>
      <main
        className={`px-4 main-transition ${showSection ? 'main-visible' : ''}`}
        data-download="collapsible">
        <p className="mt-6 mb-10">{cookbook.description}</p>
        <section className="grid grid-cols-1 gap-[50px]">{children}</section>
      </main>
    </section>
  );
}

export { CookbookReportCard };
