import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { BenchmarkReportRecipeResult } from './benchmarkReportRecipeResult';
import { RecipeGradeBadge } from './components/badge';
import { gradeColors } from './components/gradeColors';
import { CookbookResult } from './types/benchmarkReportTypes';

type BenchmarkReportCookbookResultsProps = {
  result: CookbookResult;
  cookbook: Cookbook;
  endpointId: string;
};

function BenchmarkReportCookbookResult(
  props: BenchmarkReportCookbookResultsProps
) {
  const { result, cookbook, endpointId } = props;
  const evaluationSummary = result.overall_evaluation_summary.find(
    (summary) => summary.model_id === endpointId
  );
  const recipeIdsInResult = result.recipes.map((recipe) => recipe.id);
  const { data, isFetching } = useGetAllRecipesQuery({
    ids: recipeIdsInResult,
    count: true,
  });
  const [showSection, setShowSection] = React.useState(false);

  if (!evaluationSummary) {
    console.error('BenchmarkReportCookbookResult:: No evaluation summary');
    return <p>BenchmarkReportCookbookResult: No evaluation summary</p>;
  }

  return isFetching ? (
    <div className="relative w-full h-[100px]">
      <LoadingAnimation />
    </div>
  ) : (
    <section className="bg-moongray-1000 rounded-lg">
      <header
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
              size={35}
              textSize="1rem"
              textColor={colors.white}
            />
          )}
        </div>
      </header>
      {/* {showSection && ( */}
      <main
        className={`px-4 main-transition ${showSection ? 'main-visible' : ''}`}>
        <p className="mt-6 mb-10">{cookbook.description}</p>
        <section className="grid grid-cols-1 gap-[50px]">
          {data &&
            result.recipes.map((recipeResult) => {
              const recipeDetails = data?.find((r) => r.id === recipeResult.id);
              return !recipeDetails ? (
                <p>recipeDetails: No recipe details</p>
              ) : (
                <BenchmarkReportRecipeResult
                  key={recipeResult.id}
                  result={recipeResult}
                  recipe={recipeDetails}
                  endpointId={endpointId}
                />
              );
            })}
        </section>
      </main>
      {/* )} */}
    </section>
  );
}

export { BenchmarkReportCookbookResult };
