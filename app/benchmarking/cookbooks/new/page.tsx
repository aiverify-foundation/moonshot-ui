import { ApiResult, processResponse } from '@/app/lib/http-requests';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import config from '@/moonshot.config';
import { CreateCookbookForm } from './createCookbookForm';
export const dynamic = 'force-dynamic';

async function fetchRecipes() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRecipes}?count=true`
  );
  const result = await processResponse<Recipe[]>(response);
  return result;
}

export default async function RecipesPage() {
  const result = await fetchRecipes();
  if ('error' in result) {
    throw result.error;
  }

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="h-full">
        <CreateCookbookForm recipes={(result as ApiResult<Recipe[]>).data} />
      </div>
    </MainSectionSurface>
  );
}
