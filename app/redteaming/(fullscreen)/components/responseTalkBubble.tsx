import { Chat } from '@/app/components/chat';
import { colors } from '@/app/customColors';

export type ResposneTalkBubbleProps = {
  isHovered: boolean;
  response: string;
};

function ResponseTalkBubble(props: ResposneTalkBubbleProps) {
  const { isHovered, response } = props;
  const borderColor = isHovered ? '#2563eb' : 'transparent';
  const borderStyle = `1px solid ${borderColor}`;
  return (
    <>
      <h1 className="max-w-[90%] flex flex-col text-left pl-2 pt-2 text-sm text-white pb-1">
        Response
      </h1>
      <Chat.TalkBubble
        backgroundColor={colors.chatBubbleWhite}
        textAlign="left"
        fontColor={colors.black}
        fontSize={14}
        marginBottom={0}
        border={borderStyle}>
        {response}
      </Chat.TalkBubble>
    </>
  );
}

export { ResponseTalkBubble };
