import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/customColors';
import { getEndpointsFromRequiredConfig } from '@/app/lib/getEndpointsFromRequiredConfig';

type ConfigureRequirementsItemCardProps = {
  cookbook: Cookbook;
  onConfigureModelClick?: () => void;
};

function ConfigureRequirementsItemCard(
  props: ConfigureRequirementsItemCardProps
) {
  const { cookbook, onConfigureModelClick } = props;
  const requiredEndpoints = getEndpointsFromRequiredConfig(
    cookbook.required_config
  );
  return (
    <figure className="flex border rounded-xl p-4 border-moongray-800 w-full">
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
            onClick={onConfigureModelClick}
          />
        </div>
        {requiredEndpoints.length > 0 ? (
          <p className="text-[0.9rem] leading-snug tracking-wide w-full ml-8 mt-8 text-moongray-400">
            <h3 className="font-bold">Requires</h3>
            <ul className="list-disc list-inside">
              {requiredEndpoints.map((endpoint) => (
                <li key={endpoint}>{endpoint}</li>
              ))}
            </ul>
          </p>
        ) : null}
      </div>
      <div className="w-[1px] h-full bg-moongray-800" />
      <div className="flex-1 pl-4">
        <div className="flex items-center gap-2 w-full">
          <h4 className=" text-white">Connect evaluator models</h4>
          <Icon
            name={IconName.Alert}
            color={colors.moonpurplelight}
          />
        </div>
      </div>
    </figure>
  );
}

export { ConfigureRequirementsItemCard };
