import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { useDispatch } from 'react-redux';
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
  addBenchmarkCookbooks,
  addBenchmarkModels,
  removeBenchmarkCookbooks,
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
import { CookbookItemCard } from '../cookbook-management/components/cookbook-item-card';
import { CookbooksExplorer } from '../cookbook-management/cookbooks-explorer';
import { CookbooksExplorerButtonAction } from '../cookbook-management/components/top-buttons-bar';

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
  const [addedCookbooks, setAddedCookbooks] = useState<Cookbook[]>([]);
  const [unselectedEndpoint, setUnselectedEndpoint] = useState<
    LLMEndpoint | LLMEndpoint[]
  >();
  const [unselectedCookbook, setUnselectedCookbook] = useState<Cookbook>();
  const [isEndpointsExplorerOpen, setIsEndpointsExplorerOpen] = useState(false);
  const [isCookbookExplorerOpen, setIsCookbooksExplorerOpen] = useState(false);
  const dispatch = useDispatch();
  const windowsMap = useAppSelector((state) => state.windows.map);

  const benchmarkModelsFromState = useAppSelector(
    (state) => state.benchmarkModels.entities
  );
  const benchmarkCookbooksFromState = useAppSelector(
    (state) => state.benchmarkCookbooks.entities
  );

  const initialDividerPositions = [33, 66];

  const handleOnWindowChange = useWindowChange();

  function handleEndpointPickerClick(endpoint: LLMEndpoint) {
    dispatch(addBenchmarkModels([endpoint]));
  }

  function handleCookbookPickerClick(cookbook: Cookbook) {
    dispatch(addBenchmarkCookbooks([cookbook]));
  }

  function handleCloseEndpointPickerClick() {
    setUnselectedEndpoint(undefined);
    setIsEndpointsExplorerOpen(false);
  }

  function handleCloseCookbookPickerClick() {
    setUnselectedCookbook(undefined);
    setIsCookbooksExplorerOpen(false);
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

  function handleAddedCookbookClick(id: string) {
    const clickedCookbook = addedCookbooks.find(
      (cookbook) => cookbook.id === id
    );
    if (!clickedCookbook) {
      console.error('Clicked cookbook not found in added models');
      return;
    }
    if (isEndpointsExplorerOpen) {
      setUnselectedCookbook(clickedCookbook);
    }
    dispatch(removeBenchmarkCookbooks([clickedCookbook]));
  }

  useEffect(() => {
    setAddedModels(benchmarkModelsFromState);
  }, [benchmarkModelsFromState]);

  useEffect(() => {
    setAddedCookbooks(benchmarkCookbooksFromState);
  }, [benchmarkCookbooksFromState]);

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
          <div className="flex flex-col h-full justify-start gap-1 pr-1">
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
            <div className="max-[33%] h-full">
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
          </div>
          <div className="flex flex-col h-full justify-start gap-1 pl-1">
            <div className="flex justify-between">
              <IconButton
                className="bg-transparent"
                label="Select Cookbooks to run"
                labelSize={14}
                iconSize={15}
                iconName={IconName.Book}
                onClick={() => setIsCookbooksExplorerOpen(true)}
              />
              <IconButton
                iconName={IconName.Plus}
                iconSize={15}
                onClick={() => setIsCookbooksExplorerOpen(true)}
              />
            </div>
            <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
              {addedCookbooks
                ? addedCookbooks.map((cookbook) => (
                    <WindowList.Item
                      key={cookbook.id}
                      id={cookbook.id}
                      className="justify-between"
                      onCloseIconClick={handleAddedCookbookClick}>
                      <CookbookItemCard
                        cookbook={cookbook}
                        className="w-[94%]"
                      />
                    </WindowList.Item>
                  ))
                : null}
            </WindowList>
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
        {isCookbookExplorerOpen
          ? ReactDOM.createPortal(
              <CookbooksExplorer
                title="Select Cookbooks to run"
                mini
                hideMenuButtons
                buttonAction={CookbooksExplorerButtonAction.SELECT_COOKBOOK}
                zIndex={Z_Index.Top}
                windowId={getWindowId(WindowIds.COOKBOOKS_PICKER)}
                initialXY={getWindowXYById(
                  windowsMap,
                  WindowIds.COOKBOOKS_PICKER
                )}
                initialSize={getWindowSizeById(
                  windowsMap,
                  WindowIds.COOKBOOKS_PICKER
                )}
                returnedCookbook={unselectedCookbook}
                onWindowChange={handleOnWindowChange}
                onCloseClick={handleCloseCookbookPickerClick}
                onListItemClick={handleCookbookPickerClick}
              />,
              document.getElementById(moonshotDesktopDivID) as HTMLDivElement
            )
          : null}
      </div>
    </Window>
  );
}

export { BenchmarkFlowWindow };
