import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { useGetAllContextStrategiesQuery } from '@/app/services/contextstrat-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';

type ContextStrategiesListProps = {
  onPrimaryBtnClick: (contextStrategyId: string) => void;
  onSecondaryBtnClick?: () => void;
};

function ContextStrategiesList(props: ContextStrategiesListProps) {
  const { onPrimaryBtnClick, onSecondaryBtnClick } = props;
  const [selectedContextStrategy, setSelectedContextStrategy] = React.useState<
    ContextStrategy | undefined
  >();
  const { data, isFetching } = useGetAllContextStrategiesQuery();

  let contextStrategyDescription: React.ReactNode;

  if (selectedContextStrategy) {
    contextStrategyDescription = (
      <section className="p-4 pr-1 pb-1 bg-moongray-950 w-[480px]">
        <header className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <Icon name={IconName.MoonContextStrategy} />
            <h3 className="text-[1rem] font-semibold text-white">
              {selectedContextStrategy.name}
            </h3>
          </div>
        </header>
        <div
          style={{ height: 'calc(100% - 40px)' }}
          className="text-[0.85rem] overflow-y-auto custom-scrollbar text-moongray-200 mb-3">
          <p className="pr-2">{selectedContextStrategy.description}</p>
        </div>
      </section>
    );
  }

  const listOfContextStrategies = data ? (
    <ul className="divide-y divide-moongray-500 max-w-[400px] overflow-x-hidden overflow-y-auto custom-scrollbar h-full">
      {data.map((contextStrategy) => {
        const isSelected = selectedContextStrategy && selectedContextStrategy.id === contextStrategy.id;
        return (
          <li
            key={contextStrategy.id}
            className={`p-2 ${!isSelected && 'hover:bg-moongray-900'} active:bg-moongray-600 cursor-pointer 
            ${isSelected ? 'bg-moongray-950' : 'bg-moongray-700'} min-w-[300px]`}
            onClick={() => setSelectedContextStrategy(contextStrategy)}
            style={{
              transition: 'background-color 0.2s ease-in-out',
            }}>
            <header className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Icon
                  name={IconName.MoonContextStrategy}
                  size={18}
                />
                <h3 className="text-[0.87rem] text-white">{contextStrategy.name}</h3>
              </div>
              <p className="text-sm h-[80px] min-h-[80px] overflow-y-hidden text-[0.74rem] text-moongray-200">
                {contextStrategy.description}
              </p>
            </header>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div className="relative flex flex-col w-full h-full gap-4">
      {isFetching || !data ? (
        <LoadingAnimation />
      ) : (
        <>
          <main
            className="h-full"
            style={{ height: 'calc(100% - 70px)' }}>
            <div className="flex gap-4 h-full">
              {listOfContextStrategies}
              {contextStrategyDescription}
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
              disabled={selectedContextStrategy === undefined}
              mode={ButtonType.PRIMARY}
              onClick={() =>
                selectedContextStrategy
                  ? onPrimaryBtnClick(selectedContextStrategy.id)
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

export { ContextStrategiesList };
