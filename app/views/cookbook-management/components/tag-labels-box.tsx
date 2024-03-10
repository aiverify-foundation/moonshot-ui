import { IconName } from '@/app/components/IconSVG';
import { TagLabel } from '@/app/components/tag-label';

type TagLabelsBoxProps = {
  cookbooks: Cookbook[];
  onTaglabelIconClick: (name: string) => () => void;
};

const TaglabelsBox = ({
  cookbooks,
  onTaglabelIconClick,
}: TagLabelsBoxProps) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="flex h-7 p-1 w-full text-white
    text-md font-bold items-center px-4">
        Selected cookbooks
      </div>
      <div className="p-6 flex flex-wrap gap-3 content-start">
        {cookbooks.map((cookbook) => (
          <TagLabel
            key={cookbook.name}
            className="bg-slate-400 border dark:bg-sky-70"
            iconName={IconName.Close}
            text={cookbook.name}
            onIconClick={onTaglabelIconClick(cookbook.name)}
          />
        ))}
      </div>
    </div>
  );
};

export { TaglabelsBox };
