import { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { getWindowId } from '@/app/lib/window-utils';
import { useCreateLLMEndpointMutation } from '@/app/services/llm-endpoint-api-service';
import {
  addBenchmarkModels,
  addOpenedWindowId,
  removeOpenedWindowId,
  updateFocusedWindowId,
  useAppDispatch,
} from '@/lib/redux';
import { LLMDetailsCard } from './components/llm-details-card';
import { LLMItemCard } from './components/llm-item-card';
import { NewModelEndpointForm } from './components/new-endpoint-form';
import { TaglabelsBox } from './components/tag-labels-box';
import {
  ModelsExplorerButtonAction,
  TopButtonsBar,
} from './components/top-buttons-bar';
import { WindowIds } from '@views/moonshot-desktop/constants';
import useLLMEndpointList from '@views/moonshot-desktop/hooks/useLLMEndpointList';

type EndpointsExplorerProps = {
  windowId: string;
  mini?: boolean;
  endpoints?: LLMEndpoint[];
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
  hideMenuButtons?: boolean;
  buttonAction?: ModelsExplorerButtonAction;
  returnedEndpoint?: LLMEndpoint | LLMEndpoint[];
  removedEndpoints?: LLMEndpoint[];
  onListItemClick?: (endpoint: LLMEndpoint) => void;
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

function getWindowSubTitle(selectedBtnAction: ModelsExplorerButtonAction) {
  switch (selectedBtnAction) {
    case ModelsExplorerButtonAction.SELECT_MODELS:
      return `My Models`;
    case ModelsExplorerButtonAction.VIEW_MODELS:
      return `My Models`;
    case ModelsExplorerButtonAction.ADD_NEW_MODEL:
      return `My Models`;
  }
}

function EndpointsExplorer(props: EndpointsExplorerProps) {
  const {
    windowId,
    title,
    mini = false,
    hideMenuButtons = false,
    buttonAction = ModelsExplorerButtonAction.SELECT_MODELS,
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    returnedEndpoint,
    removedEndpoints,
    onCloseClick,
    onListItemClick,
    onWindowChange,
  } = props;
  const {
    llmEndpoints,
    error,
    isLoading,
    refetch: refetchLLMEndpoints,
  } = useLLMEndpointList();
  const [selectedBtnAction, setSelectedBtnAction] =
    useState<ModelsExplorerButtonAction>(
      ModelsExplorerButtonAction.VIEW_MODELS
    );
  const [selectedEndpointsList, setSelectedEndpointsList] = useState<
    LLMEndpoint[]
  >([]);
  const [displayedEndpointsList, setDisplayedEndpointsList] = useState<
    LLMEndpoint[]
  >([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    LLMEndpoint | undefined
  >();

  const [
    createModelEndpoint,
    {
      data: newModelEndpoint,
      isLoading: createModelEndpointIsLoding,
      error: createModelEndpointError,
    },
  ] = useCreateLLMEndpointMutation();

  const dispatch = useAppDispatch();

  const isTwoPanel =
    !mini &&
    (selectedBtnAction === ModelsExplorerButtonAction.SELECT_MODELS ||
      selectedBtnAction === ModelsExplorerButtonAction.ADD_NEW_MODEL ||
      (selectedBtnAction === ModelsExplorerButtonAction.VIEW_MODELS &&
        selectedEndpoint));

  const initialDividerPosition = 40;

  const footerText = llmEndpoints.length
    ? `${llmEndpoints.length} Model${llmEndpoints.length > 1 ? 's' : ''}`
    : '';

  const miniFooterText = `${llmEndpoints.length - displayedEndpointsList.length} / ${footerText} Selected`;

  const windowTitle = title || getWindowSubTitle(selectedBtnAction);

  function selectItem(name: string) {
    const endpoint = llmEndpoints.find((epoint) => epoint.name === name);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
    }
  }

  function handleListItemClick(name: string) {
    return () => {
      if (selectedBtnAction === ModelsExplorerButtonAction.VIEW_MODELS) {
        selectItem(name);
      } else if (
        selectedBtnAction === ModelsExplorerButtonAction.SELECT_MODELS
      ) {
        const clickedEndpoint = llmEndpoints.find(
          (epoint) => epoint.name === name
        );
        if (!clickedEndpoint) return;

        if (
          selectedEndpointsList.findIndex((epoint) => epoint.name === name) > -1
        ) {
          setSelectedEndpointsList((prev) =>
            prev.filter((epoint) => epoint.name !== clickedEndpoint.name)
          );
        } else {
          setSelectedEndpointsList((prev) => [...prev, clickedEndpoint]);
        }

        if (onListItemClick) {
          onListItemClick(clickedEndpoint);
          // Hide the clicked item from the list by filtering it out
          const updatedEndpoints = displayedEndpointsList.filter(
            (epoint) => epoint.name !== clickedEndpoint.name
          );
          setDisplayedEndpointsList(updatedEndpoints);
        }
      }
    };
  }

  function handleListItemHover(name: string) {
    return () => selectItem(name);
  }

  function handleButtonClick(action: ModelsExplorerButtonAction) {
    setSelectedBtnAction(action);
  }

  function sortDisplayedEndpointsByName(list: LLMEndpoint[]): LLMEndpoint[] {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  async function submitNewModel(data: LLMEndpointFormValues) {
    const newModelEndpoint = {
      connector_type: data.connector_type,
      name: data.name,
      uri: data.uri,
      token: data.token,
      max_calls_per_second: data.max_calls_per_second,
      max_concurrency: data.max_concurrency,
      params: data.params,
    };
    const response = await createModelEndpoint(newModelEndpoint);
    if ('error' in response) {
      console.error(response.error);
      //TODO - create error visuals
      return;
    }
    setSelectedBtnAction(ModelsExplorerButtonAction.VIEW_MODELS);
    setSelectedEndpoint(newModelEndpoint);
    refetchLLMEndpoints();
  }

  function handleBenchmarkBtnClick() {
    dispatch(addBenchmarkModels(selectedEndpointsList));
    dispatch(addOpenedWindowId(getWindowId(WindowIds.BENCHMARKING)));
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.LLM_ENDPOINTS)));
    dispatch(updateFocusedWindowId(getWindowId(WindowIds.BENCHMARKING)));
  }

  useEffect(() => {
    if (!isLoading && llmEndpoints) {
      setDisplayedEndpointsList(sortDisplayedEndpointsByName(llmEndpoints));
    }
  }, [isLoading, llmEndpoints]);

  useEffect(() => {
    if (buttonAction && hideMenuButtons) {
      setSelectedBtnAction(buttonAction);
    }
  }, [buttonAction, hideMenuButtons]);

  useEffect(() => {
    if (returnedEndpoint) {
      if (mini) {
        if (Array.isArray(returnedEndpoint)) {
          setDisplayedEndpointsList(
            sortDisplayedEndpointsByName([
              ...returnedEndpoint,
              ...displayedEndpointsList,
            ])
          );
        } else {
          setDisplayedEndpointsList(
            sortDisplayedEndpointsByName([
              returnedEndpoint,
              ...displayedEndpointsList,
            ])
          );
        }
      }
    }
  }, [returnedEndpoint]);

  useEffect(() => {
    if (!mini || isLoading) return;
    if (removedEndpoints && removedEndpoints.length) {
      const filtered = llmEndpoints.filter(
        (endpoint) =>
          !removedEndpoints.some(
            (removedEndpoint) => removedEndpoint.id === endpoint.id
          )
      );
      setDisplayedEndpointsList(sortDisplayedEndpointsByName(filtered));
    }
  }, [removedEndpoints, isLoading]);

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
          <WindowList
            disableMouseInteraction={
              selectedBtnAction === ModelsExplorerButtonAction.ADD_NEW_MODEL
                ? true
                : false
            }
            styles={{ backgroundColor: '#FFFFFF' }}>
            {displayedEndpointsList
              ? displayedEndpointsList.map((endpoint) => (
                  <WindowList.Item
                    key={endpoint.name}
                    id={endpoint.name}
                    className="justify-start"
                    enableCheckbox={
                      selectedBtnAction ===
                      ModelsExplorerButtonAction.SELECT_MODELS
                    }
                    checked={
                      selectedEndpointsList.findIndex(
                        (epoint) => epoint.name === endpoint.name
                      ) > -1
                    }
                    onClick={handleListItemClick(endpoint.name)}
                    onHover={
                      selectedBtnAction ===
                      ModelsExplorerButtonAction.SELECT_MODELS
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
          {selectedBtnAction === ModelsExplorerButtonAction.ADD_NEW_MODEL ? (
            <div className="flex flex-1 justify-center h-full">
              <NewModelEndpointForm
                onFormSubmit={submitNewModel}
                className="pt-5"
              />
            </div>
          ) : selectedBtnAction === ModelsExplorerButtonAction.SELECT_MODELS ||
            selectedBtnAction === ModelsExplorerButtonAction.VIEW_MODELS ? (
            <div className="flex flex-col h-full">
              <div
                className={`${
                  selectedBtnAction === ModelsExplorerButtonAction.SELECT_MODELS
                    ? 'h-[60%]'
                    : 'h-full'
                } bg-white`}>
                <WindowInfoPanel title="Model Details">
                  <div className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar mr-[2px]">
                    {selectedEndpoint ? (
                      <div className="flex flex-col gap-6">
                        <LLMDetailsCard endpoint={selectedEndpoint} />
                      </div>
                    ) : null}
                  </div>
                </WindowInfoPanel>
              </div>
              {selectedBtnAction ===
              ModelsExplorerButtonAction.SELECT_MODELS ? (
                <div className="h-[60%] flex flex-col items-center pt-4">
                  {selectedEndpointsList.length ? (
                    <>
                      <TaglabelsBox
                        models={selectedEndpointsList}
                        onTaglabelIconClick={handleListItemClick}
                      />
                      <div className="flex gap-4 bottom-3 text-right">
                        <button
                          className="flex btn-primary items-center gap-2 btn-large rounded"
                          type="button"
                          onClick={handleBenchmarkBtnClick}>
                          <div>Benchmark</div>
                          <Icon
                            name={IconName.ArrowRight}
                            lightModeColor="#FFFFFF"
                            size={14}
                          />
                        </button>
                        <button
                          className="flex btn-primary items-center gap-2 btn-large rounded"
                          type="button">
                          <div>Red Team</div>
                          <Icon
                            name={IconName.ArrowRight}
                            lightModeColor="#FFFFFF"
                            size={14}
                          />
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </TwoPanel>
      ) : (
        <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
          {displayedEndpointsList
            ? displayedEndpointsList.map((endpoint) => (
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
