import { useEffect, useState } from 'react';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { useCreateLLMEndpointMutation } from '@/app/services/llm-endpoint-api-service';
import { LLMDetailsCard } from './components/llm-details-card';
import { LLMItemCard } from './components/llm-item-card';
import {
  LLMEndpointFormValues,
  NewModelEndpointForm,
} from './components/new-endpoint-form';
import { TaglabelsBox } from './components/tag-labels-box';
import { ButtonAction, TopButtonsBar } from './components/top-buttons-bar';
import useLLMEndpointList from '@views/moonshot-desktop/hooks/useLLMEndpointList';

type EndpointsExplorerProps = {
  windowId: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
  hideMenuButtons?: boolean;
  buttonAction?: ButtonAction;
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

function getWindowSubTitle(selectedBtnAction: ButtonAction) {
  switch (selectedBtnAction) {
    case ButtonAction.SELECT_MODELS:
      return `My Models > Select Models`;
    case ButtonAction.VIEW_MODELS:
      return `My Models > View Models`;
    case ButtonAction.ADD_NEW_MODEL:
      return `My Models > Add New Model`;
  }
}

function EndpointsExplorer(props: EndpointsExplorerProps) {
  const {
    windowId,
    hideMenuButtons = false,
    buttonAction = ButtonAction.SELECT_MODELS,
    onCloseClick,
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    onWindowChange,
  } = props;
  const {
    llmEndpoints,
    error,
    isLoading,
    refetch: refetchLLMEndpoints,
  } = useLLMEndpointList();
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    LLMEndpoint | undefined
  >();
  const [selectedBtnAction, setSelectedBtnAction] = useState<ButtonAction>(
    ButtonAction.VIEW_MODELS
  );
  const [selectedModels, setSelectedModels] = useState<LLMEndpoint[]>([]);

  const [
    createModelEndpoint,
    {
      data: newModelEndpoint,
      isLoading: createModelEndpointIsLoding,
      error: createModelEndpointError,
    },
  ] = useCreateLLMEndpointMutation();

  const isTwoPanel =
    selectedBtnAction === ButtonAction.SELECT_MODELS ||
    selectedBtnAction === ButtonAction.ADD_NEW_MODEL ||
    (selectedBtnAction === ButtonAction.VIEW_MODELS && selectedEndpoint);

  const initialDividerPosition =
    selectedBtnAction === ButtonAction.ADD_NEW_MODEL ? 55 : 40;

  const footerText = llmEndpoints.length
    ? `${llmEndpoints.length} Model${llmEndpoints.length > 1 ? 's' : ''}`
    : '';

  const windowTitle = getWindowSubTitle(selectedBtnAction);

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

  async function submitNewModel(data: LLMEndpointFormValues) {
    const newModelEndpoint = {
      type: data.type,
      name: data.name,
      uri: data.uri,
      token: data.token,
      max_calls_per_second: parseInt(data.maxCallsPerSecond),
      max_concurrency: parseInt(data.maxConcurrency),
      params: data.params,
    };
    const response = await createModelEndpoint(newModelEndpoint);
    if ('error' in response) {
      console.error(response.error);
      //TODO - create error visuals
      return;
    }
    setSelectedBtnAction(ButtonAction.VIEW_MODELS);
    setSelectedEndpoint(newModelEndpoint);
    refetchLLMEndpoints();
  }
  // useEffect(() => {
  //   setSelectedEndpoint(undefined);
  // }, [selectedBtnAction]);

  useEffect(() => {
    if (buttonAction && hideMenuButtons) {
      setSelectedBtnAction(buttonAction);
    }
  }, [buttonAction, hideMenuButtons]);

  return isLoading ? null : (
    <Window
      id={windowId}
      resizeable={false}
      initialXY={initialXY}
      zIndex={zIndex}
      initialWindowSize={initialSize}
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      name={windowTitle}
      leftFooterText={footerText}
      footerHeight={30}
      contentAreaStyles={{ backgroundColor: 'transparent' }}
      topPanel={
        hideMenuButtons ? null : (
          <TopButtonsBar
            onButtonClick={handleButtonClick}
            activeButton={selectedBtnAction}
          />
        )
      }>
      {isTwoPanel ? (
        <TwoPanel
          disableResize
          initialDividerPosition={initialDividerPosition}>
          <WindowList
            disableMouseInteraction={
              selectedBtnAction === ButtonAction.ADD_NEW_MODEL ? true : false
            }
            styles={{ backgroundColor: '#FFFFFF' }}>
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
          {selectedBtnAction === ButtonAction.ADD_NEW_MODEL ? (
            <div className="flex justify-center h-full">
              <NewModelEndpointForm onFormSubmit={submitNewModel} />
            </div>
          ) : selectedBtnAction === ButtonAction.SELECT_MODELS ||
            selectedBtnAction === ButtonAction.VIEW_MODELS ? (
            <div className="flex flex-col h-full">
              <div
                className={`${
                  selectedBtnAction === ButtonAction.SELECT_MODELS
                    ? 'h-[40%]'
                    : 'h-full'
                } bg-white`}>
                <WindowInfoPanel title="Model Details">
                  <div className="h-full">
                    {selectedEndpoint ? (
                      <div className="flex flex-col gap-6">
                        <LLMDetailsCard endpoint={selectedEndpoint} />
                      </div>
                    ) : null}
                  </div>
                </WindowInfoPanel>
              </div>
              {selectedBtnAction === ButtonAction.SELECT_MODELS ? (
                <div className="h-[60%] flex items-center pt-4">
                  {selectedModels.length ? (
                    <TaglabelsBox
                      models={selectedModels}
                      onTaglabelIconClick={handleListItemClick}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </TwoPanel>
      ) : (
        <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
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
