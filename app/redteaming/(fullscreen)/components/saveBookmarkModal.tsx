import { Chat } from '@/app/components/chat';
import { colors } from '@/app/views/shared-components/customColors';
import { Modal } from '@/app/views/shared-components/modal/modal';
import { PromptBubbleInfo } from './prompt-bubble-info';

type SaveBookMarkModalProps = {
  duration: string;
  prompt: string;
  preparedPrompt: string;
  attackModule: string | undefined;
  contextStrategy: string | undefined;
  promptTemplateName: string | undefined;
  template: string | undefined;
  response: string;
  metric: string | undefined;
  onCloseIconClick: () => void;
};

function SaveBookMarkModal(props: SaveBookMarkModalProps) {
  const {
    duration,
    preparedPrompt,
    promptTemplateName,
    template,
    response,
    onCloseIconClick,
  } = props;
  return (
    <Modal
      width={900}
      height={560}
      heading="Save New Bookmark"
      bgColor={colors.moongray['800']}
      textColor="#FFFFFF"
      enableScreenOverlay={true}
      onCloseIconClick={onCloseIconClick}>
      <p className="mb-8 text-[0.95rem]">
        Save this turn as a bookmark to be able to quickly reference it in
        future red teaming exercises.
      </p>
      <main className="flex gap-4 h-[300px]">
        <section className="flex-1 h-full bg-chatboxbg p-4 pr-2 rounded-lg">
          <div className="custom-scrollbar overflow-y-auto h-full">
            <div className="max-w-[90%]">
              <h2 className="text-left text-white text-[0.8rem] mb-2">
                Prompt
              </h2>
              <Chat.TalkBubble
                backgroundColor={colors.imdapurple}
                textAlign="left"
                fontColor="#FFF"
                fontSize={14}
                marginBottom={0}>
                {preparedPrompt}
              </Chat.TalkBubble>
              <h2 className="text-left text-white text-[0.8rem] mb-2 mt-4">
                Response
              </h2>
              <Chat.TalkBubble
                backgroundColor={colors.chatBubbleWhite}
                textAlign="left"
                fontColor={colors.black}
                fontSize={14}
                marginBottom={0}>
                {response}
              </Chat.TalkBubble>
            </div>
          </div>
        </section>
        <section className="flex-1">
          <PromptBubbleInfo
            duration={duration}
            prompt={preparedPrompt}
            prompt_template={promptTemplateName}
            templateString={template}
          />
        </section>
      </main>
    </Modal>
  );
}

export { SaveBookMarkModal };
