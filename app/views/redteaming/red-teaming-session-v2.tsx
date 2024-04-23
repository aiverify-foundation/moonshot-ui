import { useEffect, useRef, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import {
  useSendPromptMutation,
  useSetPromptTemplateMutation,
  useUnsetPromptTemplateMutation,
} from '@/app/services/session-api-service';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';
import tailwindConfig from '@/tailwind.config';
import { AutoRedTeamingForm } from './components/autoRedTeamingForm';
import { BookmarksList } from './components/bookmarksList';
import { ChatboxFreeLayout } from './components/chatbox-free-layout';
import { ChatboxSlideLayout } from './components/chatbox-slide-layout';
import { PromptBox } from './components/prompt-box';
import { getWindowId, getWindowXYById } from '@app/lib/window-utils';
import { Tooltip, TooltipPosition } from '@components/tooltip';
import { updateChatHistory } from '@redux/slices';
import { LayoutMode, setChatLayoutMode } from '@redux/slices';
import { Z_Index } from '@views/moonshot-desktop/constants';
import usePromptTemplateList from '@views/moonshot-desktop/hooks/usePromptTemplateList';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type ActiveSessionProps = {
  zIndex: number;
  onCloseBtnClick: () => void;
};

const promptBoxId = 'prompt-box';

function ManualRedTeamingV2(props: ActiveSessionProps) {
  const { zIndex, onCloseBtnClick } = props;
  const dispatch = useAppDispatch();
  const [promptText, setPromptText] = useState('');
  const activeSession = useAppSelector((state) => state.activeSession.entity);
  const windowsMap = useAppSelector((state) => state.windows.map);
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<
    PromptTemplate | undefined
  >(undefined);

  let layoutMode = useAppSelector((state) => state.chatLayoutMode.value);

  if (activeSession && activeSession.chat_ids.length < 4) {
    layoutMode = LayoutMode.FREE;
  }

  let promptBoxInitialXY: [number, number] = [880, 720];

  if (layoutMode === LayoutMode.FREE) {
    if (windowsMap[getWindowId(promptBoxId)]) {
      promptBoxInitialXY = getWindowXYById(windowsMap, promptBoxId);
    }
  }

  const {
    promptTemplates,
    error: promptTemplatesError,
    isLoading: promptTemplatesIsLoading,
    refetch: refetchPromptTemplates,
  } = usePromptTemplateList();

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
  ] = useSetPromptTemplateMutation();

  const [
    triggerUnSetPromptTemplate,
    {
      data: unusePromptTemplateResult,
      isLoading: unusePromptTemplateResultIsLoding,
      error: unusePromptTemplateResultError,
    },
  ] = useUnsetPromptTemplateMutation();

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
      triggerUnSetPromptTemplate({
        session_id: activeSession.session_id,
        templateName: selectedPromptTemplate.name,
      });
      setSelectedPromptTemplate(undefined);
      return;
    }
    setSelectedPromptTemplate(template);
    if (activeSession && template)
      await triggerSetPromptTemplate({
        session_id: activeSession.session_id,
        templateName: template.name,
      });
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
    <>
      <div
        className="absolute dark:bg-moongray-800 rounded-2xl p-6 m-[10px] shadow-lg opacity-95"
        style={{
          zIndex: zIndex + 1,
          width: 'calc(100vw - 20px)',
          height: 'calc(100vh - 20px)',
        }}>
        <header className="flex relative justify-between">
          <div className="flex flex-col left-6 pl-5">
            <h2 className="capitalize text-lg dark:text-white">
              <span className="font-bold dark:text-white text-lg">
                {activeSession.name}
              </span>
            </h2>
            <div className="w-80 text-slate-800 dark:text-white text-sm ml-1">
              {activeSession.description}
            </div>
          </div>
          {activeSession && activeSession.chat_ids.length > 3 ? (
            <div className="flex gap-6 top-10 left-[58%] dark:bg-moongray-600 rounded p-1 px-4 shadow-lg items-center">
              <p className="text-sm text-white">Layout: </p>
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
          <div>
            <Icon
              name={IconName.Close}
              size={32}
              onClick={onCloseBtnClick}
            />
          </div>
        </header>
        <div
          className="flex flex-col w-full relative"
          style={{ height: 'calc(100% - 40px)' }}>
          <div className="flex h-full">
            <div className="relative">
              <div className="h-full w-[350px] pt-10 flex flex-col gap-2">
                <section className="dark:bg-moongray-600 rounded p-4 m-[10px] shadow-lg">
                  <AutoRedTeamingForm />
                </section>
                <section className="dark:bg-moongray-600 rounded p-4 m-[10px] shadow-lg">
                  <BookmarksList />
                </section>
              </div>
            </div>
            <div
              className=" h-full"
              style={{ width: 'calc(100% - 200px)' }}>
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
                  promptTemplates={promptTemplates}
                  selectedPromptTemplate={selectedPromptTemplate}
                  promptText={promptText}
                  handleOnWindowChange={handleOnWindowChange}
                  handleOnWheel={handleOnWheel}
                />
              ) : null}

              <div className="absolute bottom-[200px] right-[130px]">
                <Button
                  size="sm"
                  type="button"
                  mode={ButtonType.PRIMARY}
                  iconName={IconName.Ribbon}
                  iconSize={16}
                  text="Save as Bookmark"
                  btnColor={colors.moongray[950]}
                  hoverBtnColor={colors.moongray[900]}
                  textColor={colors.white}
                  onClick={() => null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Prompt box must NOT be within any positioned container because it is positioned relative to viewport */}
      <PromptBox
        zIndex={Z_Index.Top}
        windowId={getWindowId(promptBoxId)}
        name={promptBoxId}
        draggable={layoutMode === LayoutMode.FREE}
        initialXY={promptBoxInitialXY}
        chatSession={activeSession}
        promptTemplates={promptTemplates}
        activePromptTemplate={selectedPromptTemplate}
        onCloseClick={onCloseBtnClick}
        onSendClick={handleSendPromptClick}
        onSelectPromptTemplate={handleSelectPromptTemplate}
        onWindowChange={handleOnWindowChange}
        onCloseSessionCommand={onCloseBtnClick}
      />
    </>
  );
}

export { ManualRedTeamingV2 };
