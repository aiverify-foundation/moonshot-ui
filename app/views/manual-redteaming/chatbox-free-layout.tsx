import { MutableRefObject, useEffect } from 'react';
import {
  getWindowId,
  getWindowScrollTop,
  getWindowSize,
  getWindowXY,
} from '@/app/lib/window';
import { updateWindows, useAppDispatch, useAppSelector } from '@/lib/redux';
import { ChatBox } from './chatbox';
import { Icon, IconName } from '@/app/components/IconSVG';

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
  const dispatch = useAppDispatch();
  const windowsMap = useAppSelector((state) => state.windows.map);

  function calcDefaultChatboxesPositionsMap(overrideCachedPositions = false): Record<string, WindowData> | null {
    let chatboxesMap: Record<string, WindowData> | null = null;
    if (!chatSession.chats.length) return chatboxesMap;

    chatboxesMap = {};
    const numberOfChats = chatSession.chats.length;
    const viewportWidth = window.innerWidth; // Get the viewport width
    const margin = 20; // Left and right margin
    const adjustedViewportWidth = viewportWidth - margin * 2; // Adjust viewport width for margins
    const chatBoxWidth = 400; // Fixed width for each ChatBox
    const chatBoxHeight = 450; // Fixed height for each ChatBox
    const spacing =
      (adjustedViewportWidth - chatBoxWidth) / Math.max(numberOfChats - 1, 1); // Calculate spacing, avoid division by zero

    //These 3 are for layout calculation where number of chats is 4 or less
    //Centralize them side by side
    const gap = 10; // Gap between ChatBoxes
    const totalWidthNeeded =
      chatBoxWidth * numberOfChats + gap * (numberOfChats - 1); // Total width needed for all ChatBoxes and gaps
    const startX = (adjustedViewportWidth - totalWidthNeeded) / 2 + margin; // Calculate starting X position for centralization
    chatSession.chats.forEach((id, index) => {
      console.log(windowsMap[getWindowId(id)])
      console.log(overrideCachedPositions);
      // if (windowsMap[getWindowId(id)] && !overrideCachedPositions) return; // if window has size and position in application state from previous launch, skip setting defaults

      let xyPos: [number, number] = [0, 0];
      const xpos =
        numberOfChats > 4
          ? index * spacing + margin
          : startX + index * (chatBoxWidth + gap); // Calculate x position for even spread
      const ypos = index % 2 === 0 ? 150 : 200; // Alternate y position
      xyPos = [xpos, ypos];
      if (chatboxesMap) {
        chatboxesMap[getWindowId(id)] = [
          ...xyPos,
          chatBoxWidth,
          chatBoxHeight,
          0,
        ];
      }
    });

    return chatboxesMap
  }

  function handleResetClick() {
    const defaults = calcDefaultChatboxesPositionsMap(true);
    if (defaults) {
      dispatch(updateWindows(defaults));
    }
  }

  useEffect(() => {
    const defaults = calcDefaultChatboxesPositionsMap();
    if (defaults) {
      dispatch(updateWindows(defaults));
    }
  }, []);

  console.log('renderrrrr')
  return <div>
    <div className="absolute top-[56px] w-full">
      <div className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md left-[60%]">
        <Icon name={IconName.Reset} onClick={handleResetClick} size={20} />
      </div>
    </div>
    {chatSession.chats.map((id: string, index: number) => {
      console.log(windowsMap[getWindowId(id)])
      return windowsMap[getWindowId(id)] ?
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
        : null
    }
    )};
  </div>
}

export { ChatboxFreeLayout };
