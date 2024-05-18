import { Icon, IconName } from '@/app/components/IconSVG';
import { useGetAllAttackModulesQuery } from '@/app/services/attack-modules-api-service';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';
import React from 'react';

type AttackModulesListProps = {
  showPrimaryBtn?: boolean;
  showSecondaryBtn?: boolean;
  onPrimaryBtnClick?: (attackModule: AttackModule) => void;
  onSecondaryBtnClick?: () => void;
};

function AttackModulesList(props: AttackModulesListProps) {
  const {
    showPrimaryBtn,
    showSecondaryBtn,
    onPrimaryBtnClick,
    onSecondaryBtnClick,
  } = props;
  const [selectedAttackModule, setSelectedAttackModule] = React.useState<
    AttackModule | undefined
  >();
  const { data, isLoading } = useGetAllAttackModulesQuery();

  let attackModuleDetailsSection: React.ReactNode;

  if (selectedAttackModule) {
    const description = selectedAttackModule.description
      ? selectedAttackModule.description
          .split('Parameters:')[0]
          .replace(/\n/g, '<br />')
      : '';

    attackModuleDetailsSection = (
      <section>
        <header className="flex gap-2">
          <Icon name={IconName.MoonAttackStrategy} />
          <h3 className="text-[0.9rem] font-semibold text-white">
            {selectedAttackModule.name}
          </h3>
          <p>{description}</p>
        </header>
      </section>
    );
  }
  return (
    <div className="relative flex w-full h-full">
      {isLoading || !data ? (
        <LoadingAnimation />
      ) : (
        <>
          <main>
            <div className="flex grap-4">
              <ul>
                {data.map((attackModule) => (
                  <li key={attackModule.id}>
                    <header className="flex gap-2">
                      <Icon name={IconName.MoonAttackStrategy} />
                      <h3 className="text-[0.9rem] font-semibold text-white">
                        {attackModule.name}
                      </h3>
                    </header>
                  </li>
                ))}
              </ul>
              {attackModuleDetailsSection}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export { AttackModulesList };
