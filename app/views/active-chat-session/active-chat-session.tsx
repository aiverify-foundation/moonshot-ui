import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { updateChatHistory } from '@/lib/redux/slices/activeSessionSlice';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';
import { BoxPrompt } from './box-prompt';
import {
  getWindowId,
  getWindowScrollTop,
  getWindowSize,
  getWindowXY,
} from '@app/lib/window';
import { ScreenOverlay } from '@components/screen-overlay';
import { ChatWindow } from '@views/active-chat-session/window-chatbox';
import usePromptTemplateList from '@views/moonshot-desktop/hooks/usePromptTemplateList';
import {
  useUnusePromptTemplateMutation,
  useUsePromptTemplateMutation,
} from '@views/moonshot-desktop/services/prompt-template-api-service';
import { useSendPromptMutation } from '@views/moonshot-desktop/services/session-api-service';

type ActiveSessionProps = {
  zIndex: number;
  onCloseBtnClick: () => void;
};

const windowWidth = 500;
const gap = 20;
const totalWidth = windowWidth * 3 + gap * 2; // Total width for 3 windows and 2 gaps
const startX = (window.innerWidth - totalWidth) / 2; // Starting X position to center the group

function ActiveChatSession(props: ActiveSessionProps) {
  const { zIndex, onCloseBtnClick } = props;
  const activeSession = useAppSelector(
    (state) => state.activeSession.entity
  );
  const { promptTemplates, error, isLoading } =
    usePromptTemplateList();
  const [promptText, setPromptText] = useState('');
  const [selectedPromptTemplate, setSelectedPromptTemplate] =
    useState<PromptTemplate | undefined>(undefined);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'slide' | 'free'>(
    'free'
  );
  const windowsMap = useAppSelector((state) => state.windows.map);
  const [
    sendPrompt,
    {
      data: updatedChatHistory,
      isLoading: sendPromptIsLoading,
      error: sendPromptError,
    },
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
    if (
      isZKeyPressed.current !== undefined &&
      isZKeyPressed.current === true
    ) {
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
    dispatch(
      updateWindows({ [windowId]: [x, y, width, height, scrollTop] })
    );
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

  async function handleSelectPromptTemplate(
    template: PromptTemplate | undefined
  ) {
    if (!template && activeSession && selectedPromptTemplate) {
      const result = triggerUnSetPromptTemplate(
        selectedPromptTemplate.name
      );
      setSelectedPromptTemplate(undefined);
      return;
    }
    setSelectedPromptTemplate(template);
    const result = await triggerSetPromptTemplate(
      template ? template.name : ''
    );
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
        const leftPos =
          index === 0
            ? margin
            : margin + chatboxWidth * index + spacing;
        chatWindows[getWindowId(id)] = [
          leftPos,
          100,
          chatboxWidth,
          450,
          0,
        ];
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
    <ScreenOverlay zIndex={zIndex}>
      <div
        style={{ zIndex: zIndex + 1 }}
        className="w-full h-full">
        <div className="absolute h-10 w-full top-11">
          <div className="absolute flex flex-col top-3 left-6">
            <h2 className="capitalize text-lg text-red-500">
              Red Teaming Topic:
              <span className="font-bold text-slate-800 dark:text-white ml-2 text-xl">
                {activeSession.name}
              </span>
            </h2>
            <div className="w-80 text-slate-800 dark:text-white text-sm">
              {activeSession.description}
            </div>
          </div>
          <div className="absolute top-3 right-4 flex items-center gap-2">
            <div className="dark:text-white text-sm font-normal">
              Close Session
            </div>
            <Icon
              size={30}
              name={IconName.Close}
              onClick={onCloseBtnClick}
            />
          </div>
        </div>
        {layoutMode === 'free' &&
          activeSession.chats.map((id: string, index: number) => {
            if (windowsMap[getWindowId(id)]) {
              return (
                <ChatWindow.ChatBox
                  ref={(el) =>
                  (chatBoxRefs.current[index] =
                    el as HTMLDivElement)
                  }
                  windowId={getWindowId(id)}
                  key={id}
                  name={id}
                  initialXY={getWindowXY(windowsMap, id)}
                  initialSize={getWindowSize(windowsMap, id)}
                  initialScrollTop={getWindowScrollTop(
                    windowsMap,
                    id
                  )}
                  onCloseClick={() => null}
                  onWindowChange={handleOnWindowChange}
                  onWheel={handleWheel}>
                  {!activeSession.chat_history
                    ? null
                    : activeSession.chat_history[id].map(
                      (dialogue, index) => {
                        return (
                          <div
                            className="flex flex-col p-2"
                            key={index}>
                            <div className="flex flex-col text-right pr-2 text-xs text-black">
                              You
                            </div>
                            <ChatWindow.TalkBubble
                              backgroundColor="#a3a3a3"
                              fontColor="#FFF"
                              styles={{
                                alignSelf: 'flex-end',
                                maxWidth: '90%',
                              }}>
                              {dialogue.prepared_prompt}
                            </ChatWindow.TalkBubble>
                            <div
                              className="flex flex-col text-left pl-2 text-xs text-black"
                              style={{
                                maxWidth: '90%',
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
                      }
                    )}
                  {sendPromptIsLoading ? (
                    <div className="flex flex-col p-2">
                      <div className="flex flex-col text-right pr-2 text-xs text-black">
                        You
                      </div>
                      <ChatWindow.TalkBubble
                        backgroundColor="#a3a3a3"
                        fontColor="#FFF"
                        styles={{ alignSelf: 'flex-end' }}>
                        {selectedPromptTemplate
                          ? selectedPromptTemplate.template.replace(
                            '{{ prompt }}',
                            promptText
                          )
                          : promptText}
                      </ChatWindow.TalkBubble>
                      <div className="flex flex-col text-left pl-2 text-xs text-black">
                        AI
                      </div>
                      <div className="flex justify-start mr-4">
                        <ChatWindow.LoadingAnimation />
                      </div>
                    </div>
                  ) : null}
                </ChatWindow.ChatBox>
              );
            }
          })}
        {layoutMode === 'slide' && (
          <div
            id="navigation-arrows"
            className="absolute w-screen justify-between"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
            <div className="flex items-center justify-between gap-4 w-full">
              <Icon
                size={30}
                name={IconName.CircleArrowLeft}
                onClick={() =>
                  setCurrentChatIndex((prevIndex) =>
                    Math.max(prevIndex - 1, 0)
                  )
                }
              />
              <Icon
                size={30}
                name={IconName.CircleArrowRight}
                onClick={() =>
                  setCurrentChatIndex((prevIndex) =>
                    Math.min(
                      prevIndex + 1,
                      activeSession.chats.length - 1
                    )
                  )
                }
              />
            </div>
          </div>
        )}
        {layoutMode === 'slide' ? (
          <div
            style={{ width: 'calc(100vw - 60px)', height: '550px' }}>
            <div className="chat-window-container">
              <div
                className="chat-window-slide"
                style={{
                  transform: `translateX(-${currentChatIndex * 100}%)`,
                }}>
                {activeSession.chats.map(
                  (id: string, index: number) => {
                    if (
                      windowsMap[getWindowId(id)] &&
                      (index === currentChatIndex - 1 ||
                        index === currentChatIndex ||
                        index === currentChatIndex + 1)
                    ) {
                      let xOffset = startX;
                      if (index === currentChatIndex) {
                        xOffset += windowWidth + gap; // Position for the middle window
                      } else if (index === currentChatIndex + 1) {
                        xOffset += (windowWidth + gap) * 2; // Position for the rightmost window
                      }
                      // Use xOffset for the x position of initialXY
                      return (
                        <ChatWindow.ChatBox
                          ref={(el) =>
                          (chatBoxRefs.current[index] =
                            el as HTMLDivElement)
                          }
                          windowId={getWindowId(id)}
                          key={id}
                          name={id}
                          initialXY={[xOffset, 120]}
                          initialSize={[windowWidth, 550]}
                          initialScrollTop={getWindowScrollTop(
                            windowsMap,
                            id
                          )}
                          resizable={false}
                          draggable={false}
                          onCloseClick={() => null}
                          onWindowChange={handleOnWindowChange}
                          onWheel={handleWheel}>
                          {!activeSession.chat_history
                            ? null
                            : activeSession.chat_history[id].map(
                              (dialogue, index) => {
                                return (
                                  <div
                                    className="flex flex-col p-2"
                                    key={index}>
                                    <div className="flex flex-col text-right pr-2 text-xs text-black">
                                      You
                                    </div>
                                    <ChatWindow.TalkBubble
                                      backgroundColor="#a3a3a3"
                                      fontColor="#FFF"
                                      styles={{
                                        alignSelf: 'flex-end',
                                        maxWidth: '90%',
                                      }}>
                                      {dialogue.prepared_prompt}
                                    </ChatWindow.TalkBubble>
                                    <div
                                      className="flex flex-col text-left pl-2 text-xs text-black"
                                      style={{
                                        maxWidth: '90%',
                                      }}>
                                      AI
                                    </div>
                                    <ChatWindow.TalkBubble
                                      backgroundColor="#3498db"
                                      fontColor="#FFF"
                                      styles={{
                                        textAlign: 'left',
                                      }}>
                                      {dialogue.predicted_result}
                                    </ChatWindow.TalkBubble>
                                  </div>
                                );
                              }
                            )}
                          {sendPromptIsLoading ? (
                            <div className="flex flex-col p-2">
                              <div className="flex flex-col text-right pr-2 text-xs text-black">
                                You
                              </div>
                              <ChatWindow.TalkBubble
                                backgroundColor="#a3a3a3"
                                fontColor="#FFF"
                                styles={{ alignSelf: 'flex-end' }}>
                                {selectedPromptTemplate
                                  ? selectedPromptTemplate.template.replace(
                                    '{{ prompt }}',
                                    promptText
                                  )
                                  : promptText}
                              </ChatWindow.TalkBubble>
                              <div className="flex flex-col text-left pl-2 text-xs text-black">
                                AI
                              </div>
                              <div className="flex justify-start mr-4">
                                <ChatWindow.LoadingAnimation />
                              </div>
                            </div>
                          ) : null}
                        </ChatWindow.ChatBox>
                      );
                    }
                  }
                )}
              </div>
            </div>
          </div>
        ) : null}

        <BoxPrompt
          name="Prompt"
          initialXY={[
            window.innerWidth / 2 - 500 / 2, //500 width of box
            window.innerHeight - 180 - 30, //180 height of box
          ]}
          promptTemplates={promptTemplates}
          activePromptTemplate={selectedPromptTemplate}
          onCloseClick={onCloseBtnClick}
          onSendClick={handleSendPromptClick}
          onSelectPromptTemplate={handleSelectPromptTemplate}
        />
      </div>
    </ScreenOverlay>
  );
}

export { ActiveChatSession };
