import { isErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import { AttackModulesViewList } from '@/app/views/attackmodules/attackModulesViewList';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchAttackModules() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathAttackModules}`,
    {
      cache: 'no-store',
    }
  );
  const result = await processResponse<AttackModule[]>(response);
  return result;
}

export default async function AttackModulesPage() {
  const result = await fetchAttackModules();
  if (isErrorWithMessage(result)) {
    throw result.message;
  }
  return (
    <AttackModulesViewList
      attacks={(result as ApiResult<AttackModule[]>).data}
    />
  );
}
