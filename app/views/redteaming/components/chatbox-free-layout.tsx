import { MutableRefObject, useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import {
  getWindowId,
  getWindowScrollTopById,
  getWindowSizeById,
  getWindowXYById,
} from '@/app/lib/window-utils';
import { useAppSelector } from '@/lib/redux';
import { ChatBox } from './chatbox';
import { Tooltip, TooltipPosition } from '@components/tooltip';
import useChatboxesPositionsUtils from '@views/redteaming/hooks/useChatboxesPositionsUtils';

const minimizedStyle = {
  transform: 'scale(0.1)', // Scale down the chatbox
  top: `calc(100vh - 300px)`,
  transition:
    'transform 0.3s ease-in-out, top 0.5s ease-in-out, left 0.5s ease-in-out', // Smooth transition for the animation
};

type ChatFreeLayoutProps = {
  chatSession: SessionData;
  boxRefs: MutableRefObject<HTMLDivElement[]>;
  chatCompletionInProgress: boolean;
  promptTemplates: PromptTemplate[];
  selectedPromptTemplate: PromptTemplate | undefined;
  promptText: string;
  handleOnWindowChange: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollPosition: number,
    windowId: string
  ) => void;
  handleOnWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
};

function ChatboxFreeLayout(props: ChatFreeLayoutProps) {
  const {
    chatSession,
    boxRefs,
    chatCompletionInProgress,
    promptTemplates,
    selectedPromptTemplate,
    promptText,
    handleOnWindowChange,
    handleOnWheel,
  } = props;
  const windowsMap = useAppSelector((state) => state.windows.map);
  const { resetChatboxPositions } = useChatboxesPositionsUtils(chatSession);
  const [minizedChats, setMinizedChats] = useState<string[]>([]);
  const [isMaximizing, setIsMazimizing] = useState(false);

  function handleResetClick() {
    resetChatboxPositions(true);
  }

  function handleMinimizeClick(windowId: string) {
    return () => {
      setMinizedChats([...minizedChats, windowId]);
    };
  }

  function handleMaximizeClick(windowId: string) {
    return () => {
      setIsMazimizing(true);
      setMinizedChats(minizedChats.filter((id) => id !== windowId));
    };
  }

  useEffect(() => {
    resetChatboxPositions(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsMazimizing(false);
    }, 300);
  }, [isMaximizing]);

  return (
    <>
      <div className="absolute top-[56px] w-full">
        <div
          className="absolute flex items-center 
              justify-center w-8 h-8 
            bg-white dark:bg-gray-800 
              rounded-full shadow-md left-[60%]">
          <Tooltip
            fontColor="#1e293b"
            content="Reset chatbox positions"
            position={TooltipPosition.right}
            offsetLeft={18}>
            <Icon
              name={IconName.Reset}
              onClick={handleResetClick}
              size={20}
            />
          </Tooltip>
        </div>
      </div>
      {chatSession.session.endpoints.map((id: string, index: number) => {
        const isMinimized = minizedChats.includes(getWindowId(id));
        const left = index * 20;
        return windowsMap[getWindowId(id)] ? (
          <ChatBox
            key={id}
            disableCloseIcon={
              chatSession.session.endpoints.length === 1 ||
              chatSession.session.endpoints.length - minizedChats.length === 1
            }
            resizable
            draggable
            disableOnScroll
            disableBubbleTooltips={isMinimized}
            ref={(el) => (boxRefs.current[index] = el as HTMLDivElement)}
            windowId={getWindowId(id)}
            title={id}
            initialXY={getWindowXYById(windowsMap, id)}
            initialSize={getWindowSizeById(windowsMap, id)}
            initialScrollTop={getWindowScrollTopById(windowsMap, id)}
            chatHistory={
              chatSession.chat_records ? chatSession.chat_records[id] || [] : []
            }
            promptTemplates={promptTemplates}
            currentPromptTemplate={selectedPromptTemplate}
            currentPromptText={promptText}
            isChatCompletionInProgress={chatCompletionInProgress}
            onWindowChange={handleOnWindowChange}
            onWheel={handleOnWheel}
            styles={
              isMinimized
                ? { ...minimizedStyle, left }
                : isMaximizing
                  ? {
                      transition:
                        'transform 0.3s ease-in-out, top 0.5s ease-in-out, left 0.5s ease-in-out',
                    }
                  : {}
            }
            onCloseClick={handleMinimizeClick(getWindowId(id))}
            onWholeWindowClick={
              isMinimized ? handleMaximizeClick(getWindowId(id)) : undefined
            }
          />
        ) : null;
      })}
    </>
  );
}

export { ChatboxFreeLayout };
