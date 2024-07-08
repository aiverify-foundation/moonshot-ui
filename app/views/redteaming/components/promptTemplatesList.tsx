import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { useGetAllPromptTemplatesQuery } from '@/app/services/prompt-template-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { LoadingAnimation } from '@/app/views/shared-components/loadingAnimation';

type PromptTemplatesListProps = {
  onPrimaryBtnClick: (promptTemplate: PromptTemplate) => void;
  onSecondaryBtnClick?: () => void;
};

function PromptTemplatesList(props: PromptTemplatesListProps) {
  const { onPrimaryBtnClick, onSecondaryBtnClick } = props;
  const [selectedPromptTemplate, setSelectedPromptTemplate] = React.useState<
    PromptTemplate | undefined
  >();
  const { data, refetch, isLoading } = useGetAllPromptTemplatesQuery();

  React.useEffect(() => {
    refetch();
  }, []);

  let promptTemplateDetailsSection: React.ReactNode;

  if (selectedPromptTemplate) {
    const description = selectedPromptTemplate.description
      ? selectedPromptTemplate.description.replace(/\n/g, '<br /><br/>')
      : '';

    const template = selectedPromptTemplate.template
      ? selectedPromptTemplate.template.replace(/\n/g, '<br /><br/>')
      : '';

    promptTemplateDetailsSection = (
      <section className="p-4 pr-1 pb-1 bg-moongray-950 w-[480px]">
        <header className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <Icon name={IconName.MoonPromptTemplate} />
            <h3 className="text-[1rem] font-semibold text-white">
              {selectedPromptTemplate.name}
            </h3>
          </div>
        </header>
        <div
          style={{ height: 'calc(100% - 40px)' }}
          className="text-[0.85rem] overflow-y-auto custom-scrollbar text-moongray-200 mb-3">
          <p
            dangerouslySetInnerHTML={{ __html: description }}
            className="pr-2"
          />
          <h3>Template</h3>
          <p
            dangerouslySetInnerHTML={{ __html: template }}
            className="pr-2"
          />
        </div>
      </section>
    );
  }

  const listOfPromptTemplates = data ? (
    <ul className="divide-y divide-moongray-500 max-w-[400px] overflow-x-hidden overflow-y-auto custom-scrollbar h-full">
      {data.map((promptTemplate) => {
        const isSelected =
          selectedPromptTemplate &&
          selectedPromptTemplate.name === promptTemplate.name;
        const description = promptTemplate.description
          ? promptTemplate.description.replace(/\n/g, '<br /><br/>')
          : '';
        return (
          <li
            key={promptTemplate.name}
            className={`p-2 ${!isSelected && 'hover:bg-moongray-900'} active:bg-moongray-600 cursor-pointer 
            ${isSelected ? 'bg-moongray-950' : 'bg-moongray-700'}`}
            onClick={() => setSelectedPromptTemplate(promptTemplate)}
            style={{
              transition: 'background-color 0.2s ease-in-out',
            }}>
            <header className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Icon
                  name={IconName.MoonPromptTemplate}
                  size={18}
                />
                <h3 className="text-[0.87rem] text-white">
                  {promptTemplate.name}
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
              {listOfPromptTemplates}
              {promptTemplateDetailsSection}
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
              disabled={selectedPromptTemplate === undefined}
              mode={ButtonType.PRIMARY}
              onClick={() =>
                selectedPromptTemplate
                  ? onPrimaryBtnClick(selectedPromptTemplate)
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

export { PromptTemplatesList };
