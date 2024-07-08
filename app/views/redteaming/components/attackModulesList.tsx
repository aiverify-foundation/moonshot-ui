import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { useGetAllAttackModulesQuery } from '@/app/services/attack-modules-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';

type AttackModulesListProps = {
  onPrimaryBtnClick: (attackModule: AttackModule) => void;
  onSecondaryBtnClick?: () => void;
};

function AttackModulesList(props: AttackModulesListProps) {
  const { onPrimaryBtnClick, onSecondaryBtnClick } = props;
  const [selectedAttackModule, setSelectedAttackModule] = React.useState<
    AttackModule | undefined
  >();
  const { data, refetch, isLoading } = useGetAllAttackModulesQuery();

  React.useEffect(() => {
    refetch();
  }, []);

  let attackModuleDetailsSection: React.ReactNode;

  if (selectedAttackModule) {
    const description = selectedAttackModule.description
      ? selectedAttackModule.description.replace(/\n/g, '<br /><br/>')
      : '';

    attackModuleDetailsSection = (
      <section className="p-2 bg-moongray-950 w-[480px]">
        <header className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <Icon name={IconName.MoonAttackStrategy} />
            <h3 className="text-[1rem] font-semibold text-white">
              {selectedAttackModule.name}
            </h3>
          </div>
        </header>
        <p
          dangerouslySetInnerHTML={{ __html: description }}
          className="text-[0.85rem] overflow-y-auto custom-scrollbar h-full text-moongray-200"
          style={{ height: 'calc(100% - 40px)' }}
        />
      </section>
    );
  }

  const listOfModules = data ? (
    <ul className="divide-y divide-moongray-500 max-w-[400px] overflow-x-hidden overflow-y-auto custom-scrollbar h-full">
      {data.map((attackModule) => {
        const isSelected =
          selectedAttackModule && selectedAttackModule.id === attackModule.id;
        const description = attackModule.description
          ? attackModule.description
              .split('Parameters:')[0]
              .replace(/\n/g, '<br />')
          : '';
        return (
          <li
            key={attackModule.id}
            className={`p-2 ${!isSelected && 'hover:bg-moongray-900'} active:bg-moongray-600 cursor-pointer 
            ${isSelected ? 'bg-moongray-950' : 'bg-moongray-700'}`}
            onClick={() => setSelectedAttackModule(attackModule)}
            style={{
              transition: 'background-color 0.2s ease-in-out',
            }}>
            <header className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Icon name={IconName.MoonAttackStrategy} />
                <h3 className="text-[0.87rem] text-white">
                  {attackModule.name}
                </h3>
              </div>
              <p
                className="text-sm h-[80px] min-h-[80px] overflow-y-hidden text-[0.74rem] text-moongray-200"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </header>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div className="relative flex flex-col w-full h-full gap-4">
      {isLoading || !data ? (
        <LoadingAnimation />
      ) : (
        <>
          <main
            className="h-full"
            style={{ height: 'calc(100% - 70px)' }}>
            <div className="flex gap-4 h-full">
              {listOfModules}
              {attackModuleDetailsSection}
            </div>
          </main>
          <footer className="flex justify-end gap-2">
            <Button
              mode={ButtonType.OUTLINE}
              onClick={onSecondaryBtnClick}
              text="Cancel"
              hoverBtnColor={colors.moongray[700]}
              pressedBtnColor={colors.moongray[800]}
            />
            <Button
              disabled={selectedAttackModule === undefined}
              mode={ButtonType.PRIMARY}
              onClick={() =>
                selectedAttackModule
                  ? onPrimaryBtnClick(selectedAttackModule)
                  : null
              }
              text="Use"
              hoverBtnColor={colors.moongray[950]}
            />
          </footer>
        </>
      )}
    </div>
  );
}

export { AttackModulesList };
