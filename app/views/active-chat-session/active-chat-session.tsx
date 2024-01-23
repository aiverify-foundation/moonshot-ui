import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { useEffect, useRef } from 'react';
import { ChatWindow } from '../moonshot-desktop/window-chatbox';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';
import { lerp } from '@/app/lib/math-helpers';
import { getWindowId, getWindowScrollTop, getWindowSize, getWindowXY } from '@/app/lib/window';
import { useSendPromptMutation } from '../moonshot-desktop/services/session-api-service';

function ActiveChatSession() {
  const activeSessionChatHistory = useAppSelector((state) => state.activeSession.entity);
  const windowsMap = useAppSelector((state) => state.windows.map);
  const [
    sendPrompt,
    { data: updatedSessionChatHistory, isLoading: sendPromptIsLoading, error: sendPromptError },
  ] = useSendPromptMutation();
  const dispatch = useAppDispatch();
  const chatBoxRefs = useRef<HTMLDivElement[]>([]);
  const isZKeyPressed = useRef(false);

  const syncScroll = (deltaY: number) => {
    chatBoxRefs.current.forEach((ref) => {
      if (ref) {
        ref.scrollTop += deltaY * 0.2;
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key.toLowerCase() === 'z') {
      isZKeyPressed.current = true;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'z') {
      isZKeyPressed.current = false;
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isZKeyPressed.current !== undefined && isZKeyPressed.current === true) {
      syncScroll(e.deltaY);
    }
  };

  function handleOnWindowChange(
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) {
    dispatch(updateWindows({ [windowId]: [x, y, width, height, scrollTop] }));
  }

  useEffect(() => {
    if (activeSessionChatHistory && activeSessionChatHistory.chats.length) {
      const wins: Record<string, WindowData> = {};
      activeSessionChatHistory.chats.forEach((id, index) => {
        const leftPos =
          lerp(0, window.innerWidth, index / activeSessionChatHistory.chats.length) + 250;
        wins[getWindowId(id)] = [leftPos, 100, 600, 450, 0];
      });
      dispatch(updateWindows(wins));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (activeSessionChatHistory === undefined) return null;
  return activeSessionChatHistory.chats.map((id: string, index: number) => {
    if (windowsMap[getWindowId(id)])
      return (
        <ChatWindow.ChatBox
          ref={(el) => (chatBoxRefs.current[index] = el as HTMLDivElement)}
          windowId={getWindowId(id)}
          key={id}
          name={id}
          initialXY={getWindowXY(windowsMap, id)}
          initialSize={getWindowSize(windowsMap, id)}
          initialScrollTop={getWindowScrollTop(windowsMap, id)}
          onCloseClick={() => null}
          onWindowChange={handleOnWindowChange}
          onWheel={handleWheel}>
          {!activeSessionChatHistory.chat_history
            ? null
            : activeSessionChatHistory.chat_history[id].map((dialogue, index) => {
                return (
                  <div
                    key={index}
                    style={{ display: 'flex', flexDirection: 'column', paddingRight: 10 }}>
                    <div style={{ color: 'black', textAlign: 'right', paddingRight: 10 }}>You</div>
                    <ChatWindow.TalkBubble
                      backgroundColor="#a3a3a3"
                      fontColor="#FFF"
                      styles={{ alignSelf: 'flex-end' }}>
                      {dialogue.prepared_prompt}
                    </ChatWindow.TalkBubble>
                    <div style={{ color: 'black', textAlign: 'left', paddingLeft: 10 }}>LLM</div>
                    <ChatWindow.TalkBubble
                      backgroundColor="#3498db"
                      fontColor="#FFF"
                      styles={{ textAlign: 'right' }}>
                      {dialogue.predicted_result}
                    </ChatWindow.TalkBubble>
                  </div>
                );
              })}
          {sendPromptIsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 15 }}>
              <ChatWindow.LoadingAnimation />
            </div>
          ) : null}
        </ChatWindow.ChatBox>
      );
  });
}

export { ActiveChatSession };
