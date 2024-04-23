import { IconName } from '@/app/components/IconSVG';
import { TagLabel } from '@/app/components/tag-label';

type TaglabelsBoxProps = {
  tags: string[];
  onTagRemove: (tag: string) => void;
};

const TaglabelsBox = ({ tags, onTagRemove }: TaglabelsBoxProps) => {
  return (
    <div className="h-30 w-full flex flex-col">
      <div className="flex h-7 p-1 w-full text-white text-md font-bold items-center px-4">
        Added Tags
      </div>
      <div className="p-6 flex flex-wrap gap-3 content-start">
        {tags.map((tag) => (
          <TagLabel
            key={tag}
            className="bg-slate-400 border dark:bg-sky-70"
            iconName={IconName.Close}
            text={tag}
            onIconClick={() => onTagRemove(tag)}
          />
        ))}
      </div>
    </div>
  );
};

export { TaglabelsBox };
