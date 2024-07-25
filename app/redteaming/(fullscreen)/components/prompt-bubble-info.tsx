import { useAppSelector } from '@/lib/redux';
import { ColorCodedTemplateString } from './color-coded-template';

type PromptBubbleInfoProps = Partial<DialoguePairInfo> & {
  templateString?: string;
};

function PromptBubbleInfo(props: PromptBubbleInfoProps) {
  const { duration, prompt_template, templateString } = props;
  const durationInSeconds = duration !== undefined ? parseFloat(duration) : 0;
  const isDarkMode = useAppSelector((state) => state.darkMode.value);
  return (
    <div className="w-full p-2">
      <h3 className="mb-1 underline text-stone-50">Prompt Details</h3>
      <div>
        <span className="text-sky-400 pr-1">Response Time Taken (secs):</span>
        <span className="text-white">
          {duration !== undefined ? durationInSeconds.toFixed(4) : ''}
        </span>
      </div>
      <div>
        <span className="text-sky-400 pr-1">Template Name:</span>
        <span className="text-white">{prompt_template || 'No Template'}</span>
      </div>
      {templateString ? (
        <div className="text-stone-50 dark:text-sky-400 mb-1 mt-2 underline">
          Template String
        </div>
      ) : null}
      {templateString ? (
        <div className="max-h-[200px] custom-scrollbar overflow-y-auto">
          <ColorCodedTemplateString
            fontColor={isDarkMode ? '#cffafe' : '#ffffff'}
            placeHolderColor={isDarkMode ? '#f87171' : '#ef4444'}
            template={templateString}
          />
        </div>
      ) : null}
    </div>
  );
}

export { PromptBubbleInfo };
