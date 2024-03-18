import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useWindowChange } from '@/app/hooks/use-window-change';
import {
  addBenchmarkModels,
  removeBenchmarkModels,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { NewSessionForm } from './new-session-form';
import {
  getWindowId,
  getWindowSizeById,
  getWindowXYById,
} from '@app/lib/window-utils';
import { IconName } from '@components/IconSVG';
import { IconButton } from '@components/icon-button';
import TwoPanel from '@components/two-panel';
import { WindowList } from '@components/window-list';
import { LLMItemCard } from '@views/models-management/components/llm-item-card';
import { ModelsExplorerButtonAction } from '@views/models-management/components/top-buttons-bar';
import { EndpointsExplorer } from '@views/models-management/endpoints-explorer';
import {
  WindowIds,
  Z_Index,
  moonshotDesktopDivID,
} from '@views/moonshot-desktop/constants';

type NewSessionFormProps = {
  onNewSession: () => void;
  initialDividerPosition: number;
};

/*
  Renders 2 panel layout with selected endpoints on the left panel and new session form on the right.
  Also renders minified endpoints explorer as a modal via portal.
  Clicking on endpoints from the minified endpoints explorer will add them to the selected endpoints list.
*/
function NewSessionFlow(props: NewSessionFormProps) {
  const { initialDividerPosition } = props;
  const [llmEndpoints, setLlmEndpoints] = useState<LLMEndpoint[]>([]);
  const [isEndpointsExplorerOpen, setIsEndpointsExplorerOpen] = useState(false);
  const [unselectedEndpoint, setUnselectedEndpoint] = useState<LLMEndpoint>();
  const windowsMap = useAppSelector((state) => state.windows.map);
  const handleOnWindowChange = useWindowChange();
  const dispatch = useAppDispatch();

  const benchmarkModelsFromState = useAppSelector(
    (state) => state.benchmarkModels.entities
  );

  function handleEndpointPickerClick(endpoint: LLMEndpoint) {
    setLlmEndpoints([...llmEndpoints, endpoint]);
    dispatch(addBenchmarkModels([endpoint]));
  }

  function handleCloseEndpointPickerClick() {
    setUnselectedEndpoint(undefined);
    setIsEndpointsExplorerOpen(false);
  }

  function handleEndpointToEvaluateClick(name: string) {
    const clickedEndpoint = llmEndpoints.find((epoint) => epoint.name === name);
    if (isEndpointsExplorerOpen) {
      setUnselectedEndpoint(clickedEndpoint);
    }
    if (clickedEndpoint) {
      dispatch(removeBenchmarkModels([clickedEndpoint]));
    }
    setLlmEndpoints(llmEndpoints.filter((epoint) => epoint.name !== name));
  }

  useEffect(() => {
    setLlmEndpoints(benchmarkModelsFromState);
  }, [benchmarkModelsFromState]);

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-white mb-7">
        This red teaming interface enables you to prompt multiple models at once
        and compare results. <br />
        Once session starts, models cannot be changed.
      </div>
      <TwoPanel
        disableResize
        initialDividerPosition={initialDividerPosition}>
        <div className="flex flex-col h-full justify-start gap-1">
          <div className="flex justify-between">
            <IconButton
              className="bg-transparent"
              label="Select Models to Evaluate"
              labelSize={14}
              iconSize={15}
              iconName={IconName.SolidBox}
              onClick={() => setIsEndpointsExplorerOpen(true)}
            />
            <IconButton
              iconName={IconName.Plus}
              iconSize={15}
              onClick={() => setIsEndpointsExplorerOpen(true)}
            />
          </div>
          {llmEndpoints.length == 0 ? (
            <div className="flex flex-grow items-center justify-center bg-white">
              <div className="text-sm text-gray-500">No models selected</div>
            </div>
          ) : (
            <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
              {llmEndpoints
                ? llmEndpoints.map((endpoint) => (
                    <WindowList.Item
                      key={endpoint.name}
                      id={endpoint.name}
                      className="justify-between"
                      onCloseIconClick={handleEndpointToEvaluateClick}>
                      <LLMItemCard endpoint={endpoint} />
                    </WindowList.Item>
                  ))
                : null}
            </WindowList>
          )}
        </div>
        <div className="flex justify-center h-full">
          <NewSessionForm
            onFormSubmit={() => null}
            selectedEndpoints={llmEndpoints}
          />
        </div>
      </TwoPanel>
      {isEndpointsExplorerOpen
        ? ReactDOM.createPortal(
            <EndpointsExplorer
              title="Select Models to Evaluate"
              mini
              hideMenuButtons
              buttonAction={ModelsExplorerButtonAction.SELECT_MODELS}
              zIndex={Z_Index.Top}
              windowId={getWindowId(WindowIds.LLM_ENDPOINTS_PICKER)}
              initialXY={getWindowXYById(
                windowsMap,
                WindowIds.LLM_ENDPOINTS_PICKER
              )}
              initialSize={getWindowSizeById(
                windowsMap,
                WindowIds.LLM_ENDPOINTS_PICKER
              )}
              returnedEndpoint={unselectedEndpoint}
              onWindowChange={handleOnWindowChange}
              onCloseClick={handleCloseEndpointPickerClick}
              onListItemClick={handleEndpointPickerClick}
            />,
            document.getElementById(moonshotDesktopDivID) as HTMLDivElement
          )
        : null}
    </div>
  );
}

export { NewSessionFlow };
