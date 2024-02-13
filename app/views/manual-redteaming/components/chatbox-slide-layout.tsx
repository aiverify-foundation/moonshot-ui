import { MutableRefObject, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { getWindowId } from '@/app/lib/window';
import { getDefaultChatBoxSizes } from './chatbox-slide-box-sizes';
import { Chat } from '@components/chat';
import { ChatBox } from './chatbox';

type ChatSlideLayoutProps = {
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

function ChatboxSlideLayout(props: ChatSlideLayoutProps) {
  const {
    chatSession,
    boxRefs,
    chatCompletionInProgress,
    selectedPromptTemplate,
    promptText,
    handleOnWindowChange,
    handleOnWheel,
  } = props;
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const { width, height, gap } = getDefaultChatBoxSizes();
  return (
    <>
      <div
        id="chatboxSlideNavBtns"
        className="absolute w-screen justify-between"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
        <div className="flex items-center justify-between gap-4 w-full px-20 select-none">
          <Icon
            size={40}
            name={IconName.CircleArrowLeft}
            onClick={() =>
              setCurrentBoxIndex((prevIndex) => Math.max(prevIndex - 1, 0))
            }
            disabled={currentBoxIndex === 0}
          />
          <Icon
            size={40}
            name={IconName.CircleArrowRight}
            onClick={() =>
              setCurrentBoxIndex((prevIndex) =>
                Math.min(prevIndex + 1, chatSession.chats.length - 1)
              )
            }
            disabled={currentBoxIndex === chatSession.chats.length - 3}
          />
        </div>
      </div>
      <div className="chat-window-container">
        <div
          className="chat-window-slide"
          style={{
            transform: `translateX(-${currentBoxIndex * (width + gap)}px)`,
          }}>
          {chatSession.chats.map((id: string, index: number) => {
            if (
              (currentBoxIndex > 0 && index === currentBoxIndex - 1) ||
              index === currentBoxIndex ||
              index === currentBoxIndex + 1 ||
              index === currentBoxIndex + 2 ||
              index === currentBoxIndex + 3
            ) {
              if (!chatSession.chat_history[id]) return null;
              const xpos = index === 0 ? 0 : (width + gap) * index;
              const scrollPosition = boxRefs.current[index]
                ? boxRefs.current[index].scrollHeight -
                boxRefs.current[index].clientHeight
                : 0;
              return (
                <ChatBox
                  key={id}
                  ref={(el) => (boxRefs.current[index] = el as HTMLDivElement)}
                  windowId={getWindowId(id)}
                  chatHistory={chatSession.chat_history[id]}
                  currentPromptTemplate={selectedPromptTemplate}
                  currentPromptText={promptText}
                  title={id}
                  initialXY={[xpos, 0]}
                  initialSize={[width, height]}
                  initialScrollTop={scrollPosition}
                  resizable={false}
                  draggable={false}
                  disableOnScroll
                  onWindowChange={handleOnWindowChange}
                  onWheel={handleOnWheel}
                  isChatCompletionInProgress={chatCompletionInProgress}
                />
              );
            }
          })}
        </div>
      </div>
    </>
  );
}

export { ChatboxSlideLayout };
