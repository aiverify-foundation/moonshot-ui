import { RecipesViewList } from '@/app/benchmarking/recipes/recipesViewList';
import CustomErrorModal from '@/app/components/customErrorModal';
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
    if (!cbResult.message.toLowerCase().includes('no recipes found with id')) {
      throw cbResult;
    }
  }

  return 'message' in cbResult ? (
    <CustomErrorModal errorMsg={cbResult.message} />
  ) : (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      bgColor={colors.moongray['950']}>
      <RecipesViewList
        recipes={(rcResult as ApiResult<Recipe[]>).data}
        cookbooks={(cbResult as ApiResult<Cookbook[]>).data}
      />
    </MainSectionSurface>
  );
}
