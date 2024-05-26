import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import { isErrorWithMessage } from '@/app/lib/error-utils';
import { processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchOneEndpoint(id: string) {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}/${id}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<LLMEndpoint>(response);
  return result;
}

export default async function CreateNewEndpointPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await fetchOneEndpoint(params.id);
  if (isErrorWithMessage(result)) {
    throw result;
  }
  return (
    <div className="flex flex-col pt-4 w-full h-full">
      <NewEndpointForm
        disablePopupLayout
        endpointToEdit={result.data}
      />
    </div>
  );
}
