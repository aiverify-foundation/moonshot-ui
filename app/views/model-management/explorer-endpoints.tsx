import { useState } from 'react';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { WindowTopBar } from '@/app/components/window-top-bar';
import { LLMDetailsCard } from './components/llm-details-card';
import { LLMItemCard } from './components/llm-item-card';
import useLLMEndpointList from '@views/moonshot-desktop/hooks/useLLMEndpointList';

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
  const [selectedEndpoint, setSelectedEndpoint] = useState<LLMEndpoint>();
  const footerText = llmEndpoints.length
    ? `${llmEndpoints.length} Endpoint${llmEndpoints.length > 1 ? 's' : ''}`
    : '';

  function handleListItemClick(name: string) {
    const endpoint = llmEndpoints.find((epoint) => epoint.name === name);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
    }
  }

  return isLoading ? null : (
    <Window
      id={windowId}
      resizeable={false}
      initialXY={initialXY}
      zIndex={zIndex}
      initialWindowSize={initialSize}
      onCloseClick={onCloseClick}
      onWindowChange={onWindowChange}
      name="LLM Endpoints"
      leftFooterText={footerText}
      topPanel={
        <WindowTopBar>
          <h2>test</h2>
        </WindowTopBar>
      }>
      {selectedEndpoint ? (
        <TwoPanel>
          <WindowList>
            {llmEndpoints
              ? llmEndpoints.map((endpoint) => (
                  <WindowList.Item
                    key={endpoint.name}
                    id={endpoint.name}
                    onClick={() => handleListItemClick(endpoint.name)}
                    selected={selectedEndpoint.name === endpoint.name}>
                    <LLMItemCard endpoint={endpoint} />
                  </WindowList.Item>
                ))
              : null}
          </WindowList>
          <WindowInfoPanel title="LLM Endpoint">
            <div className="h-full">
              {selectedEndpoint ? (
                <div className="flex flex-col gap-6">
                  <LLMDetailsCard endpoint={selectedEndpoint} />
                  <div>
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={() => null}>
                      Edit
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </WindowInfoPanel>
        </TwoPanel>
      ) : (
        <WindowList>
          {llmEndpoints
            ? llmEndpoints.map((endpoint) => (
                <WindowList.Item
                  key={endpoint.name}
                  id={endpoint.name}
                  onClick={handleListItemClick}>
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
