import { forwardRef } from 'react';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { ColorCodedTemplateString } from './color-coded-template';
import { Chat } from '@components/chat';

type ChatBoxProps = {
  windowId: string;
  title: string;
  resizable: boolean;
  draggable: boolean;
  disableOnScroll: boolean;
  chatHistory: DialoguePairInfo[];
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
};

const ChatBox = forwardRef<HTMLDivElement, ChatBoxProps>((props, ref) => {
  const {
    windowId,
    resizable,
    draggable,
    disableOnScroll,
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
  } = props;

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
      styles={styles}
      onWindowChange={onWindowChange}
      onWheel={onWheel}>
      {chatHistory.map((dialogue, index) => {
        console.log(dialogue);
        const appliedPromptTemplate = promptTemplates
          ? promptTemplates.find(
              (template) => template.name === dialogue.prompt_template
            )
          : undefined;

        return (
          <div
            className="flex flex-col p-2"
            key={index}>
            <div className="flex flex-col text-right pr-2 text-xs text-black">
              You
            </div>
            <div className="self-end snap-top max-w-[90%]">
              <Tooltip
                position={TooltipPosition.left}
                content={
                  appliedPromptTemplate ? (
                    <ColorCodedTemplateString
                      template={appliedPromptTemplate?.template}
                    />
                  ) : (
                    'no template'
                  )
                }>
                <Chat.TalkBubble
                  backgroundColor="#a3a3a3"
                  fontColor="#FFF">
                  {dialogue.prepared_prompt}
                </Chat.TalkBubble>
              </Tooltip>
            </div>
            <div className="max-w-[90%] flex flex-col text-left pl-2 text-xs text-black">
              AI
            </div>
            <Chat.TalkBubble
              backgroundColor="#3498db"
              fontColor="#FFF"
              styles={{ textAlign: 'left' }}>
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
            backgroundColor="#a3a3a3"
            fontColor="#FFF"
            styles={{ alignSelf: 'flex-end' }}>
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
