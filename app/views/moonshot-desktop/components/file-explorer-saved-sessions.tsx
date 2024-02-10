import { useState } from 'react';
import { KeyValueDisplay } from '@/app/components/keyvalue-display';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { useAppDispatch } from '@/lib/redux';
import { setActiveSession } from '@/lib/redux/slices/activeSessionSlice';
import useSessionList from '@views/moonshot-desktop/hooks/useSessionList';
import {
  useLazyGetSessionQuery,
  useLazySetActiveSessionQuery,
} from '@/app/services/session-api-service';

type FileExplorerSavedSessionsProps = {
  zIndex: number | 'auto';
  windowId: string;
  initialXY: [number, number];
  initialSize: [number, number];
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

function FileExplorerSavedSessions(props: FileExplorerSavedSessionsProps) {
  const {
    zIndex,
    windowId,
    initialSize,
    initialXY,
    onWindowChange,
    onCloseClick,
    onContinueSessionClick,
  } = props;
  const [selectedSession, setSelectedSession] = useState<Session>();
  const { isLoading, error, sessions } = useSessionList();
  const [triggerGetSession] = useLazyGetSessionQuery();
  const [triggerSetActiveSession] = useLazySetActiveSessionQuery();

  const dispatch = useAppDispatch();

  function handleListItemClick(id: string) {
    const session = sessions.find((session) => session.session_id === id);
    if (session) {
      setSelectedSession(session);
    }
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

  return (
    <Window
      id={windowId}
      resizeable
      initialXY={initialXY}
      initialWindowSize={initialSize}
      onWindowChange={onWindowChange}
      zIndex={zIndex}
      onCloseClick={onCloseClick}
      name="Saved Sessions"
      leftFooterText={
        sessions.length
          ? `${sessions.length} Session${sessions.length > 1 ? 's' : ''}`
          : ''
      }>
      {selectedSession ? (
        <TwoPanel>
          <WindowList>
            {sessions
              ? sessions.map((session) => (
                  <WindowList.Item
                    key={session.session_id}
                    displayName={session.name}
                    id={session.session_id}
                    onClick={handleListItemClick}
                    selected={
                      selectedSession?.session_id === session.session_id
                    }
                  />
                ))
              : null}
          </WindowList>
          <WindowInfoPanel
            title="Session Info"
            description={selectedSession.description}>
            <div className="h-full">
              {selectedSession ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <KeyValueDisplay
                      label="Session Name"
                      value={selectedSession.name}
                    />
                    <KeyValueDisplay
                      label="Session ID"
                      value={selectedSession.session_id}
                    />
                    <KeyValueDisplay
                      label="Endpoints"
                      value={selectedSession.endpoints
                        .map((endpoint) => endpoint)
                        .join(', ')}
                    />
                    <KeyValueDisplay
                      label="Metadata File"
                      value={selectedSession.metadata_file}
                    />
                    <KeyValueDisplay
                      label="Created At"
                      value={new Date(
                        selectedSession.created_epoch * 1000
                      ).toLocaleString()}
                    />
                  </div>
                  <div>
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={handleContinueSessionClick}>
                      Continue Session
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </WindowInfoPanel>
        </TwoPanel>
      ) : (
        <WindowList>
          {sessions
            ? sessions.map((session) => (
                <WindowList.Item
                  key={session.session_id}
                  displayName={session.name}
                  id={session.session_id}
                  onClick={handleListItemClick}
                />
              ))
            : null}
        </WindowList>
      )}
    </Window>
  );
}

export { FileExplorerSavedSessions };
