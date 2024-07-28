import { Chat } from '@/app/components/chat';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/views/shared-components/customColors';
import { PromptBubbleInfo } from './prompt-bubble-info';

type PromptTalkBubbleProps = {
  isHovered: boolean;
  enableTooltip: boolean;
  duration: string;
  preparedPrompt: string;
  promptTemplateName: string;
  template?: string;
};

function PromptTalkBubble(props: PromptTalkBubbleProps) {
  const {
    isHovered,
    enableTooltip,
    duration,
    preparedPrompt,
    promptTemplateName,
    template = undefined,
  } = props;
  const borderColor = isHovered ? '#2563eb' : 'transparent';
  const borderStyle = `1px solid ${borderColor}`;
  return (
    <>
      <h1 className="flex flex-col text-right pr-2 text-sm text-white">You</h1>
      <div className="self-end snap-top max-w-[90%]">
        <div className="flex items-center">
          <Tooltip
            disabled={!enableTooltip}
            position={TooltipPosition.top}
            contentMaxWidth={500}
            contentMinWidth={300}
            backgroundColor={colors.moongray[700]}
            fontColor={colors.white}
            offsetTop={-10}
            content={
              <PromptBubbleInfo
                duration={duration}
                prompt={preparedPrompt}
                prompt_template={promptTemplateName}
                templateString={template}
              />
            }>
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
    </>
  );
}

export { PromptTalkBubble };
