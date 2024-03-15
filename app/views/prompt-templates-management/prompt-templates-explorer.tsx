import { useEffect, useState } from 'react';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { TemplateDetailsCard } from './components/template-details-card';
import { TemplateItemCard } from './components/template-item-card';
import {
  PromptTemplatesExplorerButtonAction,
  TopButtonsBar,
} from './components/top-buttons-bar';
import usePromptTemplateList from '@views/moonshot-desktop/hooks/usePromptTemplateList';

type PromptTemplatesExplorerProps = {
  windowId: string;
  mini?: boolean;
  templates?: PromptTemplate[];
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
  hideMenuButtons?: boolean;
  buttonAction?: PromptTemplatesExplorerButtonAction;
  onListItemClick?: (template: PromptTemplate) => void;
  onCloseClick: () => void;
  onWindowChange?: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
};

function getWindowSubTitle(
  selectedBtnAction: PromptTemplatesExplorerButtonAction
) {
  switch (selectedBtnAction) {
    case PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES:
      return `Recipes`;
  }
}

function PromptTemplatesExplorer(props: PromptTemplatesExplorerProps) {
  const {
    windowId,
    title,
    mini = false,
    hideMenuButtons = false,
    buttonAction = PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES,
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    onCloseClick,
    onListItemClick,
    onWindowChange,
  } = props;
  const {
    promptTemplates: templates,
    error,
    isLoading,
    refetch,
  } = usePromptTemplateList();
  const [selectedBtnAction, setSelectedBtnAction] =
    useState<PromptTemplatesExplorerButtonAction>(
      PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES
    );
  const [selectedTemplate, setSelectedTemplate] = useState<
    PromptTemplate | undefined
  >();
  const [displayedTemplateList, setDisplayedTemplateList] = useState<
    PromptTemplate[]
  >([]);

  const isTwoPanel =
    !mini &&
    selectedBtnAction === PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES &&
    selectedTemplate;

  const initialDividerPosition = 40;

  const footerText = templates.length
    ? `${templates.length} Prompt Template${templates.length > 1 ? 's' : ''}`
    : '';

  const miniFooterText = `${templates.length - displayedTemplateList.length} / ${footerText} Selected`;

  const windowTitle = title || getWindowSubTitle(selectedBtnAction);

  function selectItem(name: string) {
    const template = templates.find((tp) => tp.name === name);
    if (template) {
      setSelectedTemplate(template);
    }
  }

  function handleListItemClick(name: string) {
    return () => {
      if (
        selectedBtnAction === PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES
      ) {
        selectItem(name);
      }
    };
  }

  function handleListItemHover(name: string) {
    return () => selectItem(name);
  }

  function handleButtonClick(action: PromptTemplatesExplorerButtonAction) {
    setSelectedBtnAction(action);
  }

  function sortDisplayedrecipesByName(
    list: PromptTemplate[]
  ): PromptTemplate[] {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  useEffect(() => {
    if (!isLoading && templates) {
      setDisplayedTemplateList(sortDisplayedrecipesByName(templates));
    }
  }, [isLoading, templates]);

  useEffect(() => {
    if (buttonAction && hideMenuButtons) {
      setSelectedBtnAction(buttonAction);
    }
  }, [buttonAction, hideMenuButtons]);

  return isLoading ? null : (
    <Window
      id={windowId}
      resizeable={true}
      initialXY={initialXY}
      zIndex={zIndex}
      initialWindowSize={initialSize}
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      name={windowTitle}
      leftFooterText={mini ? miniFooterText : footerText}
      footerHeight={30}
      contentAreaStyles={{ backgroundColor: 'transparent' }}
      topBar={
        hideMenuButtons ? null : (
          <TopButtonsBar
            onButtonClick={handleButtonClick}
            activeButton={selectedBtnAction}
          />
        )
      }>
      {isTwoPanel ? (
        <TwoPanel initialDividerPosition={initialDividerPosition}>
          <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
            {displayedTemplateList
              ? displayedTemplateList.map((template) => (
                  <WindowList.Item
                    key={template.name}
                    id={template.name}
                    className="justify-start"
                    onClick={handleListItemClick(template.name)}
                    selected={
                      selectedTemplate
                        ? selectedTemplate.name === template.name
                        : false
                    }>
                    <TemplateItemCard template={template} />
                  </WindowList.Item>
                ))
              : null}
          </WindowList>
          {selectedBtnAction ===
          PromptTemplatesExplorerButtonAction.VIEW_TEMPLATES ? (
            <div className="flex flex-col h-full">
              <div className="h-full bg-white">
                <WindowInfoPanel title="PromptTemplate Details">
                  <div className="h-full">
                    {selectedTemplate ? (
                      <div className="flex flex-col gap-6">
                        <TemplateDetailsCard template={selectedTemplate} />
                      </div>
                    ) : null}
                  </div>
                </WindowInfoPanel>
              </div>
            </div>
          ) : null}
        </TwoPanel>
      ) : (
        <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
          {displayedTemplateList
            ? displayedTemplateList.map((template) => (
                <WindowList.Item
                  key={template.name}
                  id={template.name}
                  onClick={handleListItemClick(template.name)}>
                  <TemplateItemCard template={template} />
                </WindowList.Item>
              ))
            : null}
        </WindowList>
      )}
    </Window>
  );
}

export { PromptTemplatesExplorer };
