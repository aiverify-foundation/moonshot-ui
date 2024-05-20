'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { formatDate } from '@/app/lib/date-utils';
import { toErrorWithMessage } from '@/app/lib/error-utils';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';

function EndpointsViewList({ endpoints }: { endpoints: LLMEndpoint[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedEndpoint, setSelectedEndpoint] = useState<LLMEndpoint>(() => {
    const id = searchParams.get('id');
    if (!Boolean(id)) {
      return endpoints[0];
    }
    return endpoints.find((cb) => cb.id === id) || endpoints[0];
  });

  let selectedEndpointParams = 'None';
  if (selectedEndpoint.params) {
    try {
      selectedEndpointParams = JSON.stringify(selectedEndpoint.params, null, 2);
    } catch (error) {
      const errWithMessage = toErrorWithMessage(error);
      console.error(errWithMessage);
    }
  }

  return (
    <MainSectionSurface
      onCloseIconClick={() => router.push('/')}
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="h-full">
        <header className="flex gap-5 w-full mb-3 justify-between items-end">
          <h1 className="text-[1.6rem] text-white mt-3">Endpoints</h1>
          <Button
            size="md"
            mode={ButtonType.OUTLINE}
            leftIconName={IconName.Plus}
            text="Create New Endpoint"
            hoverBtnColor={colors.moongray[800]}
            onClick={() => router.push(`/endpoints/new`)}
          />
        </header>
        <main
          className="grid grid-cols-2 gap-5"
          style={{ height: 'calc(100% - 90px)' }}>
          <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
            {endpoints.map((endpoint) => {
              const isSelected = endpoint.id === selectedEndpoint.id;
              return (
                <li
                  key={endpoint.id}
                  className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                  style={{
                    transition: 'background-color 0.2s ease-in-out',
                    ...(isSelected && {
                      backgroundColor: colors.moongray['700'],
                    }),
                  }}
                  onClick={() => setSelectedEndpoint(endpoint)}>
                  <div className="flex gap-2 mb-3 items-start">
                    <Icon name={IconName.OutlineBox} />
                    <div>
                      <h4 className="text-[1rem] font-semibold">
                        {endpoint.name}
                      </h4>
                      <p className="text-[0.9rem]">
                        <span className="font-semibold">Type</span>
                        &nbsp;
                        <span className="text-moongray-300">
                          {endpoint.connector_type}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-[0.8rem] text-moongray-300 text-right">
                    Added on {formatDate(endpoint.created_date)}
                  </p>
                </li>
              );
            })}
          </ul>
          <section className="text-white border border-moonwine-500 p-4 rounded-md overflow-y-auto custom-scrollbar bg-moongray-800">
            <div className="flex gap-2 mb-4">
              <Icon
                name={IconName.OutlineBox}
                size={24}
              />
              <h3 className="text-[1.2rem] font-semibold">
                {selectedEndpoint.name}
              </h3>
            </div>
            <p className="text-[0.95rem] mb-10">
              <span className="font-semibold">Type</span>
              &nbsp;
              <span className="text-moongray-300">
                {selectedEndpoint.connector_type}
              </span>
            </p>
            <h4 className="text-[1rem] font-semibold mb-1">URI</h4>
            <p className="text-[0.95rem] text-moongray-300 mb-4">
              {selectedEndpoint.uri || 'None'}
            </p>
            <h4 className="text-[1rem] font-semibold mb-2">Token</h4>
            <p className="text-[0.95rem] text-moongray-300 mb-4">
              {selectedEndpoint.token || 'None'}
            </p>
            <h4 className="text-[1rem] font-semibold mb-1">
              Max number of calls per second
            </h4>
            <p className="text-[0.95rem] text-moongray-300 mb-4">
              {selectedEndpoint.max_calls_per_second || 'None'}
            </p>
            <h4 className="text-[1rem] font-semibold mb-1">Max concurrecy</h4>
            <p className="text-[0.95rem] text-moongray-300 mb-4">
              {selectedEndpoint.max_concurrency || 'None'}
            </p>
            <h4 className="text-[1rem] font-semibold mb-1">Parameters</h4>
            <pre className="text-[0.95rem] text-moongray-300 mb-4 overflow-hidden w-[90%] whitespace-pre-wrap">
              {selectedEndpointParams}
            </pre>
          </section>
        </main>
      </div>
    </MainSectionSurface>
  );
}

export { EndpointsViewList };
