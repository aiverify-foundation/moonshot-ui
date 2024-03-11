import { KeyValueDisplay } from '@/app/components/keyvalue-display';

type RecipeDetailsCardProps = {
  recipe: Recipe;
};

function RecipeDetailsCard(props: RecipeDetailsCardProps) {
  const { recipe } = props;
  return (
    <div>
      <KeyValueDisplay
        label="Endpoint Name"
        value={recipe.name}
      />
    </div>
  );
}

export { RecipeDetailsCard };
