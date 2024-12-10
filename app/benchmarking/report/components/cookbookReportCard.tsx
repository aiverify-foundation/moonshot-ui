import React from 'react';
import { CookbookResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/customColors';
import { RecipeGradeBadge } from './badge';
import { gradeColorsMoonshot, gradeColorsRiskLevel } from './gradeColors';
import { gradingLettersRiskLevelMap } from './mlcReportComponents/constants';
import { PrintingContext } from './reportViewer';

type BenchmarkReportCookbookResultsProps = {
  result: CookbookResult;
  cookbook: Cookbook;
  endpointId: string;
  children?: React.ReactNode | React.ReactNode[];
  expanded?: boolean;
};

function CookbookReportCard(props: BenchmarkReportCookbookResultsProps) {
  const { result, cookbook, endpointId, children, expanded = false } = props;
  const evaluationSummary = result.overall_evaluation_summary.find(
    (summary) => summary.model_id === endpointId
  );
  const [showSection, setShowSection] = React.useState(expanded);
  const { prePrintingFlagEnabled } = React.useContext(PrintingContext);

  let gradeColors = gradeColorsMoonshot;
  let isRiskLevelGrading = false;
  if (
    evaluationSummary &&
    Object.keys(gradeColorsRiskLevel).includes(evaluationSummary.overall_grade)
  ) {
    gradeColors = gradeColorsRiskLevel;
    isRiskLevelGrading = true;
  }

  React.useEffect(() => {
    setShowSection(expanded);
  }, [expanded]);

  if (!evaluationSummary) {
    return <div>CookbookReportCard: No evaluation summary</div>;
  }

  return (
    <section className="bg-moongray-1000 rounded-lg break-before-page">
      <header
        data-download="collapsible-trigger"
        className={`flex justify-between items-center bg-moongray-800 p-4 
        rounded-t-lg cursor-pointer hover:bg-moongray-700
        ${showSection ? 'rounded-b-none' : 'rounded-b-lg'}`}
        style={{
          transition: 'background-color 0.3s ease-in-out',
          border: `1px solid ${gradeColors[evaluationSummary.overall_grade]}`,
        }}
        onClick={() => setShowSection(!showSection)}>
        <div className="flex items-center gap-2">
          <Icon name={IconName.Book} />
          <h3 className="font-semibold text-white text-[1.2rem] max-w-[700px] overflow-hidden overflow-ellipsis mr-4">
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
              customLetter={
                isRiskLevelGrading && evaluationSummary.overall_grade
                  ? gradingLettersRiskLevelMap[
                      evaluationSummary.overall_grade as keyof typeof gradingLettersRiskLevelMap
                    ]
                  : undefined
              }
              gradeColors={gradeColors}
              size={35}
              textSize="1rem"
              textColor={colors.white}
            />
          )}
        </div>
      </header>
      <main
        className={`px-4 
          ${prePrintingFlagEnabled ? 'no-expand-transition' : 'main-transition'} 
          ${showSection ? 'main-visible' : ''}`}
        data-download="collapsible">
        <div className="mt-6 mb-10 break-words">{cookbook.description}</div>
        <section className="grid grid-cols-1 gap-[50px]">{children}</section>
      </main>
    </section>
  );
}

export { CookbookReportCard };
