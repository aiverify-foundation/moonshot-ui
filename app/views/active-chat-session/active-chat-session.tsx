import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { useEffect, useRef, useState } from 'react';
import { ChatWindow } from '../moonshot-desktop/components/window-chatbox';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';
import { lerp } from '@/app/lib/math-helpers';
import { getWindowId, getWindowScrollTop, getWindowSize, getWindowXY } from '@/app/lib/window';
import { useSendPromptMutation } from '../moonshot-desktop/services/session-api-service';
import { BoxPrompt } from './box-prompt';
import { useUsePromptTemplateMutation } from '../moonshot-desktop/services/prompt-template-api-service';

type ActiveSessionProps = {
  onCloseBtnClick: () => void;
};

function ActiveChatSession(props: ActiveSessionProps) {
  const { onCloseBtnClick } = props;
  const activeSessionChatHistory = useAppSelector((state) => state.activeSession.entity);
  const [promptText, setPromptText] = useState('');
  const windowsMap = useAppSelector((state) => state.windows.map);
  const [
    sendPrompt,
    { data: updatedSessionChatHistory, isLoading: sendPromptIsLoading, error: sendPromptError },
  ] = useSendPromptMutation();
  const [
    triggerSetPromptTemplate,
    {
      data: promptTemplateResult,
      isLoading: promptTemplateResultIsLoding,
      error: promptTemplateResultError,
    },
  ] = useUsePromptTemplateMutation();
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
    if (e.key.toLowerCase() === 'z') {
      if (!(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        isZKeyPressed.current = true;
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 'z') {
      if (!(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        isZKeyPressed.current = true;
      }
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

  function handleSendPromptClick(message: string) {
    if (!activeSessionChatHistory) return;
    setPromptText(message);
    sendPrompt({
      prompt: message,
      session_id: activeSessionChatHistory.session_id,
    });
  }

  async function handleSelectPromptTemplate(template: PromptTemplate) {
    const result = await triggerSetPromptTemplate(template.name);
    console.log(result);
  }

  useEffect(() => {
    if (activeSessionChatHistory && activeSessionChatHistory.chats.length) {
      const chatWindows: Record<string, WindowData> = {};
      const chatboxWidth = 400;
      const margin = 250;
      const spacing = 50;
      activeSessionChatHistory.chats.forEach((id, index) => {
        const leftPos = index === 0 ? margin : margin + chatboxWidth * index + spacing;
        chatWindows[getWindowId(id)] = [leftPos, 100, chatboxWidth, 450, 0];
      });
      dispatch(updateWindows(chatWindows));
    }
  }, []);

  useEffect(() => {
    if (sendPromptIsLoading) {
      chatBoxRefs.current.forEach((ref) => {
        if (ref) {
          ref.scrollTop = ref.scrollHeight;
        }
      });
    } else {
      setPromptText('');
    }
  }, [sendPromptIsLoading]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (activeSessionChatHistory === undefined) return null;

  return (
    <div>
      {activeSessionChatHistory.chats.map((id: string, index: number) => {
        if (windowsMap[getWindowId(id)]) {
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
                    // const length = activeSessionChatHistory.chat_history[id].length;
                    // const isLast = index === length - 1;
                    return (
                      <div
                        key={index}
                        style={{ display: 'flex', flexDirection: 'column', paddingRight: 10 }}>
                        <div
                          style={{
                            color: 'black',
                            textAlign: 'right',
                            paddingRight: 10,
                            fontSize: 12,
                          }}>
                          You
                        </div>
                        <ChatWindow.TalkBubble
                          backgroundColor="#a3a3a3"
                          fontColor="#FFF"
                          styles={{ alignSelf: 'flex-end', maxWidth: '90%' }}>
                          {dialogue.prepared_prompt}
                        </ChatWindow.TalkBubble>
                        <div
                          style={{
                            color: 'black',
                            textAlign: 'left',
                            maxWidth: '90%',
                            paddingLeft: 10,
                            fontSize: 12,
                          }}>
                          AI
                        </div>
                        <ChatWindow.TalkBubble
                          backgroundColor="#3498db"
                          fontColor="#FFF"
                          styles={{ textAlign: 'left' }}>
                          {dialogue.predicted_result}
                        </ChatWindow.TalkBubble>
                      </div>
                    );
                  })}
              {sendPromptIsLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      color: 'black',
                      textAlign: 'right',
                      paddingRight: 10,
                      fontSize: 12,
                    }}>
                    You
                  </div>
                  <ChatWindow.TalkBubble
                    backgroundColor="#a3a3a3"
                    fontColor="#FFF"
                    styles={{ alignSelf: 'flex-end' }}>
                    {promptText}
                  </ChatWindow.TalkBubble>
                  <div
                    style={{
                      color: 'black',
                      textAlign: 'left',
                      paddingLeft: 10,
                      fontSize: 12,
                    }}>
                    AI
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginRight: 15 }}>
                    <ChatWindow.LoadingAnimation />
                  </div>
                </div>
              ) : null}
            </ChatWindow.ChatBox>
          );
        }
      })}

      <BoxPrompt
        name="Prompt"
        onCloseClick={onCloseBtnClick}
        onSendClick={handleSendPromptClick}
        onSelectPromptTemplate={handleSelectPromptTemplate}
      />
    </div>
  );
}

export { ActiveChatSession };
