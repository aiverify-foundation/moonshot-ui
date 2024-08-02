import React from 'react';
import { useFormState } from 'react-dom';
import { createBookmark } from '@/actions/createBookmark';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { Chat } from '@/app/components/chat';
import { Modal } from '@/app/components/modal';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/customColors';
import { PromptBubbleInfo } from './prompt-bubble-info';
import { SubmitButton } from './submitButton';

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
  onPrimaryBtnClick: () => void;
};

const initialFormValues: FormState<BookmarkFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  name: '',
  prompt_template: '',
  prepared_prompt: '',
  response: '',
  metric: undefined,
  attack_module: undefined,
  context_strategy: undefined,
};

function SaveBookMarkModal(props: SaveBookMarkModalProps) {
  const {
    duration,
    prompt,
    preparedPrompt,
    promptTemplateName,
    template,
    response,
    metric,
    attackModule,
    contextStrategy,
    onCloseIconClick,
    onPrimaryBtnClick,
  } = props;
  const [bookmarkName, setBookmarkName] = React.useState('');
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [formState, action] = useFormState<
    FormState<BookmarkFormValues>,
    FormData
  >(createBookmark, initialFormValues);

  React.useEffect(() => {
    if (formState.formStatus === 'error') {
      setShowErrorModal(true);
      return;
    }
    if (formState.formStatus === 'success') {
      setShowResultModal(true);
      setBookmarkName('');
    }
  }, [formState]);

  function handleBookmarkNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBookmarkName(e.target.value);
  }

  return (
    <>
      {showResultModal ? (
        <Modal
          heading="Bookmark Saved"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="View Bookmarks"
          enableScreenOverlay
          overlayOpacity={0.8}
          onCloseIconClick={onCloseIconClick}
          onPrimaryBtnClick={onPrimaryBtnClick}>
          <div className="flex gap-2 items-start">
            <p>{`Bookmark ${formState.name} was successfully saved.`}</p>
          </div>
        </Modal>
      ) : null}
      {showErrorModal ? (
        <Modal
          heading="Errors"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Close"
          enableScreenOverlay
          overlayOpacity={0.8}
          onCloseIconClick={() => setShowErrorModal(false)}
          onPrimaryBtnClick={() => setShowErrorModal(false)}>
          <div className="flex gap-2 items-start">
            <Icon
              name={IconName.Alert}
              size={40}
              color="red"
            />
            {formState.formErrors ? (
              <ul>
                {Object.entries(formState.formErrors).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.join(', ')}
                  </li>
                ))}
              </ul>
            ) : (
              'An unknown error occurred'
            )}
          </div>
        </Modal>
      ) : null}
      {showResultModal || showErrorModal ? null : (
        <Modal
          width={900}
          height={640}
          heading="Save New Bookmark"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          enableScreenOverlay={true}
          overlayOpacity={0.8}
          onCloseIconClick={onCloseIconClick}>
          <p className="mb-8 text-[0.95rem]">
            Save this prompt as a bookmark to be able to quickly reference it in
            future red teaming exercises.
          </p>
          <div className="flex gap-4 h-[300px]">
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
          </div>
          <form
            action={action}
            className="absolute bottom-0 left-0 flex
          flex-col gap-2 p-7 w-full mt-4">
            <div className="border-t border-moongray-500 w-[98%] mb-2" />
            <div className="w-[380px]">
              <TextInput
                id="bookmarkName"
                name="name"
                label="Name *"
                labelStyles={{
                  fontSize: '0.9rem',
                  color: colors.moonpurplelight,
                }}
                inputStyles={{ height: 38 }}
                placeholder="Give this bookmark a unique name"
                value={bookmarkName}
                onChange={handleBookmarkNameChange}
                error={formState.formErrors?.name?.[0]}
              />
            </div>
            <input
              type="hidden"
              name="prompt"
              value={prompt}
            />
            <input
              type="hidden"
              name="prompt_template"
              value={template}
            />
            <input
              type="hidden"
              name="prepared_prompt"
              value={preparedPrompt}
            />
            <input
              type="hidden"
              name="response"
              value={response}
            />
            <input
              type="hidden"
              name="metric"
              value={metric}
            />
            <input
              type="hidden"
              name="attack_module"
              value={attackModule}
            />
            <input
              type="hidden"
              name="context_strategy"
              value={contextStrategy}
            />
            <div className="flex gap-4 justify-end">
              <Button
                mode={ButtonType.OUTLINE}
                size="lg"
                width={120}
                text="Cancel"
                hoverBtnColor={colors.moongray[700]}
                pressedBtnColor={colors.moongray[800]}
                onClick={onCloseIconClick}
              />
              <SubmitButton disabled={bookmarkName === ''} />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export { SaveBookMarkModal };
