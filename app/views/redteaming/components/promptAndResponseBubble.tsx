import React from 'react';
import { Chat } from '@/app/components/chat';

type PromptAndResponseBubbleProps = {
  index: number;
  style: React.CSSProperties;
  hoveredIndex: number;
  data: DialoguePairInfo[];
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
};

function PromptAndResponseBubble(props: PromptAndResponseBubbleProps) {
  const {
    index,
    style,
    hoveredIndex = 0,
    data,
    onMouseEnter,
    onMouseLeave,
  } = props;
  const dialogue = data[props.index];
  return (
    <div style={style}>
      <div
        className="flex flex-col p-2"
        style={style}
        key={index}
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={() => onMouseLeave()}>
        <div className="flex flex-col text-right pr-2 text-sm text-white">
          You
        </div>
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
        <div className="max-w-[90%] flex flex-col text-left pl-2 text-sm text-white">
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

export { PromptAndResponseBubble };
