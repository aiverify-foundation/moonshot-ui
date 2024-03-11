import { Icon, IconName } from '@/app/components/IconSVG';

type RecipeItemCardProps = {
  recipe: Recipe;
};

function RecipeItemCard(props: RecipeItemCardProps) {
  const { recipe } = props;
  return (
    <div className="flex flex-col items-start py-2">
      <div className="flex items-center gap-2 pb-2">
        <Icon
          name={IconName.SolidBox}
          size={16}
          lightModeColor="#475569"
          darkModeColor="#475569"
        />
        <div className="font-bold">{recipe.name}</div>
      </div>
      <div className="flex items-start gap-2">
        <div className="font-medium">Type:</div>
        <div>{recipe.description}</div>
      </div>
    </div>
  );
}

export { RecipeItemCard };
