import { IconName } from '@/app/components/IconSVG';
import { useGetAllAttackModulesQuery } from '@/app/services/attack-modules-api-service';
import { SelectListItem } from '@/app/views/shared-components/selectListItem';
import tailwindConfig from '@/tailwind.config';
const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type AttackModuleSelectViewProps = {
  selectedAttack?: AttackModule;
  onAttackClick: (attack: AttackModule) => void;
  onSkipClick?: () => void;
};

function AttackModuleSelectView(props: AttackModuleSelectViewProps) {
  const { selectedAttack, onAttackClick } = props;
  const { data, isFetching } = useGetAllAttackModulesQuery();

  return (
    <div className="flex flex-col pt-4 gap-8 pb-4 h-[80%] items-center">
      <section className="flex flex-col items-center gap-3">
        <hgroup>
          <h2 className="text-[1.6rem] leading-[2rem] height-[2rem] font-medium tracking-wide text-white w-full text-center">
            Would you like to use any of these attack modules?
          </h2>
          <p className="text-[0.9rem] text-moongray-400 text-center">
            <span className="font-bold">Optional</span>&nbsp;modules that
            automatically generate prompts to red team an Endpoint.
          </p>
        </hgroup>
      </section>
      <div className="relative flex flex-col min-h-[300px] px-[10%] w-[100%] h-full items-center">
        {isFetching || !data ? (
          <div className="ring">
            Loading
            <span />
          </div>
        ) : (
          <>
            <ul
              className="flex flex-row flex-wrap gap-[2%] w-[100%] overflow-y-auto custom-scrollbar px-4"
              style={{ height: '100%' }}>
              {data.map((attack) => {
                const isSelected =
                  selectedAttack && selectedAttack.id === attack.id;
                const description = attack.description
                  ? attack.description
                      .split('Parameters:')[0]
                      .replace(/\n/g, '<br />')
                  : '';
                return (
                  <SelectListItem<AttackModule>
                    key={attack.id}
                    label={attack.name}
                    onClick={() => onAttackClick(attack)}
                    iconName={IconName.OutlineBox}
                    item={attack}
                    hideCheckbox
                    bgColor={isSelected ? colors.moonwine[950] : undefined}
                    style={{
                      alignItems: 'flex-start',
                      height: 180,
                      overflowY: 'hidden',
                    }}>
                    <p
                      className="text-[0.8rem] text-moongray-400"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </SelectListItem>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export { AttackModuleSelectView };
