import React, { useCallback, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { useResponsiveChatboxSize } from '@/app/hooks/useResponsiveChatboxSize';
import { cn } from '@/app/lib/cn';
import { getWindowId } from '@/app/lib/window-utils';
import { ChatBox, ChatBoxControls } from './chatbox';

type ChatSlideLayoutProps = {
  chatSession: SessionData;
  chatCompletionInProgress: boolean;
  isAttackMode: boolean;
  promptTemplates: PromptTemplate[];
  selectedPromptTemplate: PromptTemplate | undefined;
  promptText: string;
  className?: string;
  handleOnWindowChange: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollPosition: number,
    windowId: string
  ) => void;
  handleCreatePromptBookmarkClick: CreatePromptBookmarkFunction;
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
                rounded-full bg-white inline-block mr-2 ipad11Inch:mr-4 ipadPro:mr-4
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

const ChatboxSlideLayout = React.forwardRef(
  (
    props: ChatSlideLayoutProps,
    ref: React.Ref<Map<string, ChatBoxControls>>
  ) => {
    const {
      chatSession,
      chatCompletionInProgress,
      isAttackMode,
      promptTemplates,
      selectedPromptTemplate,
      promptText,
      className,
      handleOnWindowChange,
      handleCreatePromptBookmarkClick,
    } = props;
    const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
    const { width, height, gap, noOfChatBoxesPerSlide } =
      useResponsiveChatboxSize();
    const [_, setHoveredIndex] = useState<number | null>(null);
    const chatBoxControlsMap = new Map<string, ChatBoxControls>();
    const [touchStart, setTouchStart] = useState<number | null>(null);
    React.useImperativeHandle(ref, () => chatBoxControlsMap);

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
            name={IconName.WideArrowLeft}
            onClick={() => {
              setCurrentBoxIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            }}
            disabled={currentBoxIndex === 0}
          />
          <Icon
            size={40}
            name={IconName.WideArrowRight}
            onClick={() => {
              setCurrentBoxIndex((prevIndex) =>
                Math.min(
                  prevIndex + 1,
                  chatSession.session.endpoints.length - 1
                )
              );
            }}
            disabled={
              currentBoxIndex === chatSession.session.endpoints.length - 3
            }
          />
        </div>
      );
    }

    const handleTouchStart = useCallback((e: TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback(
      (e: TouchEvent) => {
        if (touchStart === null) return;

        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        // Minimum swipe distance threshold (in pixels)
        const minSwipeDistance = 50;

        if (Math.abs(diff) >= minSwipeDistance) {
          if (diff > 0) {
            // Swipe left - go to next slide
            setCurrentBoxIndex((prevIndex) =>
              Math.min(prevIndex + 1, chatSession.session.endpoints.length - 3)
            );
          } else {
            // Swipe right - go to previous slide
            setCurrentBoxIndex((prevIndex) => Math.max(prevIndex - 1, 0));
          }
        }

        setTouchStart(null);
      },
      [touchStart, chatSession.session.endpoints.length]
    );

    return (
      <div
        className={cn(
          'relative w-full h-full gap-6 flex flex-col items-center',
          className
        )}>
        <section className="absolute w-full px-12 top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          {chatSession.session.endpoints.length > noOfChatBoxesPerSlide ? (
            <SlidesNavBtns />
          ) : null}
        </section>
        <main
          className="flex overflow-hidden h-[500px] ipad11Inch:h-[350px] ipadPro:h-[350px] transform-gpu"
          style={{
            width:
              chatSession.session.endpoints.length >= noOfChatBoxesPerSlide
                ? `calc(${noOfChatBoxesPerSlide} * ${width}px + ${noOfChatBoxesPerSlide - 1} * ${gap}px)`
                : width,
          }}
          onTouchStart={(e: React.TouchEvent<HTMLElement>) =>
            handleTouchStart(e.nativeEvent)
          }
          onTouchEnd={(e: React.TouchEvent<HTMLElement>) =>
            handleTouchEnd(e.nativeEvent)
          }>
          {/* IMPORTANT - must contain only 1 child which is the carousel of chatboxes */}
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
                return (
                  <ChatBox
                    key={id}
                    ref={(imperativeHandles) => {
                      if (imperativeHandles) {
                        chatBoxControlsMap.set(id, imperativeHandles);
                      } else {
                        chatBoxControlsMap.delete(id);
                      }
                    }}
                    windowId={getWindowId(
                      `${chatSession.session.session_id}-${id}`
                    )}
                    chatHistory={
                      chatSession.chat_records
                        ? chatSession.chat_records[id]
                        : []
                    }
                    promptTemplates={promptTemplates}
                    currentPromptTemplate={selectedPromptTemplate}
                    isAttackMode={isAttackMode}
                    currentPromptText={promptText}
                    title={id}
                    initialXY={[xpos, 0]}
                    initialSize={[width, height]}
                    initialScrollTop={0}
                    resizable={false}
                    draggable={false}
                    disableOnScroll
                    onWindowChange={handleOnWindowChange}
                    isChatCompletionInProgress={chatCompletionInProgress}
                    styles={{
                      borderRadius: '0.5rem',
                    }}
                    headerStyle={{
                      borderTopLeftRadius: '0.5rem',
                      borderTopRightRadius: '0.5rem',
                    }}
                    onCreatePromptBookmarkClick={
                      handleCreatePromptBookmarkClick
                    }
                  />
                );
              }
            })}
          </div>
        </main>
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
);

ChatboxSlideLayout.displayName = 'ChatboxSlideLayout';

export { ChatboxSlideLayout };
