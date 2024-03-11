import { Icon, IconName } from '@/app/components/IconSVG';

type CookbookItemCardProps = {
  cookbook: Cookbook;
};

function CookbookItemCard(props: CookbookItemCardProps) {
  const { cookbook } = props;
  return (
    <div className="flex flex-col items-start py-2 w-full">
      <div className="flex items-center gap-2 pb-2">
        <Icon
          name={IconName.Book}
          size={16}
          lightModeColor="#475569"
          darkModeColor="#475569"
        />
        <div className="font-bold">{cookbook.name}</div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-4">
          {cookbook.description}
        </div>
      </div>
    </div>
  );
}

export { CookbookItemCard };
