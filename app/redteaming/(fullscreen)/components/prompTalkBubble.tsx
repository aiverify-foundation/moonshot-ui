import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Chat } from '@/app/components/chat';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/customColors';
import { PromptBubbleInfo } from './prompt-bubble-info';

export type PromptTalkBubbleProps = {
  bubbleTitle: string;
  isHovered: boolean;
  enableTooltip: boolean;
  duration: string;
  preparedPrompt: string;
  promptTemplateName?: string;
  template?: string;
  onBookmarkIconClick: () => void;
};

function PromptTalkBubble(props: PromptTalkBubbleProps) {
  const {
    bubbleTitle = 'You',
    isHovered,
    enableTooltip,
    duration,
    preparedPrompt,
    promptTemplateName = undefined,
    template = undefined,
    onBookmarkIconClick,
  } = props;
  const [showBookmarkIcon, setShowBookmarkIcon] = React.useState(false);
  const borderColor = isHovered ? '#2563eb' : 'transparent';
  const borderStyle = `1px solid ${borderColor}`;
  const tooltipContent = React.useMemo(
    () => (
      <PromptBubbleInfo
        duration={duration}
        prompt={preparedPrompt}
        prompt_template={promptTemplateName}
        templateString={template}
      />
    ),
    [duration, preparedPrompt, promptTemplateName, template]
  );

  function handleBookmarkIconClick() {
    onBookmarkIconClick();
    setShowBookmarkIcon(!showBookmarkIcon);
  }

  return (
    <>
      <h1 className="flex flex-col text-right pr-2 text-sm text-white pb-1">
        {bubbleTitle}
      </h1>
      <div className="self-end snap-top max-w-[90%]">
        <div className="flex items-center">
          <div className="flex gap-2">
            <div className="cursor-pointer pt-2">
              <Tooltip
                position={TooltipPosition.left}
                offsetLeft={-10}
                content="Bookmark this prompt">
                <Icon
                  role="button"
                  name={IconName.Ribbon}
                  color={colors.white}
                  onClick={handleBookmarkIconClick}
                />
              </Tooltip>
            </div>
            <Tooltip
              disabled={!enableTooltip}
              position={TooltipPosition.top}
              contentMaxWidth={500}
              contentMinWidth={300}
              backgroundColor={colors.moongray[700]}
              fontColor={colors.white}
              offsetTop={-10}
              content={tooltipContent}>
              <Chat.TalkBubble
                backgroundColor={colors.imdapurple}
                textAlign="right"
                fontColor="#FFF"
                fontSize={14}
                marginBottom={0}
                border={borderStyle}>
                {preparedPrompt}
              </Chat.TalkBubble>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}

export { PromptTalkBubble };
