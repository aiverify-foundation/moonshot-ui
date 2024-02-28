import { forwardRef, useState } from 'react';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { Chat } from '@components/chat';
import { PromptBubbleInfo } from './prompt-bubble-info';
import { useAppSelector } from '@/lib/redux';

type ChatBoxProps = {
  windowId: string;
  title: string;
  resizable: boolean;
  draggable: boolean;
  disableCloseIcon: boolean;
  disableOnScroll: boolean;
  chatHistory: DialoguePairInfo[];
  disableBubbleTooltips?: boolean;
  initialXY: [number, number];
  initialSize: [number, number];
  initialScrollTop: number;
  promptTemplates: PromptTemplate[];
  currentPromptTemplate?: PromptTemplate;
  currentPromptText?: string;
  isChatCompletionInProgress: boolean;
  styles?: React.CSSProperties;
  onWindowChange: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollPosition: number,
    windowId: string
  ) => void;
  onWheel: (event: React.WheelEvent<HTMLDivElement>) => void;
  onCloseClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onWholeWindowClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const ChatBox = forwardRef<HTMLDivElement, ChatBoxProps>((props, ref) => {
  const {
    windowId,
    resizable,
    draggable,
    disableCloseIcon = true,
    disableOnScroll,
    disableBubbleTooltips = false,
    title,
    chatHistory,
    initialXY,
    initialSize,
    initialScrollTop,
    promptTemplates,
    currentPromptTemplate,
    currentPromptText,
    isChatCompletionInProgress,
    styles,
    onWindowChange,
    onWheel,
    onCloseClick,
    onWholeWindowClick,
  } = props;

  const [dialoguePairHovered, setDialoguePairHovered] = useState<
    number | undefined
  >();
  const isDarkMode = useAppSelector((state) => state.darkMode.value);

  return (
    <Chat.Container
      ref={ref}
      windowId={windowId}
      name={title}
      initialXY={initialXY}
      initialSize={initialSize}
      initialScrollTop={initialScrollTop}
      resizable={resizable}
      draggable={draggable}
      disableOnScroll={disableOnScroll}
      disableCloseIcon={disableCloseIcon}
      styles={styles}
      onWindowChange={onWindowChange}
      onWheel={onWheel}
      onCloseClick={onCloseClick}
      onWholeWindowClick={onWholeWindowClick}>
      {chatHistory.map((dialogue, index) => {
        const appliedPromptTemplate = promptTemplates
          ? promptTemplates.find(
            (template) => template.name === dialogue.prompt_template
          )
          : undefined;
        return (
          <div
            className="flex flex-col p-2"
            key={index}
            onMouseEnter={() => setDialoguePairHovered(index)}
            onMouseLeave={() => setDialoguePairHovered(undefined)}>
            <div className="flex flex-col text-right pr-2 text-sm text-black">
              You
            </div>
            <div className="self-end snap-top max-w-[90%]">
              <Tooltip
                disabled={disableBubbleTooltips}
                position={TooltipPosition.top}
                contentMaxWidth={500}
                contentMinWidth={300}
                backgroundColor={isDarkMode ? '#0f172a' : '#4c2b5d'}
                fontColor={isDarkMode ? '#FFFFFF' : '#000000'}
                offsetTop={-10}
                content={
                  <PromptBubbleInfo
                    duration={dialogue.duration}
                    prompt={dialogue.prepared_prompt}
                    prompt_template={dialogue.prompt_template}
                    templateString={
                      appliedPromptTemplate
                        ? appliedPromptTemplate.template
                        : undefined
                    }
                  />
                }>
                <Chat.TalkBubble
                  backgroundColor="#475569"
                  fontColor="#FFF"
                  styles={{
                    fontSize: 14,
                    border:
                      dialoguePairHovered === index
                        ? '2px solid #2563eb'
                        : '2px solid transparent',
                  }}>
                  {dialogue.prepared_prompt}
                </Chat.TalkBubble>
              </Tooltip>
            </div>
            <div className="max-w-[90%] flex flex-col text-left pl-2 text-sm text-black">
              AI
            </div>
            <Chat.TalkBubble
              backgroundColor="#94a3b8"
              fontColor="#FFF"
              styles={{
                fontSize: 14,
                textAlign: 'left',
                border:
                  dialoguePairHovered === index
                    ? '2px solid #2563eb'
                    : '2px solid transparent',
              }}>
              {dialogue.predicted_result}
            </Chat.TalkBubble>
          </div>
        );
      })}
      {isChatCompletionInProgress ? (
        <div className="flex flex-col p-2">
          <div className="flex flex-col text-right pr-2 text-xs text-black">
            You
          </div>
          <Chat.TalkBubble
            backgroundColor="#475569"
            fontColor="#FFF"
            styles={{ alignSelf: 'flex-end', fontSize: 14 }}>
            {currentPromptTemplate && currentPromptText
              ? currentPromptTemplate.template.replace(
                '{{ prompt }}',
                currentPromptText
              )
              : currentPromptText}
          </Chat.TalkBubble>
          <div className="flex flex-col text-left pl-2 text-xs text-black">
            AI
          </div>
          <div className="flex justify-start mr-4">
            <Chat.LoadingAnimation />
          </div>
        </div>
      ) : null}
    </Chat.Container>
  );
});

ChatBox.displayName = 'Chatbox';

export { ChatBox };
