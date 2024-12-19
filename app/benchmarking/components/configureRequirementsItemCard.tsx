import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { Tooltip, TooltipPosition } from '@/app/components/tooltip';
import { colors } from '@/app/customColors';
import { cn } from '@/app/lib/cn';

type ConfigureRequirementsItemCardProps = {
  cookbook: Cookbook;
  requiredEndpoints: LLMEndpoint[];
  onConfigureEndpointClick: (endpoint: LLMEndpoint) => void;
  onAboutClick: (cookbook: Cookbook) => void;
};

type ConfigureEndpointCardProps = {
  endpoint: LLMEndpoint;
  onConfigureClick: (endpoint: LLMEndpoint) => void;
  className?: string;
};

function ConfigureEndpointCard(props: ConfigureEndpointCardProps) {
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

function ConfigureRequirementsItemCard(
  props: ConfigureRequirementsItemCardProps
) {
  const {
    cookbook,
    requiredEndpoints,
    onConfigureEndpointClick,
    onAboutClick,
  } = props;

  const leftSection = (
    <div className="flex flex-col gap-2 flex-1 pr-4">
      <div className="flex items-start gap-2">
        <Icon
          name={IconName.Book}
          style={{ marginTop: '4px' }}
        />
        <h2 className="text-[1.1rem] leading-snug tracking-wide text-white w-full">
          {cookbook.name}
        </h2>
        <Button
          mode={ButtonType.LINK}
          size="lg"
          text="About"
          onClick={() => onAboutClick(cookbook)}
        />
      </div>
      {requiredEndpoints.length > 0 ? (
        <p className="text-[0.9rem] leading-snug tracking-wide w-full ml-8 mt-8 text-moongray-400">
          <h3 className="font-bold">Requires</h3>
          <ul className="list-disc list-inside">
            {requiredEndpoints.map((endpoint) => (
              <li key={endpoint.id}>{endpoint.name}</li>
            ))}
          </ul>
        </p>
      ) : null}
    </div>
  );

  const connectModelsSection =
    requiredEndpoints.length > 0 ? (
      <div className="flex-1 pl-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 w-full">
          <h4 className=" text-white">Connect evaluator models</h4>
          <Tooltip
            content="This recipe requires connection to evaluator models to help score the tests. You will need to provide the API access tokens or set up an alternative evaluator model."
            position={TooltipPosition.right}
            offsetLeft={10}>
            <Icon
              name={IconName.Alert}
              color={colors.moonpurplelight}
            />
          </Tooltip>
        </div>
        <p className="text-moongray-400">
          Ensure that Moonshot has access to these endpoints.
        </p>
        {requiredEndpoints.map((endpoint) => (
          <ConfigureEndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            onConfigureClick={onConfigureEndpointClick}
          />
        ))}
      </div>
    ) : null;

  const rightSection = connectModelsSection;

  return (
    <figure className="flex border rounded-xl p-4 border-moongray-800 w-full">
      {leftSection}
      <div className="w-[1px] h-full bg-moongray-800" />
      {rightSection}
    </figure>
  );
}

export { ConfigureRequirementsItemCard };
