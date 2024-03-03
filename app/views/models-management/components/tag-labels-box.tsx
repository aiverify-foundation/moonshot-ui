import { IconName } from '@/app/components/IconSVG';
import { TagLabel } from '@/app/components/tag-label';

type TagLabelsBoxProps = {
  models: LLMEndpoint[];
  onTaglabelIconClick: (name: string) => () => void;
};

const TaglabelsBox = ({ models, onTaglabelIconClick }: TagLabelsBoxProps) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="flex h-7 p-1 w-full text-white
    text-md font-bold items-center px-4">
        Selected Models
      </div>
      <div className="p-6 flex flex-wrap gap-3 content-start">
        {models.map((model) => (
          <TagLabel
            key={model.name}
            className="bg-slate-400 border dark:bg-sky-70"
            iconName={IconName.Close}
            text={model.name}
            onIconClick={onTaglabelIconClick(model.name)}
          />
        ))}
      </div>
    </div>
  );
};

export { TaglabelsBox };
