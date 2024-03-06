import { useEffect, useState } from 'react';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import {
  useLazyGetSessionQuery,
  useLazySetActiveSessionQuery,
} from '@/app/services/session-api-service';
import { useAppDispatch } from '@/lib/redux';
import { setActiveSession } from '@/lib/redux/slices/activeSessionSlice';
import { NewSessionFlow } from './components/explorer/new-session-flow';
import { SessionDetailsCard } from './components/explorer/session-details-card';
import { SessionItemCard } from './components/explorer/session-item-card';
import {
  SessionExplorerButtonAction,
  TopButtonsBar,
} from './components/explorer/top-buttons-bar';
import useSessionList from './hooks/useSessionList';

type SessionsExplorerProps = {
  zIndex: number | 'auto';
  windowId: string;
  initialXY: [number, number];
  initialSize: [number, number];
  hideMenuButtons?: boolean;
  buttonAction?: SessionExplorerButtonAction;
  onCloseClick: () => void;
  onContinueSessionClick: () => void;
  onWindowChange: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
};

function getWindowSubTitle(selectedBtnAction: SessionExplorerButtonAction) {
  switch (selectedBtnAction) {
    case SessionExplorerButtonAction.VIEW:
      return 'Red Teaming';
    case SessionExplorerButtonAction.ADD:
      return 'Red Teaming';
  }
}

function SessionsExplorer(props: SessionsExplorerProps) {
  const {
    zIndex,
    windowId,
    hideMenuButtons = false,
    buttonAction = SessionExplorerButtonAction.VIEW,
    initialSize,
    initialXY,
    onWindowChange,
    onCloseClick,
    onContinueSessionClick,
  } = props;
  const [selectedSession, setSelectedSession] = useState<Session | undefined>();
  const { isLoading, error, sessions } = useSessionList();
  const [selectedBtnAction, setSelectedBtnAction] =
    useState<SessionExplorerButtonAction>(SessionExplorerButtonAction.VIEW);
  const [initialWindowSize, setInitialWindowSize] =
    useState<[number, number]>(initialSize);
  const [initialWindowXY, setInitialWindowXY] =
    useState<[number, number]>(initialXY);
  const [triggerGetSession] = useLazyGetSessionQuery();
  const [triggerSetActiveSession] = useLazySetActiveSessionQuery();
  const dispatch = useAppDispatch();

  const isTwoPanel =
    selectedBtnAction === SessionExplorerButtonAction.VIEW && selectedSession;

  const initialDividerPosition =
    selectedBtnAction === SessionExplorerButtonAction.ADD ? 30 : 40;

  const footerText = sessions.length
    ? `${sessions.length} Session${sessions.length > 1 ? 's' : ''}`
    : '';

  const windowTitle = getWindowSubTitle(selectedBtnAction);

  function handleListItemClick(id: string) {
    return () => {
      const session = sessions.find((session) => session.session_id === id);
      if (session) {
        setSelectedSession(session);
      }
    };
  }

  async function handleContinueSessionClick() {
    if (selectedSession) {
      const result = await triggerGetSession(selectedSession);
      if (result.data) {
        await triggerSetActiveSession(result.data.session_id);
        dispatch(setActiveSession(result.data));
        onContinueSessionClick();
      }
    }
  }

  function handleButtonClick(action: SessionExplorerButtonAction) {
    setSelectedBtnAction(action);
  }

  useEffect(() => {
    if (buttonAction && hideMenuButtons) {
      setSelectedBtnAction(buttonAction);
    }
  }, [buttonAction, hideMenuButtons]);

  useEffect(() => {
    setInitialWindowSize(initialSize);
  }, [initialSize]);

  useEffect(() => {
    setInitialWindowXY(initialXY);
  }, [initialXY]);

  return isLoading ? null : (
    <Window
      id={windowId}
      resizeable={false}
      initialXY={initialWindowXY}
      initialWindowSize={initialWindowSize}
      onWindowChange={onWindowChange}
      zIndex={zIndex}
      onCloseClick={onCloseClick}
      name={windowTitle}
      leftFooterText={
        selectedBtnAction === SessionExplorerButtonAction.VIEW
          ? footerText
          : undefined
      }
      footerHeight={30}
      contentAreaStyles={{ backgroundColor: 'transparent' }}
      topBar={
        hideMenuButtons ? null : (
          <TopButtonsBar
            onButtonClick={handleButtonClick}
            activeButton={selectedBtnAction}
          />
        )
      }>
      {selectedBtnAction === SessionExplorerButtonAction.ADD ? (
        <NewSessionFlow
          initialDividerPosition={initialDividerPosition}
          onNewSession={() => null}
        />
      ) : null}
      {selectedBtnAction === SessionExplorerButtonAction.VIEW ? (
        <>
          {isTwoPanel ? (
            <TwoPanel
              disableResize
              initialDividerPosition={initialDividerPosition}>
              <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
                {sessions
                  ? sessions.map((session) => (
                      <WindowList.Item
                        key={session.session_id}
                        id={session.session_id}
                        onClick={handleListItemClick(session.session_id)}
                        selected={
                          selectedSession?.session_id === session.session_id
                        }>
                        <SessionItemCard session={session} />
                      </WindowList.Item>
                    ))
                  : null}
              </WindowList>
              <div className="flex flex-col gap-6 bg-white h-full">
                <WindowInfoPanel
                  title="Session Info"
                  description={selectedSession.description}>
                  <div className="h-full">
                    {selectedSession ? (
                      <div className="flex flex-col gap-6">
                        <SessionDetailsCard
                          session={selectedSession}
                          onResumeSessionClick={handleContinueSessionClick}
                        />
                      </div>
                    ) : null}
                  </div>
                </WindowInfoPanel>
              </div>
            </TwoPanel>
          ) : (
            <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
              {sessions
                ? sessions.map((session) => (
                    <WindowList.Item
                      key={session.session_id}
                      id={session.session_id}
                      onClick={handleListItemClick(session.session_id)}
                      selected={
                        selectedSession?.session_id === session.session_id
                      }>
                      <SessionItemCard session={session} />
                    </WindowList.Item>
                  ))
                : null}
            </WindowList>
          )}
        </>
      ) : null}
    </Window>
  );
}

export { SessionsExplorer };
