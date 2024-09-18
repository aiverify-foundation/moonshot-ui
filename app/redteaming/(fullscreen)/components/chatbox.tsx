import React from 'react';
import { Chat } from '@/app/components/chat';
import { colors } from '@/app/customColors';
import { PromptAndResponseBubbles } from './promptAndResponseTalkBubbles';

type ChatBoxProps = {
  windowId: string;
  title: string;
  resizable: boolean;
  draggable: boolean;
  disableCloseIcon?: boolean;
  disableOnScroll: boolean;
  chatHistory: PromptDetails[];
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
  onCreatePromptBookmarkClick: CreatePromptBookmarkFunction;
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
      onCreatePromptBookmarkClick,
    } = props;

    const scrollDivRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => ({
      scrollToBottom,
      scrollToTop,
    }));

    React.useLayoutEffect(() => {
      scrollToBottom();
    }, [chatHistory]);

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
          const template = appliedPromptTemplate?.template;
          return (
            <PromptAndResponseBubbles
              key={index}
              enableTooltip={!disableBubbleTooltips}
              template={template}
              duration={dialogue.duration}
              prompt={dialogue.prompt}
              preparedPrompt={dialogue.prepared_prompt}
              promptTemplateName={dialogue.prompt_template}
              response={dialogue.predicted_result}
              attackModule={dialogue.attack_module}
              contextStrategy={dialogue.context_strategy}
              metric={dialogue.metric}
              onBookmarkIconClick={onCreatePromptBookmarkClick}
            />
          );
        })}

        {isChatCompletionInProgress && !isAttackMode && (
          <div
            className="flex flex-col p-2"
            role="status">
            <div className="flex flex-col text-right pr-2 text-xs text-white pb-1">
              You
            </div>
            <Chat.TalkBubble
              backgroundColor={colors.imdapurple}
              fontColor="#FFF"
              styles={inProgressPromptStyle}>
              {inProgressPromptText}
            </Chat.TalkBubble>
            <div className="flex flex-col text-left pl-2 text-xs text-white pb-1">
              Response
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
          <div
            className="flex justify-start mr-4 p-2"
            role="status">
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
