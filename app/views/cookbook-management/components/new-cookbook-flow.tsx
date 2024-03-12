import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useWindowChange } from '@/app/hooks/use-window-change';
import { useAppSelector } from '@/lib/redux';
import { CookbookFormValues, NewCookbookForm } from './new-cookbook-form';
import {
  getWindowId,
  getWindowSizeById,
  getWindowXYById,
} from '@app/lib/window-utils';
import { IconName } from '@components/IconSVG';
import { IconButton } from '@components/icon-button';
import TwoPanel from '@components/two-panel';
import { WindowList } from '@components/window-list';
import {
  WindowIds,
  Z_Index,
  moonshotDesktopDivID,
} from '@views/moonshot-desktop/constants';
import { RecipeItemCard } from '@views/recipes-management/components/recipe-item-card';
import { RecipesExplorerButtonAction } from '@views/recipes-management/components/top-buttons-bar';
import { RecipesExplorer } from '@views/recipes-management/recipes-explorer';

type NewCookbookFormProps = {
  onSaveCookbook: (data: CookbookFormValues) => void;
  initialDividerPosition: number;
};

/*
  Renders 2 panel layout with selected endpoints on the left panel and new session form on the right.
  Also renders minified endpoints explorer as a modal via portal.
  Clicking on endpoints from the minified endpoints explorer will add them to the selected endpoints list.
*/
function NewCookbookFlow(props: NewCookbookFormProps) {
  const { initialDividerPosition, onSaveCookbook } = props;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isRecipesExplorerOpen, setIsRecipesExplorerOpen] = useState(false);
  const [unselectedRecipe, setUnselectedRecipe] = useState<Recipe>();
  const windowsMap = useAppSelector((state) => state.windows.map);
  const handleOnWindowChange = useWindowChange();

  function handleEndpointPickerClick(rec: Recipe) {
    setRecipes([...recipes, rec]);
  }

  function handleCloseEndpointPickerClick() {
    setUnselectedRecipe(undefined);
    setIsRecipesExplorerOpen(false);
  }

  function handleEndpointToEvaluateClick(name: string) {
    const clickedRecipe = recipes.find((rec) => rec.name === name);
    if (isRecipesExplorerOpen) {
      setUnselectedRecipe(clickedRecipe);
    }
    setRecipes(recipes.filter((rec) => rec.name !== name));
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* <div className="text-sm text-white mb-7"></div> */}
      <TwoPanel
        disableResize
        initialDividerPosition={initialDividerPosition}>
        <div className="flex flex-col flex-1 h-full justify-start gap-1">
          <div className="flex justify-between">
            <IconButton
              label="Select Recipes to add to the cookbook"
              labelSize={14}
              iconName={IconName.File}
              iconSize={15}
              className="bg-transparent"
              onClick={() => setIsRecipesExplorerOpen(true)}
            />
            <IconButton
              iconName={IconName.Plus}
              iconSize={15}
              onClick={() => setIsRecipesExplorerOpen(true)}
            />
          </div>
          {recipes.length == 0 ? (
            <div className="flex flex-grow items-center justify-center bg-white">
              <div className="text-sm text-gray-500">No recipes selected</div>
            </div>
          ) : (
            <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
              {recipes
                ? recipes.map((rec) => (
                    <WindowList.Item
                      key={rec.name}
                      id={rec.name}
                      className="justify-between"
                      onCloseIconClick={handleEndpointToEvaluateClick}>
                      <RecipeItemCard
                        recipe={rec}
                        className="w-[94%]"
                      />
                    </WindowList.Item>
                  ))
                : null}
            </WindowList>
          )}
        </div>
        <div className="flex flex-1 justify-center h-full">
          <NewCookbookForm
            onFormSubmit={onSaveCookbook}
            selectedRecipes={recipes}
            className="pt-5"
          />
        </div>
      </TwoPanel>
      {isRecipesExplorerOpen
        ? ReactDOM.createPortal(
            <RecipesExplorer
              title="Select Recipes to add to Cookbook"
              mini
              hideMenuButtons
              buttonAction={RecipesExplorerButtonAction.SELECT_RECIPES}
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
              returnedRecipe={unselectedRecipe}
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

export { NewCookbookFlow };
