import { IconName } from '@/app/components/IconSVG';
import { Icon } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/customColors';
import { cn } from '@/app/lib/cn';

type ConfigureEndpointSmallCardProps = {
  endpoint: LLMEndpoint;
  onConfigureClick: (endpoint: LLMEndpoint) => void;
  className?: string;
};

function ConfigureEndpointSmallCard(props: ConfigureEndpointSmallCardProps) {
  const { endpoint, onConfigureClick, className } = props;
  function handleConfigureClick() {
    onConfigureClick(endpoint);
  }
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border rounded-xl p-4 border-moongray-800 w-full',
        className
      )}>
      <div className="flex gap-2">
        <Icon name={IconName.OutlineBox} />
        <h3 className="text-[1.1rem] text-white capitalize">{endpoint.name}</h3>
      </div>
      <Button
        mode={ButtonType.OUTLINE}
        hoverBtnColor={colors.moongray[700]}
        pressedBtnColor={colors.moongray[900]}
        size="sm"
        text="Configure"
        leftIconName={IconName.Pencil}
        onClick={handleConfigureClick}
      />
    </div>
  );
}

export { ConfigureEndpointSmallCard };
