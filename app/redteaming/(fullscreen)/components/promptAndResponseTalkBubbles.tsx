import React from 'react';
import { PromptTalkBubble } from './prompTalkBubble';
import { ResponseTalkBubble } from './responseTalkBubble';

type PromptAndResponseBubblesProps = {
  enableTooltip: boolean;
  duration: string;
  prompt: string;
  preparedPrompt: string;
  attackModule: string | undefined;
  contextStrategy: string | undefined;
  promptTemplateName: string | undefined;
  template: string | undefined;
  response: string;
  metric: string | undefined;
  onBookmarkIconClick: CreatePromptBookmarkFunction;
};

function PromptAndResponseBubbles(props: PromptAndResponseBubblesProps) {
  const { response, attackModule, ...promptProps } = props;
  const [isHovered, setIsHovered] = React.useState(false);
  function handleMouseEnter() {
    setIsHovered(true);
  }
  function handleMouseLeave() {
    setIsHovered(false);
  }
  function handleBookmarkIconClick() {
    props.onBookmarkIconClick(
      props.duration,
      props.prompt,
      props.preparedPrompt,
      props.attackModule,
      props.contextStrategy,
      props.promptTemplateName,
      props.template,
      props.metric,
      props.response
    );
  }

  return (
    <li
      className="flex flex-col p-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <PromptTalkBubble
        {...promptProps}
        bubbleTitle={attackModule ? 'Automated red teaming agent' : 'You'}
        isHovered={isHovered}
        onBookmarkIconClick={handleBookmarkIconClick}
      />
      <ResponseTalkBubble
        isHovered={isHovered}
        response={response}
      />
    </li>
  );
}

const MemoizedPromptAndResponseBubbles = React.memo(PromptAndResponseBubbles);

export { MemoizedPromptAndResponseBubbles as PromptAndResponseBubbles };
