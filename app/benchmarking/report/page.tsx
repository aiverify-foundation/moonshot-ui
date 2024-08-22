import { notFound } from 'next/navigation';
import React from 'react';
import {
  fetchCookbooks,
  fetchRecipes,
  fetchReport,
  fetchRunnerHeading,
} from '@/app/benchmarking/components/reportComponents/api';
import { BenchmarkReportViewer } from '@/app/benchmarking/components/reportComponents/benchmarkReportViewer';
import { MLC_COOKBOOK_IDS } from '@/app/benchmarking/components/reportComponents/mlcReportComponents/constants';
import { CookbookCategoryLabels } from '@/app/benchmarking/types/benchmarkReportTypes';
import {
  CookbookResult,
  CookbooksBenchmarkResult,
} from '@/app/benchmarking/types/benchmarkReportTypes';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { ApiResult } from '@/app/lib/http-requests';
export const dynamic = 'force-dynamic';

export default async function BenchmarkingReportPage(props: {
  searchParams: { id: string };
}) {
  const fetchPromises = [
    fetchReport(props.searchParams.id),
    fetchRunnerHeading(props.searchParams.id),
    fetchCookbooks({ count: true }),
  ];
  const [reportResponse, runnerHeadingResponse, cookbooksResponse] =
    await Promise.all(fetchPromises);

  if ('message' in reportResponse) {
    if (reportResponse.message.includes('No results found')) {
      return notFound();
    } else {
      throw new Error(reportResponse.message);
    }
  }

  if ('message' in runnerHeadingResponse) {
    throw new Error(runnerHeadingResponse.message);
  }

  if ('message' in cookbooksResponse) {
    throw new Error(cookbooksResponse.message);
  }

  const bencmarkResult = (reportResponse as ApiResult<CookbooksBenchmarkResult>)
    .data;
  const cookbookIdsInReport = bencmarkResult.metadata.cookbooks;
  const runnerNameAndDescription = (
    runnerHeadingResponse as ApiResult<RunnerHeading>
  ).data;

  const fetchCookbooksPromises = [
    fetchCookbooks({ ids: bencmarkResult.metadata.cookbooks }),
    fetchCookbooks({ categories: ['Quality'], count: false }),
    fetchCookbooks({ categories: ['Capability'], count: false }),
    fetchCookbooks({ categories: ['Trust & Safety'], count: false }),
  ];

  const [
    cookbooksInReportResponse,
    qualityCookbooksResponse,
    performanceCookbooksResponse,
    securityCookbooksResponse,
  ] = await Promise.all(fetchCookbooksPromises);

  if ('message' in cookbooksInReportResponse) {
    throw new Error(cookbooksInReportResponse.message);
  }

  if ('message' in qualityCookbooksResponse) {
    throw new Error(qualityCookbooksResponse.message);
  }

  if ('message' in performanceCookbooksResponse) {
    throw new Error(performanceCookbooksResponse.message);
  }

  if ('message' in securityCookbooksResponse) {
    throw new Error(securityCookbooksResponse.message);
  }

  const cookbooksInReport = (
    cookbooksInReportResponse as ApiResult<Cookbook[]>
  ).data.sort((a, b) => a.name.localeCompare(b.name));
  const cookbooksUnderQuality = (
    qualityCookbooksResponse as ApiResult<Cookbook[]>
  ).data;
  const cookbooksUnderCapability = (
    performanceCookbooksResponse as ApiResult<Cookbook[]>
  ).data;
  const cookbooksUnderTrustSafety = (
    securityCookbooksResponse as ApiResult<Cookbook[]>
  ).data;

  const cookbookCategoryLabels: CookbookCategoryLabels =
    bencmarkResult.metadata.cookbooks.reduce((acc, cookbookId) => {
      if (!acc[cookbookId]) {
        acc[cookbookId] = [];
      }
      if (
        cookbooksUnderQuality.some((cookbook) => cookbook.id === cookbookId)
      ) {
        acc[cookbookId].push('Q');
      }
      if (
        cookbooksUnderCapability.some((cookbook) => cookbook.id === cookbookId)
      ) {
        acc[cookbookId].push('C');
      }
      if (
        cookbooksUnderTrustSafety.some((cookbook) => cookbook.id === cookbookId)
      ) {
        acc[cookbookId].push('T');
      }

      return acc;
    }, {} as CookbookCategoryLabels);

  const mlcCookbookIds = cookbookIdsInReport.filter((id) =>
    MLC_COOKBOOK_IDS.includes(id)
  );
  let mlcCookbookResult: CookbookResult | undefined;
  if (mlcCookbookIds.length > 0) {
    mlcCookbookResult = bencmarkResult.results.cookbooks.find(
      (result) => result.id === mlcCookbookIds[0]
    );
  }

  const mlcRecipeIds = mlcCookbookResult
    ? mlcCookbookResult.recipes.map((recipeResult) => recipeResult.id)
    : [];

  const mlcRecipesResponse = await fetchRecipes({ ids: mlcRecipeIds });
  if ('message' in mlcRecipesResponse) {
    throw new Error(mlcRecipesResponse.message);
  }
  const mlcRecipes = (mlcRecipesResponse as ApiResult<Recipe[]>).data;

  return (
    <MainSectionSurface
      closeLinkUrl="/benchmarking"
      height="100%"
      minHeight={750}
      bgColor="#2d2b2f">
      <BenchmarkReportViewer
        benchmarkResult={bencmarkResult}
        runnerNameAndDescription={runnerNameAndDescription}
        cookbookCategoryLabels={cookbookCategoryLabels}
        cookbooksInReport={cookbooksInReport}
        mlcCookbookResult={mlcCookbookResult}
        mlcRecipes={mlcRecipes}
      />
    </MainSectionSurface>
  );
}
