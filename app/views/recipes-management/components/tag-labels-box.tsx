import { IconName } from '@/app/components/IconSVG';
import { TagLabel } from '@/app/components/tag-label';

type TagLabelsBoxProps = {
  recipes: Recipe[];
  onTaglabelIconClick: (name: string) => () => void;
};

const TaglabelsBox = ({
  recipes,
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
        {recipes.map((recipe) => (
          <TagLabel
            key={recipe.name}
            className="bg-slate-400 border dark:bg-sky-70"
            iconName={IconName.Close}
            text={recipe.name}
            onIconClick={onTaglabelIconClick(recipe.name)}
          />
        ))}
      </div>
    </div>
  );
};

export { TaglabelsBox };
