import { MutableRefObject, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { getWindowId } from '@/app/lib/window-utils';
import { ChatBox } from './chatbox';
import { getDefaultChatBoxSizes } from './chatbox-slide-box-sizes';

type ChatSlideLayoutProps = {
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
  handleOnWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
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
      className="flex justify-center items-center ">
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
                border border-moongray-950`}
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
      <div className="flex items-center justify-between w-full">
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
              Math.min(prevIndex + 1, chatSession.session.endpoints.length - 1)
            );
          }}
          disabled={
            currentBoxIndex === chatSession.session.endpoints.length - 1
          }
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full gap-6
      flex flex-col items-center">
      <section className="absolute w-full px-12 top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <SlidesNavBtns />
      </section>
      <section
        className="flex overflow-hidden h-[500px] transform-gpu"
        style={{
          width: 'calc(3 * var(--chatwindow-width) + 2 * var(--gap-width))',
        }}>
        {/* IMPORTANT - must contain only 1 child which is the carouself of chatboxes */}
        <div
          className="flex w-full h-full gap-x-[50px] transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentBoxIndex * (width + gap)}px)`,
          }}>
          {chatSession.session.endpoints.map((id: string, index: number) => {
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
                  chatHistory={
                    chatSession.chat_records ? chatSession.chat_records[id] : []
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
      </section>
      <section>
        <SlidesIndexBtns
          chats={chatSession.session.endpoints}
          currentIndex={currentBoxIndex}
          onIndexClick={handleIndexBtnClick}
          onIndexMouseOver={handleIndexBtnMouseOver}
          onIndexMouseOut={handleIndexBtnMouseOut}
        />
      </section>
    </div>
  );
}

export { ChatboxSlideLayout };
