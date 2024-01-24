import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { useEffect, useRef, useState } from 'react';
import { ChatWindow } from '../moonshot-desktop/components/window-chatbox';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';
import { getWindowId, getWindowScrollTop, getWindowSize, getWindowXY } from '@/app/lib/window';
import { useSendPromptMutation } from '../moonshot-desktop/services/session-api-service';
import { BoxPrompt } from './box-prompt';
import {
  useUnusePromptTemplateMutation,
  useUsePromptTemplateMutation,
} from '../moonshot-desktop/services/prompt-template-api-service';
import { setActiveSession, updateChatHistory } from '@/lib/redux/slices/activeSessionSlice';
import usePromptTemplateList from '../moonshot-desktop/hooks/usePromptTemplateList';
import { ScreenOverlay } from '@/app/components/screen-overlay';
import TaskBar from '@/app/components/taskbar';
import Image from 'next/image';

type ActiveSessionProps = {
  onCloseBtnClick: () => void;
};

function ActiveChatSession(props: ActiveSessionProps) {
  const { onCloseBtnClick } = props;
  const activeSession = useAppSelector((state) => state.activeSession.entity);
  const { promptTemplates, error, isLoading } = usePromptTemplateList();
  const [promptText, setPromptText] = useState('');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<PromptTemplate | undefined>(
    undefined
  );
  const windowsMap = useAppSelector((state) => state.windows.map);
  const [
    sendPrompt,
    { data: updatedChatHistory, isLoading: sendPromptIsLoading, error: sendPromptError },
  ] = useSendPromptMutation();
  const [
    triggerSetPromptTemplate,
    {
      data: promptTemplateResult,
      isLoading: promptTemplateResultIsLoding,
      error: promptTemplateResultError,
    },
  ] = useUsePromptTemplateMutation();
  const [
    triggerUnSetPromptTemplate,
    {
      data: unusePromptTemplateResult,
      isLoading: unusePromptTemplateResultIsLoding,
      error: unusePromptTemplateResultError,
    },
  ] = useUnusePromptTemplateMutation();
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

  async function handleSendPromptClick(message: string) {
    if (!activeSession) return;
    setPromptText(message);
    const result = await sendPrompt({
      prompt: message,
      session_id: activeSession.session_id,
    });
    if ('data' in result && result.data) {
      dispatch(updateChatHistory(result.data));
    } else if ('error' in result) {
      console.error('Error fetching data:', result.error);
    }
  }

  async function handleSelectPromptTemplate(template: PromptTemplate | undefined) {
    if (!template && activeSession && selectedPromptTemplate) {
      const result = triggerUnSetPromptTemplate(selectedPromptTemplate.name);
      setSelectedPromptTemplate(undefined);
      return;
    }
    setSelectedPromptTemplate(template);
    const result = await triggerSetPromptTemplate(template ? template.name : '');
  }

  useEffect(() => {
    if (activeSession) {
      const template = promptTemplates.find(
        (template) => template.name === activeSession.prompt_template
      );
      if (template) {
        setSelectedPromptTemplate(template);
      }
    }
  }, [promptTemplates, activeSession]);

  useEffect(() => {
    console.log('selectedPromptTemplate', selectedPromptTemplate);
  }, [selectedPromptTemplate]);

  useEffect(() => {
    if (activeSession && activeSession.chats.length) {
      const chatWindows: Record<string, WindowData> = {};
      const chatboxWidth = 400;
      const margin = 250;
      const spacing = 50;
      activeSession.chats.forEach((id, index) => {
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

  if (activeSession === undefined) return null;

  return (
    <>
      <ScreenOverlay>
        <TaskBar>
          <Image
            src="icons/close_icon.svg"
            alt="close"
            width={24}
            height={24}
            style={{
              cursor: 'pointer',
              right: 10,
              top: 7,
              position: 'absolute',
            }}
            onClick={onCloseBtnClick}
          />
          <div className="flex justify-start items-center h-full w-full">
            <h2 className="capitalize text-xl text-blue-500">
              Red Teaming Session:
              <span className="font-bold text-white"> {activeSession.name}</span>
            </h2>
          </div>
        </TaskBar>
        {activeSession.chats.map((id: string, index: number) => {
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
                {!activeSession.chat_history
                  ? null
                  : activeSession.chat_history[id].map((dialogue, index) => {
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
                      {selectedPromptTemplate
                        ? selectedPromptTemplate.template.replace('{{ prompt }}', promptText)
                        : promptText}
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
          promptTemplates={promptTemplates}
          activePromptTemplate={selectedPromptTemplate}
          onCloseClick={onCloseBtnClick}
          onSendClick={handleSendPromptClick}
          onSelectPromptTemplate={handleSelectPromptTemplate}
        />
      </ScreenOverlay>
    </>
  );
}

export { ActiveChatSession };
