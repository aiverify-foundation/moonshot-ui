import { MutableRefObject } from 'react';
import {
  getWindowId,
  getWindowScrollTop,
  getWindowSize,
  getWindowXY,
} from '@/app/lib/window';
import { useAppSelector } from '@/lib/redux';
import { ChatBox } from './chatbox';

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

  return chatSession.chats.map((id: string, index: number) => {
    if (windowsMap[getWindowId(id)]) {
      return (
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
          chatHistory={chatSession.chat_history[id]}
          currentPromptTemplate={selectedPromptTemplate}
          currentPromptText={promptText}
          isChatCompletionInProgress={chatCompletionInProgress}
          onWindowChange={handleOnWindowChange}
          onWheel={handleOnWheel}
        />
      );
    }
  });
}

export { ChatboxFreeLayout };
