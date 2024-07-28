import React, { useState } from 'react';
import { colors } from '@/app/views/shared-components/customColors';
import { PromptTalkBubble } from './prompTalkBubble';
import { ResponseTalkBubble } from './responseTalkBubble';
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

    const inProgressPromptStyle: React.CSSProperties = {
      alignSelf: 'flex-end',
      fontSize: 14,
    };

    const inProgressPromptText =
      currentPromptTemplate && currentPromptText
        ? currentPromptTemplate.template.replace(
            '{{ prompt }}',
            currentPromptText
          )
        : currentPromptText;

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
          const isHovered = dialoguePairHovered === index;
          return (
            <li
              className="flex flex-col p-2"
              key={index}
              onMouseEnter={() => setDialoguePairHovered(index)}
              onMouseLeave={() => setDialoguePairHovered(undefined)}>
              <PromptTalkBubble
                isHovered={isHovered}
                enableTooltip={!disableBubbleTooltips}
                template={appliedPromptTemplate?.template}
                duration={dialogue.duration}
                preparedPrompt={dialogue.prepared_prompt}
                promptTemplateName={dialogue.prompt_template}
              />
              <ResponseTalkBubble
                isHovered={isHovered}
                response={dialogue.predicted_result}
              />
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
              styles={inProgressPromptStyle}>
              {inProgressPromptText}
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
