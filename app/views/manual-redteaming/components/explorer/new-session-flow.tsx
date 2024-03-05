import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useWindowChange } from '@/app/hooks/use-window-change';
import { useAppSelector } from '@/lib/redux';
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
import { ButtonAction } from '@views/models-management/components/top-buttons-bar';
import { EndpointsExplorer } from '@views/models-management/endpoints-explorer';
import { WindowIds, Z_Index } from '@views/moonshot-desktop/constants';

type NewSessionFormProps = {
  onNewSession: () => void;
  initialDividerPosition: number;
};

function NewSessionFlow(props: NewSessionFormProps) {
  const { initialDividerPosition } = props;
  const [llmEndpoints, setLlmEndpoints] = useState<LLMEndpoint[]>([]);
  const [isEndpointsExplorerOpen, setIsEndpointsExplorerOpen] = useState(false);
  const [unselectedEndpoint, setUnselectedEndpoint] = useState<LLMEndpoint>();
  const windowsMap = useAppSelector((state) => state.windows.map);
  const handleOnWindowChange = useWindowChange();

  function handleEndpointPickerClick(endpoint: LLMEndpoint) {
    setLlmEndpoints([...llmEndpoints, endpoint]);
  }

  function handleEndpointToEvaluateClick(name: string) {
    const clickedEndpoint = llmEndpoints.find((epoint) => epoint.name === name);
    setUnselectedEndpoint(clickedEndpoint);
    setLlmEndpoints(llmEndpoints.filter((epoint) => epoint.name !== name));
  }

  return (
    <>
      {isEndpointsExplorerOpen
        ? ReactDOM.createPortal(
            <EndpointsExplorer
              title="Select Models to Evaluate"
              mini
              hideMenuButtons
              buttonAction={ButtonAction.SELECT_MODELS}
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
              onCloseClick={() => setIsEndpointsExplorerOpen(false)}
              onListItemClick={handleEndpointPickerClick}
            />,
            document.getElementById('moonshotDesktop') as HTMLDivElement
          )
        : null}
      <TwoPanel initialDividerPosition={initialDividerPosition}>
        {llmEndpoints.length == 0 ? (
          <div className="flex h-full items-center justify-center bg-white">
            <IconButton
              label="Select Models to Evaluate"
              iconName={IconName.SolidBox}
              onClick={() => setIsEndpointsExplorerOpen(true)}
            />
          </div>
        ) : (
          <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
            {llmEndpoints
              ? llmEndpoints.map((endpoint) => (
                  <WindowList.Item
                    key={endpoint.name}
                    id={endpoint.name}
                    onClick={handleEndpointToEvaluateClick}>
                    <LLMItemCard endpoint={endpoint} />
                  </WindowList.Item>
                ))
              : null}
          </WindowList>
        )}
        <div className="flex justify-center h-full">
          <NewSessionForm onFormSubmit={() => null} />
        </div>
      </TwoPanel>
    </>
  );
}

export { NewSessionFlow };
