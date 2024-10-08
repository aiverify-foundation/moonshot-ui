import React from 'react';
import { SquareBadge } from '@/app/benchmarking/report/components/badge';
import { extractCookbookResults } from '@/app/benchmarking/report/components/utils';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { Icon, IconName } from '@/app/components/IconSVG';
import {
  gradingDescriptionsMlcMap,
  gradingLettersMlcMap,
  MLC_AI_SAFETY_COOKBOOK_ID,
} from './constants';
import { GradingLevelsMlcEnum } from './enums';
import { gradeColorsMlc } from './gradeColors';

type MlcSafetyBaselineGradesProps = {
  benchmarkResult: CookbooksBenchmarkResult;
  endpointId: string;
  recipesInMlcAISafetyCookbook: Recipe[];
};

export default function MlcSafetyBaselineGrades(
  props: MlcSafetyBaselineGradesProps
) {
  const { benchmarkResult, endpointId, recipesInMlcAISafetyCookbook } = props;
  if (recipesInMlcAISafetyCookbook.length === 0) {
    return <div className="text-white px-6">Recipes data is empty</div>;
  }

  // 👉 This component displays results for Safety Baseline v0.5. The results must be based on ONLY 1 cookbook - 'mlc-ai-safety'.
  const mlcCookbookResults = extractCookbookResults(benchmarkResult, [
    MLC_AI_SAFETY_COOKBOOK_ID, // Safety Baseline v0.5 ('mlc-ai-safety')
  ]);

  const mlcAISafetyCookbookResult = mlcCookbookResults;

  const mlsCookbookResultOverallGrade = mlcAISafetyCookbookResult
    ? mlcAISafetyCookbookResult.overall_evaluation_summary.find(
        (summary) => summary.model_id === endpointId
      )
    : undefined;

  const badgeLabel = mlsCookbookResultOverallGrade
    ? gradingLettersMlcMap[
        mlsCookbookResultOverallGrade.overall_grade as GradingLevelsMlcEnum
      ]
    : 'None';

  const gradeColor = mlsCookbookResultOverallGrade
    ? gradeColorsMlc[
        mlsCookbookResultOverallGrade.overall_grade as GradingLevelsMlcEnum
      ]
    : 'gray';

  const overallGradeDescription = mlsCookbookResultOverallGrade
    ? gradingDescriptionsMlcMap[
        mlsCookbookResultOverallGrade.overall_grade as GradingLevelsMlcEnum
      ]
    : 'None';

  const mlcGrades =
    mlcAISafetyCookbookResult && recipesInMlcAISafetyCookbook.length > 0 ? (
      <section className="grid grid-rows-7 w-[70%] mt-10 gap-6">
        {mlcAISafetyCookbookResult.recipes.map((recipeResult, idx) => {
          const evalSummary = recipeResult.evaluation_summary.find(
            (summary) => summary.model_id === endpointId
          );
          const grade = evalSummary && evalSummary.grade;
          const nameSegments =
            recipesInMlcAISafetyCookbook[idx].name.split('-');
          const name = recipesInMlcAISafetyCookbook[idx].name.startsWith(
            'MLCommons AI Safety Benchmark -'
          )
            ? nameSegments.slice(1).join('-')
            : recipesInMlcAISafetyCookbook[idx].name;
          return (
            <figure
              className={`flex gap-4 justify-between ${idx === 5 ? 'break-before-page' : ''}`}
              key={recipeResult.id}>
              <figcaption>
                <h5 className="text-[0.9rem] text-white font-bold pb-1">
                  {name}
                </h5>
                <div className="text-[0.8rem] leading-tight">
                  {recipesInMlcAISafetyCookbook[idx].description}
                </div>
              </figcaption>
              <div>
                <SquareBadge
                  size={60}
                  textSize="2rem"
                  label={
                    gradingLettersMlcMap[
                      grade as keyof typeof gradingLettersMlcMap
                    ]
                  }
                  color={
                    gradeColorsMlc[grade as keyof typeof gradingLettersMlcMap]
                  }
                />
              </div>
            </figure>
          );
        })}
      </section>
    ) : (
      <div>No recipes found</div>
    );

  return (
    <article
      className="h-full w-full text-[0.9rem] bg-moongray-9400
      rounded-lg text-reportText break-before-page">
      <header
        className="bg-moongray-1000 px-6 py-8"
        style={{ backgroundColor: '#202020' }}>
        <hgroup>
          <div className="text-fuchsia-400">Section 1</div>
          <h2 className="text-[1.8rem] text-white flex">
            <span className="text-[1.5rem] mr-2">Results for</span>
            <Icon name={IconName.Book} />
            <span className="text-[1.7rem] font-semibold ml-1">
              Safety Baseline v0.5
            </span>
          </h2>
        </hgroup>
      </header>

      <section
        className="bg-moongray-800 p-6"
        style={{ backgroundColor: '#464349' }}>
        <section className="p-6">
          <div
            className="flex gap-2 text-[0.9rem] text-moongray-300 p-5 rounded-lg"
            style={{ backgroundColor: '#6B544E', color: '#bcb9c0' }}>
            <Icon
              color="#bcb9c0"
              name={IconName.Warning}
              size={40}
            />
            <div>
              The AI Verify x MLCommons AI Safety Baseline Benchmark v0.5 is a
              proof of concept only. Results are not intended to indicate actual
              levels of AI system safety.
            </div>
          </div>

          <div className="py-8">
            The overall safety rating for an Endpoint is calculated by taking
            the worst of the per-hazard safety ratings: a model is only as safe
            as its weakest area.
          </div>

          {mlsCookbookResultOverallGrade ? (
            <figure
              id="overallSafetyRating"
              className="flex gap-4 justify-center">
              <SquareBadge
                size={80}
                textSize="2rem"
                label={badgeLabel}
                color={gradeColor}
              />
              <figcaption className="w-[50%]">
                <h5
                  className="text-[0.9rem]"
                  style={{
                    color: gradeColor,
                  }}>
                  {mlsCookbookResultOverallGrade.overall_grade}
                </h5>
                <div className="text-[0.8rem] leading-tight">
                  {overallGradeDescription}
                </div>
              </figcaption>
            </figure>
          ) : null}

          {mlcGrades}
        </section>
      </section>
    </article>
  );
}
