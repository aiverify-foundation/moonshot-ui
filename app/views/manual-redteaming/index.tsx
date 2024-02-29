import { useEffect, useRef, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import {
  useUnusePromptTemplateMutation,
  useUsePromptTemplateMutation,
} from '@/app/services/prompt-template-api-service';
import { useSendPromptMutation } from '@/app/services/session-api-service';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';
import { ChatboxFreeLayout } from './components/chatbox-free-layout';
import { ChatboxSlideLayout } from './components/chatbox-slide-layout';
import { PromptBox } from './components/prompt-box';
import { getWindowId, getWindowXYById } from '@app/lib/window-utils';
import { ScreenOverlay } from '@components/screen-overlay';
import { Tooltip, TooltipPosition } from '@components/tooltip';
import { updateChatHistory } from '@redux/slices';
import { LayoutMode, setChatLayoutMode } from '@redux/slices';
import usePromptTemplateList from '@views/moonshot-desktop/hooks/usePromptTemplateList';

type ActiveSessionProps = {
  zIndex: number;
  onCloseBtnClick: () => void;
};

const promptBoxId = 'prompt-box';

function ManualRedTeaming(props: ActiveSessionProps) {
  const { zIndex, onCloseBtnClick } = props;
  const activeSession = useAppSelector((state) => state.activeSession.entity);
  const { promptTemplates, error, isLoading } = usePromptTemplateList();
  const [promptText, setPromptText] = useState('');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<
    PromptTemplate | undefined
  >(undefined);

  let layoutMode = useAppSelector((state) => state.chatLayoutMode.value);
  if (activeSession && activeSession.chats.length < 4) {
    layoutMode = LayoutMode.FREE;
  }
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

  const handleOnWheel = (e: React.WheelEvent<HTMLDivElement>) => {
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

  async function handleSelectPromptTemplate(
    template: PromptTemplate | undefined
  ) {
    if (!template && activeSession && selectedPromptTemplate) {
      triggerUnSetPromptTemplate(selectedPromptTemplate.name);
      setSelectedPromptTemplate(undefined);
      return;
    }
    setSelectedPromptTemplate(template);
    await triggerSetPromptTemplate(template ? template.name : '');
  }

  function calcPromptBoxDefaults(): WindowData {
    const width = 500;
    const height = 180;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight - height - 5;
    return [left, top, width, height, 0];
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
    const promptBoxDefaults: Record<string, WindowData> = {};
    promptBoxDefaults[getWindowId(promptBoxId)] = calcPromptBoxDefaults();
    dispatch(updateWindows(promptBoxDefaults));
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
            <h2 className="capitalize text-lg dark:text-red-500 text-fuchsia-900">
              Red Teaming -
              <span className="font-bold text-fuchsia-980 dark:text-white ml-2 text-lg">
                {activeSession.name}
              </span>
            </h2>
            <div className="w-80 text-slate-800 dark:text-white text-sm">
              {activeSession.description}
            </div>
          </div>
          {activeSession && activeSession.chats.length > 3 ? (
            <div className="flex gap-6 absolute top-4 left-[50%] transform -translate-x-1/2">
              <Tooltip
                disabled={layoutMode === LayoutMode.SLIDE}
                content="Switch to slide layout"
                position={TooltipPosition.left}
                offsetLeft={-18}
                offsetTop={5}>
                <Icon
                  size={25}
                  name={IconName.LayoutColumns}
                  disabled={layoutMode === LayoutMode.SLIDE}
                  onClick={() => dispatch(setChatLayoutMode(LayoutMode.SLIDE))}
                />
              </Tooltip>
              <Tooltip
                disabled={layoutMode === LayoutMode.FREE}
                content="Switch to free layout"
                position={TooltipPosition.right}
                offsetLeft={18}
                offsetTop={5}>
                <Icon
                  size={26}
                  name={IconName.LayoutWtf}
                  disabled={layoutMode === LayoutMode.FREE}
                  onClick={() => dispatch(setChatLayoutMode(LayoutMode.FREE))}
                />
              </Tooltip>
            </div>
          ) : null}
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

        {layoutMode === LayoutMode.FREE ? (
          <ChatboxFreeLayout
            chatSession={activeSession}
            boxRefs={chatBoxRefs}
            chatCompletionInProgress={sendPromptIsLoading}
            promptTemplates={promptTemplates}
            selectedPromptTemplate={selectedPromptTemplate}
            promptText={promptText}
            handleOnWindowChange={handleOnWindowChange}
            handleOnWheel={handleOnWheel}
          />
        ) : null}

        {layoutMode === LayoutMode.SLIDE ? (
          <ChatboxSlideLayout
            chatSession={activeSession}
            boxRefs={chatBoxRefs}
            chatCompletionInProgress={sendPromptIsLoading}
            selectedPromptTemplate={selectedPromptTemplate}
            promptText={promptText}
            handleOnWindowChange={handleOnWindowChange}
            handleOnWheel={handleOnWheel}
          />
        ) : null}

        <PromptBox
          windowId={getWindowId(promptBoxId)}
          name={promptBoxId}
          draggable={layoutMode === LayoutMode.FREE}
          initialXY={
            windowsMap[getWindowId(promptBoxId)]
              ? getWindowXYById(windowsMap, promptBoxId)
              : [710, 760]
          }
          chatSession={activeSession}
          promptTemplates={promptTemplates}
          activePromptTemplate={selectedPromptTemplate}
          onCloseClick={onCloseBtnClick}
          onSendClick={handleSendPromptClick}
          onSelectPromptTemplate={handleSelectPromptTemplate}
          onWindowChange={handleOnWindowChange}
          onCloseSessionCommand={onCloseBtnClick}
        />
      </div>
    </ScreenOverlay>
  );
}

export { ManualRedTeaming };
