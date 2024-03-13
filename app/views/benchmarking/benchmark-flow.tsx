import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { IconName } from '@/app/components/IconSVG';
import { IconButton } from '@/app/components/icon-button';
import { ThreePanel } from '@/app/components/three-panel';
import { Window } from '@/app/components/window';
import { WindowList } from '@/app/components/window-list';
import { useWindowChange } from '@/app/hooks/use-window-change';
import {
  getWindowId,
  getWindowSizeById,
  getWindowXYById,
} from '@/app/lib/window-utils';
import {
  addBenchmarkModels,
  removeBenchmarkModels,
  useAppSelector,
} from '@/lib/redux';
import { LLMItemCard } from '@views/models-management/components/llm-item-card';
import { ModelsExplorerButtonAction } from '@views/models-management/components/top-buttons-bar';
import { EndpointsExplorer } from '@views/models-management/endpoints-explorer';
import {
  WindowIds,
  Z_Index,
  moonshotDesktopDivID,
} from '@views/moonshot-desktop/constants';
import { useDispatch } from 'react-redux';

type BenchmarkFlowProps = {
  zIndex: number | 'auto';
  windowId: string;
  initialXY: [number, number];
  initialSize: [number, number];
  onCloseClick: () => void;
  onWindowChange: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollTop: number,
    windowId: string
  ) => void;
};

function BenchmarkFlowWindow(props: BenchmarkFlowProps) {
  const {
    zIndex,
    windowId,
    initialSize,
    initialXY,
    onWindowChange,
    onCloseClick,
  } = props;
  const [initialWindowSize, setInitialWindowSize] =
    useState<[number, number]>(initialSize);
  const [initialWindowXY, setInitialWindowXY] =
    useState<[number, number]>(initialXY);
  const [addedModels, setAddedModels] = useState<LLMEndpoint[]>([]);
  const [unselectedEndpoint, setUnselectedEndpoint] = useState<
    LLMEndpoint | LLMEndpoint[]
  >();
  const [isEndpointsExplorerOpen, setIsEndpointsExplorerOpen] = useState(false);
  const dispatch = useDispatch();
  const windowsMap = useAppSelector((state) => state.windows.map);

  const benchmarkModelsFromState = useAppSelector(
    (state) => state.benchmarkModels.entities
  );

  const initialDividerPositions = [33, 66];

  const handleOnWindowChange = useWindowChange();

  function handleEndpointPickerClick(endpoint: LLMEndpoint) {
    dispatch(addBenchmarkModels([endpoint]));
  }

  function handleCloseEndpointPickerClick() {
    setUnselectedEndpoint(undefined);
    setIsEndpointsExplorerOpen(false);
  }

  function handleAddedEndpointClick(id: string) {
    const clickedEndpoint = addedModels.find((epoint) => epoint.id === id);
    if (!clickedEndpoint) {
      console.error('Clicked endpoint not found in added models');
      return;
    }
    if (isEndpointsExplorerOpen) {
      setUnselectedEndpoint(clickedEndpoint);
    }
    dispatch(removeBenchmarkModels([clickedEndpoint]));
  }

  useEffect(() => {
    setAddedModels(benchmarkModelsFromState);
  }, [benchmarkModelsFromState]);

  useEffect(() => {
    setInitialWindowSize(initialSize);
  }, [initialSize]);

  useEffect(() => {
    setInitialWindowXY(initialXY);
  }, [initialXY]);

  return (
    <Window
      id={windowId}
      resizeable
      initialXY={initialWindowXY}
      initialWindowSize={initialWindowSize}
      onWindowChange={onWindowChange}
      zIndex={zIndex}
      onCloseClick={onCloseClick}
      name="Run Benchmarks"
      footerHeight={30}
      contentAreaStyles={{ backgroundColor: 'transparent' }}>
      <div className="h-full flex flex-col">
        <div className="text-sm text-white mb-7">
          Benchmark Datasets consists of the prompts to be sent to the model and
          the expected target. <br />
          Select the models that you want to evaluate and curate the benchmarks
          that you want to run.
        </div>
        <ThreePanel initialDividerPositions={initialDividerPositions}>
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
            <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
              {addedModels
                ? addedModels.map((model) => (
                    <WindowList.Item
                      key={model.id}
                      id={model.id}
                      className="justify-between"
                      onCloseIconClick={handleAddedEndpointClick}>
                      <LLMItemCard endpoint={model} />
                    </WindowList.Item>
                  ))
                : null}
            </WindowList>
          </div>
          <div className="flex flex-col gap-6 bg-white h-full">
            <h1>test</h1>
          </div>
          <h2>test2</h2>
        </ThreePanel>
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
                removedEndpoints={benchmarkModelsFromState}
                returnedEndpoint={unselectedEndpoint}
                onWindowChange={handleOnWindowChange}
                onCloseClick={handleCloseEndpointPickerClick}
                onListItemClick={handleEndpointPickerClick}
              />,
              document.getElementById(moonshotDesktopDivID) as HTMLDivElement
            )
          : null}
      </div>
    </Window>
  );
}

export { BenchmarkFlowWindow };
