import { Step } from '@/app/benchmarking/recipes/enums';
import { RecipesViewList } from '@/app/benchmarking/recipes/recipesViewList';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { colors } from '@/app/customColors';
import { fetchCookbooks } from '@/app/lib/fetchApis/fetchCookbooks';
import { fetchRecipes } from '@/app/lib/fetchApis/fetchRecipes';
import { ApiResult } from '@/app/lib/http-requests';
export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  const rcResult = await fetchRecipes({ count: true });
  if ('message' in rcResult) {
    throw rcResult;
  }

  const cbResult = await fetchCookbooks({ count: true });
  if ('message' in cbResult) {
    throw cbResult;
  }

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      bgColor={colors.moongray['950']}>
      <RecipesViewList
        defaultFirstStep={Step.ADD_TO_NEW_COOKBOOK}
        recipes={(rcResult as ApiResult<Recipe[]>).data}
        cookbooks={(cbResult as ApiResult<Cookbook[]>).data}
      />
    </MainSectionSurface>
  );
}
