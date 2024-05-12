import { Icon, IconName } from '@/app/components/IconSVG';

type RecipeItemCardProps = {
  recipe: Recipe;
  className?: string;
};

function RecipeItemCard(props: RecipeItemCardProps) {
  const { recipe, className } = props;
  return (
    <div className={`flex flex-col items-start py-2 ${className}`}>
      <div className="flex items-center gap-2 pb-2">
        <Icon
          name={IconName.File}
          size={16}
          color="#475569"
        />
        <div className="font-bold">{recipe.name}</div>
      </div>
      <div className="flex items-start gap-2 w-full">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-4">
          {recipe.description}
        </div>
      </div>
    </div>
  );
}

export { RecipeItemCard };
