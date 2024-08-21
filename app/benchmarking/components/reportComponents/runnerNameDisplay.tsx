import { ErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import { fetchRunnerHeading } from './api';
export const dynamic = 'force-dynamic';

export default async function RunnerNameDisplay() {
  const response = await fetchRunnerHeading();
  if ('message' in response) {
    if (response.message.includes('No runners found')) {
      return (
        <div>
          <p className="mb-3">Runner not found</p>
        </div>
      );
    }
  }
  const runnerInfo = (response as ApiResult<RunnerHeading>).data;
  return (
    <div>
      <p className="mb-3">{runnerInfo.name}</p>
      <p className="mb-5">{runnerInfo.description}</p>
    </div>
  );
}
