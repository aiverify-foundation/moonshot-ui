import { RecipesViewList } from '@/app/benchmarking/recipes/recipesViewList';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { colors } from '@/app/customColors';
import { fetchCookbooks } from '@/app/lib/fetchApis/fetchCookbooks';
import { fetchRecipes } from '@/app/lib/fetchApis/fetchRecipes';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

// async function fetchRecipes() {
//   const response = await fetch(
//     `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}?count=true`,
//     {
//       cache: 'no-store',
//     }
//   );
//   const result = await processResponse<Recipe[]>(response);
//   return result;
// }

// async function fetchCookbooks() {
//   const response = await fetch(
//     `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?count=true`,
//     {
//       next: {
//         tags: ['cookbooks-collection'], // This fetch has to opt out of cache because cookbooks can be manually added/removed on filesystem. Clean up the tag later.
//       },
//       cache: 'no-store',
//     }
//   );
//   const result = await processResponse<Cookbook[]>(response);
//   return result;
// }

export default async function RecipesPage() {
  const rcResult = await fetchRecipes({ count: true });
  if ('message' in rcResult) {
    throw rcResult.message;
  }

  const cbResult = await fetchCookbooks({ count: true });
  if ('message' in cbResult) {
    throw cbResult.message;
  }

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <RecipesViewList
        recipes={(rcResult as ApiResult<Recipe[]>).data}
        cookbooks={(cbResult as ApiResult<Cookbook[]>).data}
      />
    </MainSectionSurface>
  );
}
