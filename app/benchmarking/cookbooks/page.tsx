import Link from 'next/link';
import { CookbooksViewList } from '@/app/benchmarking/cookbooks/cookbooksViewList';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import config from '@/moonshot.config';

async function fetchCookbooks() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}?count=true`,
    {
      next: {
        tags: ['cookbooks-collection'],
      },
    }
  );
  const result = await processResponse<Cookbook[]>(response);
  return result;
}

export default async function CookbooksPage() {
  const result = await fetchCookbooks();
  if ('error' in result) {
    throw result.error;
  }

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <CookbooksViewList cookbooks={(result as ApiResult<Cookbook[]>).data} />
    </MainSectionSurface>
  );
}
