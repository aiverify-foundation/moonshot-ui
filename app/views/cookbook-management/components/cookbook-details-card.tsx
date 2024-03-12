import { KeyValueDisplay } from '@/app/components/keyvalue-display';

type CookbookDetailsCardProps = {
  cookbook: Cookbook;
};

function CookbookDetailsCard(props: CookbookDetailsCardProps) {
  const { cookbook } = props;
  return (
    <div>
      <KeyValueDisplay
        label="Name"
        value={cookbook.name}
      />
      <KeyValueDisplay
        label="Description"
        value={cookbook.description}
      />
      <KeyValueDisplay
        label="Recipes"
        value={cookbook.recipes.map((rec) => rec).join(', ')}
      />
    </div>
  );
}

export { CookbookDetailsCard };
