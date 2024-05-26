'use client';

import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { formatDate } from '@/app/lib/date-utils';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';

type EndpointsViewListProps = {
  endpoints: LLMEndpoint[];
  children: React.ReactNode;
};

function EndpointsViewList({ endpoints, children }: EndpointsViewListProps) {
  const [selectedEndpointId, setSelectedEndpointId] = React.useState<
    string | undefined
  >(() => (endpoints.length ? endpoints[0].id : undefined));

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="relative h-full">
        <header className="flex gap-5 w-full mb-3 justify-between items-end">
          <h1 className="text-[1.6rem] text-white mt-3">Endpoints</h1>
          <Link href={`/endpoints/new`}>
            <Button
              size="md"
              mode={ButtonType.OUTLINE}
              leftIconName={IconName.Plus}
              text="Create New Endpoint"
              hoverBtnColor={colors.moongray[800]}
            />
          </Link>
        </header>
        <main
          className="grid grid-cols-2 gap-5"
          style={{ height: 'calc(100% - 140px)' }}>
          <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
            {endpoints.map((endpoint) => {
              const isSelected = endpoint.id === selectedEndpointId;
              return (
                <li
                  key={endpoint.id}
                  className=" bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                  style={{
                    transition: 'background-color 0.2s ease-in-out',
                    ...(isSelected && {
                      backgroundColor: colors.moongray['700'],
                    }),
                  }}>
                  <Link
                    href={`/endpoints/${endpoint.id}`}
                    className="block p-6"
                    onClick={() => setSelectedEndpointId(endpoint.id)}>
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
                  </Link>
                </li>
              );
            })}
          </ul>
          {children}
        </main>
        <footer className="absolute bottom-0 w-full flex justify-end gap-4">
          <Link href={`/endpoints/${selectedEndpointId}/edit`}>
            <Button
              size="lg"
              mode={ButtonType.PRIMARY}
              text="Edit Endpoint"
              hoverBtnColor={colors.moongray[1000]}
              pressedBtnColor={colors.moongray[900]}
            />
          </Link>
        </footer>
      </div>
    </MainSectionSurface>
  );
}

export { EndpointsViewList };
