import { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { WindowTopBarButtonGroup } from '@/app/components/window-top-bar';
import { RecipeDetailsCard } from './components/recipe-details-card';
import { RecipeItemCard } from './components/recipe-item-card';
import useLLMEndpointList from '@views/moonshot-desktop/hooks/useLLMEndpointList';

type RecipessExplorerProps = {
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

function RecipessExplorer(props: RecipessExplorerProps) {
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
      name="Recipes"
      leftFooterText={footerText}
      footerHeight={24}
      topBar={
        <WindowTopBarButtonGroup height={45}>
          <div className="flex flex-col justify-end h-full py-2">
            <div className="flex items-end">
              <button
                className="btn-outline btn-small rounded-none"
                type="button">
                <div className="flex items-center gap-2">
                  <Icon
                    name={IconName.Plus}
                    lightModeColor="#FFFFFF"
                    size={15}
                  />
                  Add New Model
                </div>
              </button>
            </div>
          </div>
        </WindowTopBarButtonGroup>
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
                    <RecipeItemCard endpoint={endpoint} />
                  </WindowList.Item>
                ))
              : null}
          </WindowList>
          <WindowInfoPanel title="Model Details">
            <div className="h-full bg-gray-100">
              {selectedEndpoint ? (
                <div className="flex flex-col gap-6">
                  <RecipeDetailsCard endpoint={selectedEndpoint} />
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
                  <RecipeItemCard endpoint={endpoint} />
                </WindowList.Item>
              ))
            : null}
        </WindowList>
      )}
    </Window>
  );
}

export { RecipessExplorer };
