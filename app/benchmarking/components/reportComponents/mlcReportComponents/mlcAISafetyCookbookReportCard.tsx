import React from 'react';
import { RecipeGradeBadge } from '@/app/benchmarking/components/reportComponents/badge';
import { gradeColorsMlc } from '@/app/benchmarking/components/reportComponents/gradeColors';
import { gradingLettersMlcMap } from '@/app/benchmarking/components/reportComponents/mlcReportComponents/constants';
import { CookbookResult } from '@/app/benchmarking/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/customColors';
import { MlcAiSafetyRecipeRatingResult } from './mlcAiSafetyRecipeRatingResult';

type BenchmarkReportCookbookResultsProps = {
  result: CookbookResult;
  cookbook: Cookbook;
  endpointId: string;
  recipes: Recipe[];
};

export default function MlcAISafetyCookbookReportCard(
  props: BenchmarkReportCookbookResultsProps
) {
  const { result, cookbook, endpointId, recipes } = props;
  const evaluationSummary = result.overall_evaluation_summary.find(
    (summary) => summary.model_id === endpointId
  );
  const [showSection, setShowSection] = React.useState(false);

  if (!evaluationSummary) {
    return <p>CookbookReportCard: No evaluation summary for {cookbook.name}</p>;
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
          border: `1px solid ${gradeColorsMlc[evaluationSummary.overall_grade as keyof typeof gradeColorsMlc]}`,
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
                gradingLettersMlcMap[
                  evaluationSummary.overall_grade as keyof typeof gradingLettersMlcMap
                ]
              }
              gradeColors={gradeColorsMlc}
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
          {result.recipes.map((recipeResult) => {
            const recipeDetails = recipes.find(
              (recipe) => recipe.id === recipeResult.id
            );
            return !recipeDetails ? (
              <p>recipeDetails: No recipe details</p>
            ) : (
              <MlcAiSafetyRecipeRatingResult
                key={recipeResult.id}
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
