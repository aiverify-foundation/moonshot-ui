import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/views/shared-components/customColors';
import { RecipeGradeBadge } from './components/badge';
import { CookbookResult } from './types/benchmarkReportTypes';

type BenchmarkReportCookbookResultsProps = {
  result: CookbookResult;
  endpointId: string;
};
function BenchmarkReportCookbookResult(
  props: BenchmarkReportCookbookResultsProps
) {
  const { result } = props;
  const overallGrade = result.overall_evaluation_summary.find(
    (summary) => summary.model_id === props.endpointId
  );
  return (
    <section className="bg-moongray-950 p-6 rounded-lg">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name={IconName.Book} />
          <h3>{result.id}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span>Overall Rating:</span>
          {overallGrade && (
            <RecipeGradeBadge
              grade={overallGrade.grade}
              size={30}
              textSize="1rem"
              textColor={colors.white}
            />
          )}
        </div>
      </header>
    </section>
  );
}

export { BenchmarkReportCookbookResult };
