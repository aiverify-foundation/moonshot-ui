import { KeyValueDisplay } from '@/app/components/keyvalue-display';

type RecipeDetailsCardProps = {
  recipe: Recipe;
};

function RecipeDetailsCard(props: RecipeDetailsCardProps) {
  const { recipe } = props;
  return (
    <div>
      <KeyValueDisplay
        label="Id"
        value={recipe.id}
      />
      <KeyValueDisplay
        label="Name"
        value={recipe.name}
      />
      <KeyValueDisplay
        label="Tags"
        value={recipe.tags.map((dt) => dt).join(', ')}
      />
      <KeyValueDisplay
        label="Description"
        value={recipe.description}
      />
      <KeyValueDisplay
        label="Datasets"
        value={recipe.datasets.map((dt) => dt).join(', ')}
      />
      <KeyValueDisplay
        label="Prompt Templates"
        value={recipe.prompt_templates.map((dt) => dt).join(', ')}
      />
      <KeyValueDisplay
        label="Metrics"
        value={recipe.metrics.map((dt) => dt).join(', ')}
      />
    </div>
  );
}

export { RecipeDetailsCard };
