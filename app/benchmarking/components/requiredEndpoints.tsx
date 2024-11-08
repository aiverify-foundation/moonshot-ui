import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/customColors';

type RequiredEndpointsProps = {
  requiredEndpoints: string[];
};

export function RequiredEndpoints(props: RequiredEndpointsProps) {
  const { requiredEndpoints } = props;
  return (
    <figure className="border border-white rounded-lg pt-3 pb-4 pl-4 pr-2 mt-12 min-w-[400px]">
      <div className="flex gap-2">
        <Icon
          name={IconName.OutlineBox}
          color={colors.moonpurplelight}
          size={24}
        />
        <h3 className="text-[1rem] font-medium tracking-wide justify-center text-moonpurplelight">
          This benchmark requires the following:
        </h3>
      </div>
      <figcaption className="mt-4">
        <ul className="text-white max-h-[100px] overflow-y-auto custom-scrollbar list-disc pl-4">
          {requiredEndpoints.map((endpoint) => (
            <li
              key={endpoint}
              className="text-[0.9rem] pl-1">
              {endpoint}
            </li>
          ))}
        </ul>
        <p className="text-moonpurplelight mt-4">
          Please input the token for the endpoint(s) before running.
        </p>
      </figcaption>
    </figure>
  );
}
