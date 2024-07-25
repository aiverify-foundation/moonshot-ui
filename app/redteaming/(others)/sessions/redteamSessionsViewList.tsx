'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { CSSProperties, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';

interface CustomStyle extends CSSProperties {
  webkitLineClamp?: string;
  webkitBoxOrient?: 'vertical';
}
const ellipsisStyle: CustomStyle = {
  display: '-webkit-box',
  webkitLineClamp: '2',
  webkitBoxOrient: 'vertical',
};

function RedteamSessionsViewList({ sessions }: { sessions: Session[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSession, setSelectedSession] = useState<Session>(() => {
    const id = searchParams.get('id');
    if (!Boolean(id)) {
      return sessions[0];
    }
    return sessions.find((sess) => sess.session_id === id) || sessions[0];
  });

  if (sessions.length === 0) {
    throw new Error('No sessions found', { cause: 'NO_SESSIONS_FOUND' });
  }

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="relative h-full">
        <header className="flex gap-5 w-full mb-3 justify-between items-end">
          <h1 className="text-[1.6rem] text-white mt-3">
            Past Red Teaming Sessions
          </h1>
          <Button
            size="sm"
            mode={ButtonType.OUTLINE}
            leftIconName={IconName.Plus}
            text="Start New Session"
            hoverBtnColor={colors.moongray[800]}
            onClick={() => router.push(`/redteaming/sessions/new`)}
          />
        </header>
        <main
          className="grid grid-cols-2 gap-5 mb-3"
          style={{ height: 'calc(100% - 140px)' }}>
          <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
            {sessions.map((session) => {
              const isSelected =
                session.session_id === selectedSession.session_id;
              return (
                <li
                  key={session.session_id}
                  className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                  style={{
                    transition: 'background-color 0.2s ease-in-out',
                    ...(isSelected && {
                      backgroundColor: colors.moongray['700'],
                    }),
                  }}
                  onClick={() => setSelectedSession(session)}>
                  <div className="flex gap-2 mb-2">
                    <Icon name={IconName.HistoryClock} />
                    <h4 className="text-[1rem] font-semibold">
                      {session.session_id}
                    </h4>
                  </div>
                  <p
                    className="text-[0.8rem] h-[40px] overflow-hidden text-ellipsis text-moongray-400"
                    style={ellipsisStyle}>
                    {session.description}
                  </p>
                </li>
              );
            })}
          </ul>
          <section className="text-white border border-moonwine-500 p-4 rounded-md overflow-y-auto custom-scrollbar bg-moongray-800">
            <div className="flex gap-2 mb-4">
              <Icon
                name={IconName.HistoryClock}
                size={24}
              />
              <h3 className="text-[1.2rem] font-semibold">
                {selectedSession.session_id}
              </h3>
            </div>
            <p className="text-[0.95rem]">{selectedSession.description}</p>
            <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
              Endpoints
            </h4>
            <p className="text-[0.95rem] mb-10 text-moongray-300">
              {selectedSession.endpoints.map((endpoint, idx) => {
                return (
                  <span key={endpoint}>
                    {endpoint}
                    {idx === selectedSession.endpoints.length - 1 ? '' : `,`}
                    &nbsp;
                  </span>
                );
              })}
            </p>
            <h4 className="text-[1.1rem] font-semibold mb-1">
              Last Attack Module Used
            </h4>
            <p className="text-[0.95rem] mb-3 text-moongray-300">
              {selectedSession.attack_module || 'None'}
            </p>
            <h4 className="text-[1.1rem] font-semibold mb-1">
              Last Prompt Template Used
            </h4>
            <p className="text-[0.95rem] mb-3 text-moongray-300">
              {selectedSession.prompt_template || 'None'}
            </p>
            <h4 className="text-[1.1rem] font-semibold mb-1">
              Last Context Strategy Used
            </h4>
            <p className="text-[0.95rem] mb-3 text-moongray-300">
              {selectedSession.context_strategy || 'None'}
            </p>
          </section>
        </main>
        <footer className="absolute bottom-0 w-full flex justify-end gap-4">
          <Button
            size="lg"
            mode={ButtonType.PRIMARY}
            text="Resume Session"
            hoverBtnColor={colors.moongray[1000]}
            pressedBtnColor={colors.moongray[900]}
            onClick={() =>
              router.push(`/redteaming/sessions/${selectedSession.session_id}`)
            }
          />
        </footer>
      </div>
    </MainSectionSurface>
  );
}

export { RedteamSessionsViewList };
