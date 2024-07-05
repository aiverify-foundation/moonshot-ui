import React, { useState } from 'react';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/views/shared-components/customColors';
import { PromptBubbleInfo } from './prompt-bubble-info';
import { Chat } from '@components/chat';

type ChatBoxProps = {
  windowId: string;
  title: string;
  resizable: boolean;
  draggable: boolean;
  disableCloseIcon?: boolean;
  disableOnScroll: boolean;
  chatHistory: DialoguePairInfo[];
  disableBubbleTooltips?: boolean;
  initialXY: [number, number];
  initialSize: [number, number];
  initialScrollTop: number;
  promptTemplates: PromptTemplate[];
  currentPromptTemplate?: PromptTemplate;
  currentPromptText?: string;
  isAttackMode: boolean;
  isChatCompletionInProgress: boolean;
  styles?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  resizeHandlerColor?: React.CSSProperties['color'];
  onWindowChange: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollPosition: number,
    windowId: string
  ) => void;
  onWheel?: (event: React.WheelEvent<HTMLDivElement>) => void;
  onCloseClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onWholeWindowClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export type ChatBoxControls = {
  scrollToBottom: () => void;
  scrollToTop: () => void;
};

const ChatBox = React.forwardRef(
  (props: ChatBoxProps, ref: React.Ref<ChatBoxControls>) => {
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
      isAttackMode = false,
      isChatCompletionInProgress,
      styles,
      headerStyle,
      resizeHandlerColor,
      onWindowChange,
      onWheel,
      onCloseClick,
      onWholeWindowClick,
    } = props;

    const [dialoguePairHovered, setDialoguePairHovered] = useState<
      number | undefined
    >();

    const scrollDivRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => ({
      scrollToBottom,
      scrollToTop,
    }));

    function scrollToBottom() {
      if (scrollDivRef.current) {
        scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight;
      }
    }

    function scrollToTop() {
      if (scrollDivRef.current) {
        scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight;
      }
    }

    React.useLayoutEffect(() => {
      scrollToBottom();
    }, [chatHistory]);

    return (
      <Chat.Container
        ref={scrollDivRef}
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
        headerStyle={headerStyle}
        resizeHandlerColor={resizeHandlerColor}
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
            <li
              className="flex flex-col p-2"
              key={index}
              onMouseEnter={() => setDialoguePairHovered(index)}
              onMouseLeave={() => setDialoguePairHovered(undefined)}>
              <div className="flex flex-col text-right pr-2 text-sm text-white">
                You
              </div>
              <div className="self-end snap-top max-w-[90%]">
                <div className="flex items-center">
                  <Tooltip
                    disabled={disableBubbleTooltips}
                    position={TooltipPosition.top}
                    contentMaxWidth={500}
                    contentMinWidth={300}
                    backgroundColor={colors.moongray[700]}
                    fontColor={colors.white}
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
                      backgroundColor={colors.imdapurple}
                      fontColor="#FFF"
                      styles={{
                        marginBottom: 0,
                        fontSize: 14,
                        border:
                          dialoguePairHovered === index
                            ? '1px solid #2563eb'
                            : '1px solid transparent',
                      }}>
                      {dialogue.prepared_prompt}
                    </Chat.TalkBubble>
                  </Tooltip>
                </div>
              </div>
              <div className="max-w-[90%] flex flex-col text-left pl-2 text-sm text-white">
                AI
              </div>
              <Chat.TalkBubble
                backgroundColor={colors.chatBubbleWhite}
                fontColor={colors.black}
                styles={{
                  fontSize: 14,
                  textAlign: 'left',
                  border:
                    dialoguePairHovered === index
                      ? '1px solid #2563eb'
                      : '1px solid transparent',
                }}>
                {dialogue.predicted_result}
              </Chat.TalkBubble>
            </li>
          );
        })}

        {isChatCompletionInProgress && !isAttackMode && (
          <div className="flex flex-col p-2">
            <div className="flex flex-col text-right pr-2 text-xs text-white">
              You
            </div>
            <Chat.TalkBubble
              backgroundColor={colors.imdapurple}
              fontColor="#FFF"
              styles={{ alignSelf: 'flex-end', fontSize: 14 }}>
              {currentPromptTemplate && currentPromptText
                ? currentPromptTemplate.template.replace(
                    '{{ prompt }}',
                    currentPromptText
                  )
                : currentPromptText}
            </Chat.TalkBubble>
            <div className="flex flex-col text-left pl-2 text-xs text-white">
              AI
            </div>
            <div className="flex justify-start mr-4">
              <Chat.LoadingAnimation
                backgroundColor={colors.white}
                dotColor={colors.imdapurple}
              />
            </div>
          </div>
        )}

        {isChatCompletionInProgress && isAttackMode && (
          <div className="flex justify-start mr-4 p-2">
            <Chat.LoadingAnimation
              backgroundColor={colors.white}
              dotColor={colors.imdapurple}
            />
          </div>
        )}
      </Chat.Container>
    );
  }
);

ChatBox.displayName = 'Chatbox';

export { ChatBox };
