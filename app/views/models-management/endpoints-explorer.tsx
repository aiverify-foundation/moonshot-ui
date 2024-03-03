import { useEffect, useState } from 'react';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { LLMDetailsCard } from './components/llm-details-card';
import { LLMItemCard } from './components/llm-item-card';
import { ButtonAction, TopButtonsBar } from './components/top-buttons-bar';
import useLLMEndpointList from '@views/moonshot-desktop/hooks/useLLMEndpointList';
import { TagLabel } from '@/app/components/tag-label';
import { IconName } from '@/app/components/IconSVG';

type EndpointsExplorerProps = {
  windowId: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
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

function EndpointsExplorer(props: EndpointsExplorerProps) {
  const {
    windowId,
    onCloseClick,
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    onWindowChange,
  } = props;
  const { llmEndpoints, error, isLoading } = useLLMEndpointList();
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    LLMEndpoint | undefined
  >();
  const [selectedBtnAction, setSelectedBtnAction] = useState<ButtonAction>(
    ButtonAction.VIEW_MODELS
  );
  const [selectedModels, setSelectedModels] = useState<LLMEndpoint[]>([]);

  const isTwoPanel =
    selectedBtnAction === ButtonAction.SELECT_MODELS ||
    (selectedBtnAction === ButtonAction.VIEW_MODELS && selectedEndpoint);

  const footerText = llmEndpoints.length
    ? `${llmEndpoints.length} Endpoint${llmEndpoints.length > 1 ? 's' : ''}`
    : '';

  function selectItem(name: string) {
    const endpoint = llmEndpoints.find((epoint) => epoint.name === name);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
    }
  }

  function handleListItemClick(name: string) {
    return () => {
      if (selectedBtnAction === ButtonAction.VIEW_MODELS) {
        selectItem(name);
      } else if (selectedBtnAction === ButtonAction.SELECT_MODELS) {
        const clickedEndpoint = llmEndpoints.find(
          (epoint) => epoint.name === name
        );
        if (!clickedEndpoint) return;

        if (selectedModels.findIndex((epoint) => epoint.name === name) > -1) {
          setSelectedModels((prev) =>
            prev.filter((epoint) => epoint.name !== clickedEndpoint.name)
          );
        } else {
          setSelectedModels((prev) => [...prev, clickedEndpoint]);
        }
      }
    };
  }

  function handleListItemHover(name: string) {
    return () => selectItem(name);
  }

  function handleButtonClick(action: ButtonAction) {
    setSelectedBtnAction(action);
  }

  useEffect(() => {
    setSelectedEndpoint(undefined);
  }, [selectedBtnAction]);

  return isLoading ? null : (
    <Window
      id={windowId}
      resizeable={false}
      initialXY={initialXY}
      zIndex={zIndex}
      initialWindowSize={initialSize}
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      name="My Models"
      leftFooterText={footerText}
      footerHeight={30}
      topPanel={
        <TopButtonsBar
          onButtonClick={handleButtonClick}
          activeButton={selectedBtnAction}
        />
      }>
      {isTwoPanel ? (
        <TwoPanel>
          <WindowList>
            {llmEndpoints
              ? llmEndpoints.map((endpoint) => (
                  <WindowList.Item
                    key={endpoint.name}
                    id={endpoint.name}
                    enableCheckbox={
                      selectedBtnAction === ButtonAction.SELECT_MODELS
                    }
                    checked={
                      selectedModels.findIndex(
                        (epoint) => epoint.name === endpoint.name
                      ) > -1
                    }
                    onClick={handleListItemClick(endpoint.name)}
                    onHover={
                      selectedBtnAction === ButtonAction.SELECT_MODELS
                        ? handleListItemHover(endpoint.name)
                        : undefined
                    }
                    selected={
                      selectedEndpoint
                        ? selectedEndpoint.name === endpoint.name
                        : false
                    }>
                    <LLMItemCard endpoint={endpoint} />
                  </WindowList.Item>
                ))
              : null}
          </WindowList>
          <div className="flex flex-col">
            <WindowInfoPanel title="Model Details">
              <div className="h-full bg-gray-100">
                {selectedEndpoint ? (
                  <div className="flex flex-col gap-6">
                    <LLMDetailsCard endpoint={selectedEndpoint} />
                  </div>
                ) : null}
              </div>
            </WindowInfoPanel>
            <div className="flex flex-wrap gap-3 ">
              {selectedModels.map((model) => (
                <TagLabel
                  key={model.name}
                  className="bg-fuchsia-900/80 dark:bg-sky-70"
                  iconName={IconName.Close}
                  text={model.name}
                />
                // <div
                //   key={model.name}
                //   className=" bg-fuchsia-700 text-white">
                //   {model.name}
                // </div>
              ))}
            </div>
          </div>
        </TwoPanel>
      ) : (
        <WindowList>
          {llmEndpoints
            ? llmEndpoints.map((endpoint) => (
                <WindowList.Item
                  key={endpoint.name}
                  id={endpoint.name}
                  onClick={handleListItemClick(endpoint.name)}>
                  <LLMItemCard endpoint={endpoint} />
                </WindowList.Item>
              ))
            : null}
        </WindowList>
      )}
    </Window>
  );
}

export { EndpointsExplorer };
