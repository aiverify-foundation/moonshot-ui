import { Icon, IconName } from '@/app/components/IconSVG';

type ConfigureRequirementsItemCardProps = {
  cookbook: Cookbook;
  requirements: string[];
  onConfigureModelClick?: () => void;
};

function ConfigureRequirementsItemCard(
  props: ConfigureRequirementsItemCardProps
) {
  const { cookbook, requirements, onConfigureModelClick } = props;
  return (
    <figure className="flex">
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Icon name={IconName.Book} />
            <h2 className="text-[1.6rem] leading-[2rem] tracking-wide text-white w-full text-center">
              {cookbook.name}
            </h2>
          </div>
        </div>
      </div>
    </figure>
  );
}

export { ConfigureRequirementsItemCard };
