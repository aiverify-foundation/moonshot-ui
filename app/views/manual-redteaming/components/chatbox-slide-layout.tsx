import { MutableRefObject, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { getWindowId } from '@/app/lib/window-utils';
import { ChatBox } from './chatbox';
import { getDefaultChatBoxSizes } from './chatbox-slide-box-sizes';

type ChatSlideLayoutProps = {
  chatSession: Session;
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

type SlidesIndexBtnsProps = {
  chats: string[];
  currentIndex: number;
  onIndexClick: (index: number) => void;
  onIndexMouseOver: (index: number) => void;
  onIndexMouseOut: () => void;
};
function SlidesIndexBtns(props: SlidesIndexBtnsProps) {
  const {
    chats,
    currentIndex,
    onIndexClick,
    onIndexMouseOver,
    onIndexMouseOut,
  } = props;

  function handleIndexBtnClick(index: number) {
    return () => {
      onIndexClick(index);
    };
  }

  function handleIndexBtnMouseOver(index: number) {
    return () => {
      onIndexMouseOver(index);
    };
  }

  if (chats.length <= 3) return null;
  return (
    <div
      id="slidesIndexBtns"
      className="absolute left-[50%] translate-x-[-50%] bottom-[210px] flex justify-center items-center z-[100]">
      {chats.map((name, btnIndex) => {
        let targetBoxIndex = btnIndex;
        if (btnIndex === 0 || btnIndex === 1) {
          targetBoxIndex = 0;
        } else if (btnIndex === 2) {
          targetBoxIndex = 1;
        } else if (btnIndex === chats.length - 1) {
          targetBoxIndex = chats.length - 3;
        } else if (btnIndex > 2) {
          targetBoxIndex = btnIndex - 1;
        }
        return (
          <Tooltip
            key={name}
            content={chats[btnIndex]}
            position={TooltipPosition.top}
            offsetTop={-14}
            offsetLeft={-3}>
            <div
              className={`${currentIndex === btnIndex - 1 ? 'w-3 h-3 scale-150' : 'w-3 h-3'}
                rounded-full bg-white inline-block mr-2
                hover:scale-150 transition-transform transform-gpu
                ${currentIndex === btnIndex - 1 ? 'cursor-default' : 'cursor-pointer'}
                border border-fuchsia-800 dark:border-blue-600`}
              onClick={
                currentIndex === btnIndex - 1
                  ? undefined
                  : handleIndexBtnClick(targetBoxIndex)
              }
              onMouseOver={handleIndexBtnMouseOver(btnIndex)}
              onMouseOut={onIndexMouseOut}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}

function ChatboxSlideLayout(props: ChatSlideLayoutProps) {
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
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const { width, height, gap } = getDefaultChatBoxSizes();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  function handleIndexBtnMouseOver(index: number) {
    setHoveredIndex(index);
  }

  function handleIndexBtnMouseOut() {
    setHoveredIndex(null);
  }

  function handleIndexBtnClick(index: number) {
    setCurrentBoxIndex(index);
  }

  function SlidesNavBtns() {
    return (
      <div
        id="chatboxSlideNavBtns"
        className="absolute w-screen justify-between
          top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex items-center justify-between gap-4 w-full px-20 select-none">
          <Icon
            size={40}
            name={IconName.CircleArrowLeft}
            onClick={() => {
              setCurrentBoxIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            }}
            disabled={currentBoxIndex === 0}
          />
          <Icon
            size={40}
            name={IconName.CircleArrowRight}
            onClick={() => {
              setCurrentBoxIndex((prevIndex) =>
                Math.min(prevIndex + 1, chatSession.chat_ids.length - 1)
              );
            }}
            disabled={currentBoxIndex === chatSession.chat_ids.length - 3}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <SlidesNavBtns />
      <SlidesIndexBtns
        chats={chatSession.chat_ids}
        currentIndex={currentBoxIndex}
        onIndexClick={handleIndexBtnClick}
        onIndexMouseOver={handleIndexBtnMouseOver}
        onIndexMouseOut={handleIndexBtnMouseOut}
      />
      <div className="chat-window-container">
        {/* chat-window-container must contain only 1 child (.chat-window-slide) */}
        <div
          className="chat-window-slide"
          style={{
            transform: `translateX(-${currentBoxIndex * (width + gap)}px)`,
          }}>
          {chatSession.chat_ids.map((id: string, index: number) => {
            if (
              (currentBoxIndex > 0 && index === currentBoxIndex - 1) ||
              (currentBoxIndex <= index && currentBoxIndex + 4 > index)
            ) {
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
                  // styles={{
                  //   border:
                  //     index === hoveredIndex
                  //       ? '3px solid #3498db'
                  //       : '3px solid transparent',
                  // }}
                  chatHistory={
                    chatSession.chat_history ? chatSession.chat_history[id] : []
                  }
                  promptTemplates={promptTemplates}
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
