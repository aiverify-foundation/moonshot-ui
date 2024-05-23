import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import { BenchmarkReportRecipeResult } from './benchmarkReportRecipeResult';
import { RecipeGradeBadge } from './components/badge';
import { gradeColorsMoonshot, gradeColorsMlc } from './components/gradeColors';
import { MLC_COOKBOOK_IDS, gradingLettersMlcMap } from './constants';
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
    console.log('BenchmarkReportCookbookResult:: No evaluation summary');
    return <p>BenchmarkReportCookbookResult: No evaluation summary</p>;
  }

  const isMlcCookbook = MLC_COOKBOOK_IDS.includes(cookbook.id);

  const gradeColors = isMlcCookbook ? gradeColorsMlc : gradeColorsMoonshot;

  return isFetching ? (
    <div className="relative w-full h-[100px]">
      <LoadingAnimation />
    </div>
  ) : (
    <section className="bg-moongray-1000 rounded-lg">
      <header
        data-download="collapsible-trigger"
        className={`flex justify-between items-center bg-moongray-800 p-4 
        rounded-t-lg cursor-pointer hover:bg-moongray-700
        ${showSection ? 'rounded-b-none' : 'rounded-b-lg'}`}
        style={{
          transition: 'background-color 0.3s ease-in-out',
          border: `1px solid ${gradeColors[evaluationSummary.overall_grade as keyof typeof gradeColors]}`,
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
              customLetter={
                isMlcCookbook
                  ? gradingLettersMlcMap[
                      evaluationSummary.overall_grade as keyof typeof gradingLettersMlcMap
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
        className={`px-4 main-transition ${showSection ? 'main-visible' : ''}`}
        data-download="collapsible">
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
                  cookbookId={cookbook.id}
                  result={recipeResult}
                  recipe={recipeDetails}
                  endpointId={endpointId}
                />
              );
            })}
        </section>
      </main>
    </section>
  );
}

export { BenchmarkReportCookbookResult };
