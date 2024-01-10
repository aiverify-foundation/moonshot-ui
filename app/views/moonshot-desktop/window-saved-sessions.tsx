import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import useSessionList from './hooks/useSessionList';
import { useEffect, useState } from 'react';
import { useLazyGetSessionQuery } from './services/session-api-service';
import { useAppDispatch } from '@/lib/redux';
import { setActiveSession } from '@/lib/redux/slices/activeSessionSlice';

type WindowSavedSessionsProps = {
  onCloseClick: () => void;
  onContinueSessionClick: () => void;
};

function WindowSavedSessions(props: WindowSavedSessionsProps) {
  const { onCloseClick, onContinueSessionClick } = props;
  const [selectedSession, setSelectedSession] = useState<Session>();
  const { isLoading, error, sessions } = useSessionList();
  const [trigger, { data: sessionWithChatHistory }] = useLazyGetSessionQuery();
  const dispatch = useAppDispatch();

  function handleListItemClick(id: string) {
    const session = sessions.find((session) => session.session_id === id);
    if (session) {
      setSelectedSession(session);
    }
  }

  function handleContinueSessionClick() {
    if (selectedSession) {
      trigger(selectedSession);
    }
  }

  useEffect(() => {
    if (sessionWithChatHistory) {
      console.log(sessionWithChatHistory);
      dispatch(setActiveSession(sessionWithChatHistory));
      onContinueSessionClick();
    }
  }, [sessionWithChatHistory, dispatch, onCloseClick]);

  return (
    <Window
      initialXY={[600, 200]}
      onCloseClick={onCloseClick}
      name="Saved Sessions"
      styles={{ width: 600, height: 470 }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <WindowList styles={{ flexBasis: '50%' }}>
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
        <WindowInfoPanel styles={{ flexBasis: '50%', height: '100%' }}>
          <div>
            {selectedSession ? (
              <div>
                <h3>Session Info</h3>
                <p>{selectedSession.description}</p>
                <p>Session Name: {selectedSession.name}</p>
                <p>Session ID: {selectedSession.session_id}</p>
                <p>Endpoints: {selectedSession.endpoints.map((endpoint) => endpoint).join(', ')}</p>
                <p>Metadata File: {selectedSession.metadata_file}</p>
                <p>Created At: {new Date(selectedSession.created_epoch * 1000).toLocaleString()}</p>
                <button
                  style={{
                    minWidth: 80,
                    border: '1px solid #cfcfcf',
                    padding: '5px 15px',
                    background: '#1189b9',
                    color: '#FFF',
                    fontSize: 13,
                    borderRadius: 4,
                    height: 33,
                  }}
                  type="button"
                  onClick={handleContinueSessionClick}>
                  Continue Session
                </button>
              </div>
            ) : null}
          </div>
        </WindowInfoPanel>
      </div>
    </Window>
  );
}

export { WindowSavedSessions };
