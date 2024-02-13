import { MutableRefObject, useEffect } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import {
  getWindowId,
  getWindowScrollTop,
  getWindowSize,
  getWindowXY,
} from '@/app/lib/window';
import { useAppSelector } from '@/lib/redux';
import { ChatBox } from './chatbox';
import useChatboxesPositionsUtils from './hooks/useChatboxesPositionsUtils';
import { Tooltip, TooltipPosition } from '@components/tooltip';

type ChatFreeLayoutProps = {
  chatSession: Session;
  boxRefs: MutableRefObject<HTMLDivElement[]>;
  chatCompletionInProgress: boolean;
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
    selectedPromptTemplate,
    promptText,
    handleOnWindowChange,
    handleOnWheel,
  } = props;
  const windowsMap = useAppSelector((state) => state.windows.map);
  const { resetChatboxPositions } = useChatboxesPositionsUtils(chatSession);

  function handleResetClick() {
    resetChatboxPositions(true);
  }

  useEffect(() => {
    resetChatboxPositions(false);
  }, []);

  return (
    <div>
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
      {chatSession.chats.map((id: string, index: number) => {
        return windowsMap[getWindowId(id)] ? (
          <ChatBox
            key={id}
            resizable
            draggable
            disableOnScroll
            ref={(el) => (boxRefs.current[index] = el as HTMLDivElement)}
            windowId={getWindowId(id)}
            title={id}
            initialXY={getWindowXY(windowsMap, id)}
            initialSize={getWindowSize(windowsMap, id)}
            initialScrollTop={getWindowScrollTop(windowsMap, id)}
            chatHistory={chatSession.chat_history[id] || []}
            currentPromptTemplate={selectedPromptTemplate}
            currentPromptText={promptText}
            isChatCompletionInProgress={chatCompletionInProgress}
            onWindowChange={handleOnWindowChange}
            onWheel={handleOnWheel}
          />
        ) : null;
      })}
    </div>
  );
}

export { ChatboxFreeLayout };
