import { forwardRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { useAppSelector } from '@/lib/redux';
import { PromptBubbleInfo } from './prompt-bubble-info';
import { PromptAndResponseBubble } from './promptAndResponseBubble';
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

type PromptAndResponseBubbleProps = {
  index: number;
  style: React.CSSProperties;
  hoveredIndex: number;
  data: DialoguePairInfo[];
  onMouseEnter?: (index: number) => void;
  onMouseLeave?: () => void;
};

const ChatBoxVirtualized = forwardRef<HTMLDivElement, ChatBoxProps>(
  (props, ref) => {
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
    const getSize = (index: number) => (index % 2 === 0 ? 50 : 100);
    const Row = ({ index, style }) => (
      <div style={{ color: 'red', ...style }}>Row {index}</div>
    );

    function PromptAndResponseBubble(props: PromptAndResponseBubbleProps) {
      const { index, style, data } = props;
      const isDarkMode = useAppSelector((state) => state.darkMode.value);
      const dialogue = data[index];
      console.log(dialogue);
      const hoveredIndex = 0;
      return (
        <div style={style}>
          <div
            className="flex flex-col p-2"
            style={style}
            key={index}
            onMouseEnter={() => null}
            onMouseLeave={() => null}>
            <div className="flex flex-col text-right pr-2 text-sm text-black">
              You
            </div>
            <div style={{ color: 'blue', ...style }}>Row {index}</div>
            <div className="self-end snap-top max-w-[90%]">
              <Chat.TalkBubble
                backgroundColor="#475569"
                fontColor="#FFF"
                styles={{
                  fontSize: 14,
                  border:
                    hoveredIndex === index
                      ? '2px solid #2563eb'
                      : '2px solid transparent',
                }}>
                {dialogue.prepared_prompt}
              </Chat.TalkBubble>
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
                  hoveredIndex === index
                    ? '2px solid #2563eb'
                    : '2px solid transparent',
              }}>
              {dialogue.predicted_result}
            </Chat.TalkBubble>
          </div>
        </div>
      );
    }

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
        <div
          style={{
            height: '100%',
          }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width}
                itemCount={100}
                itemSize={getSize}
                itemData={chatHistory}>
                {PromptAndResponseBubble}
              </List>
            )}
          </AutoSizer>
        </div>
        {/* {isChatCompletionInProgress ? (
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
      ) : null} */}
      </Chat.Container>
    );
  }
);

ChatBoxVirtualized.displayName = 'Chatbox';

export { ChatBoxVirtualized };
