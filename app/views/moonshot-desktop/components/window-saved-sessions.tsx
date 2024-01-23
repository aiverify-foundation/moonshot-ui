import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import useSessionList from '../hooks/useSessionList';
import { useEffect, useState } from 'react';
import { useLazyGetSessionQuery } from '../services/session-api-service';
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
      id="window-saved-sessions"
      resizeable
      initialXY={[600, 200]}
      initialWindowSize={[600, 470]}
      onCloseClick={onCloseClick}
      name="Saved Sessions">
      <div
        style={{
          display: 'flex',
          height: '100%',
          color: 'gray',
          padding: 15,
          position: 'relative',
        }}>
        <WindowList styles={{ flexBasis: '35%' }}>
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
        <WindowInfoPanel styles={{ flexBasis: '65%', height: '100%' }}>
          <div style={{ height: '100%' }}>
            {selectedSession ? (
              <div style={{ position: 'relative', height: '100%' }}>
                <h3 style={{ fontWeight: 800 }}>Session Info</h3>
                <p style={{ marginBottom: 10 }}>{selectedSession.description}</p>
                <p style={{ fontSize: 14 }}>
                  <span style={{ fontWeight: 500, marginRight: 5 }}>Session Name:</span>{' '}
                  <span style={{ color: '#1189b9' }}>{selectedSession.name}</span>
                </p>
                <p style={{ fontSize: 14, marginRight: 5 }}>
                  <span style={{ fontWeight: 500 }}>Session ID:</span>{' '}
                  <span style={{ color: '#1189b9' }}>{selectedSession.session_id}</span>
                </p>
                <p style={{ fontSize: 14, marginRight: 5 }}>
                  <span style={{ fontWeight: 500 }}>Endpoints:</span>{' '}
                  <span style={{ color: '#1189b9' }}>
                    {selectedSession.endpoints.map((endpoint) => endpoint).join(', ')}
                  </span>
                </p>
                <p style={{ fontSize: 14, marginRight: 5 }}>
                  <span style={{ fontWeight: 500 }}>Metadata File:</span>{' '}
                  <span style={{ color: '#1189b9' }}>{selectedSession.metadata_file}</span>
                </p>
                <p style={{ fontSize: 14, marginRight: 5 }}>
                  <span style={{ fontWeight: 500 }}>Created At:</span>{' '}
                  <span style={{ color: '#1189b9' }}>
                    {new Date(selectedSession.created_epoch * 1000).toLocaleString()}
                  </span>
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    bottom: 0,
                    position: 'absolute',
                    width: '100%',
                  }}>
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
              </div>
            ) : null}
          </div>
        </WindowInfoPanel>
      </div>
    </Window>
  );
}

export { WindowSavedSessions };
