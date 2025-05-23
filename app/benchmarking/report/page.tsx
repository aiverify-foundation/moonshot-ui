import { notFound } from 'next/navigation';
import React from 'react';
import { ReportViewer } from '@/app/benchmarking/report/components/reportViewer';
import { CookbookCategoryLabels } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { CookbooksBenchmarkResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { colors } from '@/app/customColors';
import {
  fetchCookbooks,
  fetchRecipes,
  fetchReport,
  fetchRunnerHeading,
} from '@/app/lib/fetchApis';
import { fetchEndpoints } from '@/app/lib/fetchApis/fetchEndpoint';
import { ApiResult } from '@/app/lib/http-requests';
export const dynamic = 'force-dynamic';

export default async function BenchmarkingReportPage(props: {
  searchParams: { id: string };
}) {
  const fetchPromises = [
    fetchReport(props.searchParams.id),
    fetchRunnerHeading(props.searchParams.id),
    fetchCookbooks({ categories: ['Quality'], count: false }),
    fetchCookbooks({ categories: ['Capability'], count: false }),
    fetchCookbooks({ categories: ['Trust & Safety'], count: false }),
    fetchCookbooks({ categories: ['IMDA Starter Kit'], count: false }),
    fetchRecipes({ count: true }),
    fetchEndpoints(),
  ];
  const [
    reportResponse,
    runnerHeadingResponse,
    qualityCookbooksResponse,
    performanceCookbooksResponse,
    securityCookbooksResponse,
    imdaStarterKitCookbooksResponse,
    recipesResponse,
    endpointsResponse,
  ] = await Promise.all(fetchPromises);
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

  if ('message' in qualityCookbooksResponse) {
    throw new Error(qualityCookbooksResponse.message);
  }

  if ('message' in performanceCookbooksResponse) {
    throw new Error(performanceCookbooksResponse.message);
  }

  if ('message' in securityCookbooksResponse) {
    throw new Error(securityCookbooksResponse.message);
  }

  if ('message' in imdaStarterKitCookbooksResponse) {
    throw new Error(imdaStarterKitCookbooksResponse.message);
  }

  if ('message' in recipesResponse) {
    throw new Error(recipesResponse.message);
  }

  if ('message' in endpointsResponse) {
    throw new Error(endpointsResponse.message);
  }

  const bencmarkResult = (reportResponse as ApiResult<CookbooksBenchmarkResult>)
    .data;
  const runnerNameAndDescription = (
    runnerHeadingResponse as ApiResult<RunnerHeading>
  ).data;

  const cookbooksInReportResponse = await fetchCookbooks({
    ids: bencmarkResult.metadata.cookbooks,
  });

  if ('message' in cookbooksInReportResponse) {
    throw new Error(cookbooksInReportResponse.message);
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
  const cookbooksUnderTrustSafety = [
    ...(securityCookbooksResponse as ApiResult<Cookbook[]>).data,
    ...(imdaStarterKitCookbooksResponse as ApiResult<Cookbook[]>).data,
  ];
  const recipes = (recipesResponse as ApiResult<Recipe[]>).data;
  const endpointsInReport = (
    endpointsResponse as ApiResult<LLMEndpoint[]>
  ).data.filter((endpoint) =>
    bencmarkResult.metadata.endpoints.includes(endpoint.id)
  );

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

  return (
    <MainSectionSurface
      closeLinkUrl="/benchmarking"
      height="100%"
      bgColor={colors.moongray['950']}>
      <ReportViewer
        benchmarkResult={bencmarkResult}
        runnerNameAndDescription={runnerNameAndDescription}
        cookbookCategoryLabels={cookbookCategoryLabels}
        cookbooksInReport={cookbooksInReport}
        recipes={recipes}
        endpoints={endpointsInReport}
      />
    </MainSectionSurface>
  );
}
