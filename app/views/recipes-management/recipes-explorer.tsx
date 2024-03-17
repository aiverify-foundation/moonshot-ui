import { useEffect, useState } from 'react';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { RecipeDetailsCard } from './components/recipe-details-card';
import { RecipeItemCard } from './components/recipe-item-card';
import { TaglabelsBox } from './components/tag-labels-box';
import {
  RecipesExplorerButtonAction,
  TopButtonsBar,
} from './components/top-buttons-bar';
import { useRecipeList } from './hooks/useRecipeList';

type RecipesExplorerProps = {
  windowId: string;
  mini?: boolean;
  recipes?: Recipe[];
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
  hideMenuButtons?: boolean;
  buttonAction?: RecipesExplorerButtonAction;
  returnedRecipe?: Recipe;
  onListItemClick?: (recipe: Recipe) => void;
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

function getWindowSubTitle(selectedBtnAction: RecipesExplorerButtonAction) {
  switch (selectedBtnAction) {
    case RecipesExplorerButtonAction.SELECT_RECIPES:
      return `Recipes`;
    case RecipesExplorerButtonAction.VIEW_RECIPES:
      return `Recipes`;
    case RecipesExplorerButtonAction.ADD_NEW_RECIPE:
      return `Recipes`;
  }
}

function RecipesExplorer(props: RecipesExplorerProps) {
  const {
    windowId,
    title,
    mini = false,
    hideMenuButtons = false,
    buttonAction = RecipesExplorerButtonAction.SELECT_RECIPES,
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    returnedRecipe,
    onCloseClick,
    onListItemClick,
    onWindowChange,
  } = props;
  const {
    recipes,
    error,
    isLoading,
    refetch: refetchRecipes,
  } = useRecipeList();
  const [selectedBtnAction, setSelectedBtnAction] =
    useState<RecipesExplorerButtonAction>(
      RecipesExplorerButtonAction.VIEW_RECIPES
    );
  const [selectedRecipeList, setSelectedRecipesList] = useState<Recipe[]>([]);
  const [displayedRecipesList, setDisplayedRecipesList] = useState<Recipe[]>(
    []
  );
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>();

  const isTwoPanel =
    !mini &&
    (selectedBtnAction === RecipesExplorerButtonAction.SELECT_RECIPES ||
      selectedBtnAction === RecipesExplorerButtonAction.ADD_NEW_RECIPE ||
      (selectedBtnAction === RecipesExplorerButtonAction.VIEW_RECIPES &&
        selectedRecipe));

  const initialDividerPosition =
    selectedBtnAction === RecipesExplorerButtonAction.ADD_NEW_RECIPE ? 55 : 40;

  const footerText = recipes.length
    ? `${recipes.length} Recipe${recipes.length > 1 ? 's' : ''}`
    : '';

  const miniFooterText = `${recipes.length - displayedRecipesList.length} / ${footerText} Selected`;

  const windowTitle = title || getWindowSubTitle(selectedBtnAction);

  function selectItem(name: string) {
    const recipe = recipes.find((epoint) => epoint.name === name);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  }

  function handleListItemClick(name: string) {
    return () => {
      if (selectedBtnAction === RecipesExplorerButtonAction.VIEW_RECIPES) {
        selectItem(name);
      } else if (
        selectedBtnAction === RecipesExplorerButtonAction.SELECT_RECIPES
      ) {
        const clickedrecipe = recipes.find((epoint) => epoint.name === name);
        if (!clickedrecipe) return;

        if (
          selectedRecipeList.findIndex((epoint) => epoint.name === name) > -1
        ) {
          setSelectedRecipesList((prev) =>
            prev.filter((epoint) => epoint.name !== clickedrecipe.name)
          );
        } else {
          setSelectedRecipesList((prev) => [...prev, clickedrecipe]);
        }

        if (onListItemClick) {
          onListItemClick(clickedrecipe);
          // Hide the clicked item from the list by filtering it out
          const updatedrecipes = displayedRecipesList.filter(
            (epoint) => epoint.name !== clickedrecipe.name
          );
          setDisplayedRecipesList(updatedrecipes);
        }
      }
    };
  }

  function handleListItemHover(name: string) {
    return () => selectItem(name);
  }

  function handleButtonClick(action: RecipesExplorerButtonAction) {
    setSelectedBtnAction(action);
  }

  function sortDisplayedrecipesByName(list: Recipe[]): Recipe[] {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  useEffect(() => {
    if (!isLoading && recipes) {
      setDisplayedRecipesList(sortDisplayedrecipesByName(recipes));
    }
  }, [isLoading, recipes]);

  useEffect(() => {
    if (buttonAction && hideMenuButtons) {
      setSelectedBtnAction(buttonAction);
    }
  }, [buttonAction, hideMenuButtons]);

  useEffect(() => {
    if (returnedRecipe) {
      if (mini) {
        setDisplayedRecipesList(
          sortDisplayedrecipesByName([returnedRecipe, ...displayedRecipesList])
        );
      }
    }
  }, [returnedRecipe]);

  return (
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
      {isLoading ? (
        <div className="ring">
          Loading
          <span />
        </div>
      ) : (
        <>
          {isTwoPanel ? (
            <TwoPanel initialDividerPosition={initialDividerPosition}>
              <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
                {displayedRecipesList
                  ? displayedRecipesList.map((recipe) => (
                      <WindowList.Item
                        key={recipe.id}
                        id={recipe.name}
                        className="justify-start"
                        enableCheckbox={
                          selectedBtnAction ===
                          RecipesExplorerButtonAction.SELECT_RECIPES
                        }
                        checked={
                          selectedRecipeList.findIndex(
                            (epoint) => epoint.name === recipe.name
                          ) > -1
                        }
                        onClick={handleListItemClick(recipe.name)}
                        onHover={
                          selectedBtnAction ===
                          RecipesExplorerButtonAction.SELECT_RECIPES
                            ? handleListItemHover(recipe.name)
                            : undefined
                        }
                        selected={
                          selectedRecipe
                            ? selectedRecipe.name === recipe.name
                            : false
                        }>
                        <RecipeItemCard
                          recipe={recipe}
                          className="w-[94%]"
                        />
                      </WindowList.Item>
                    ))
                  : null}
              </WindowList>
              {selectedBtnAction ===
                RecipesExplorerButtonAction.SELECT_RECIPES ||
              selectedBtnAction === RecipesExplorerButtonAction.VIEW_RECIPES ? (
                <div className="flex flex-col h-full">
                  <div
                    className={`${
                      selectedBtnAction ===
                        RecipesExplorerButtonAction.SELECT_RECIPES &&
                      selectedRecipeList.length
                        ? 'h-[60%]'
                        : 'h-full'
                    } bg-white`}>
                    <WindowInfoPanel title="Recipe Details">
                      <div className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar mr-[2px]">
                        {selectedRecipe ? (
                          <div className="flex flex-col gap-6">
                            <RecipeDetailsCard recipe={selectedRecipe} />
                          </div>
                        ) : null}
                      </div>
                    </WindowInfoPanel>
                  </div>
                  {selectedBtnAction ===
                    RecipesExplorerButtonAction.SELECT_RECIPES &&
                  selectedRecipeList.length ? (
                    <div className="h-[60%] flex items-center pt-4">
                      <TaglabelsBox
                        recipes={selectedRecipeList}
                        onTaglabelIconClick={handleListItemClick}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </TwoPanel>
          ) : (
            <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
              {displayedRecipesList
                ? displayedRecipesList.map((recipe) => (
                    <WindowList.Item
                      key={recipe.id}
                      id={recipe.name}
                      onClick={handleListItemClick(recipe.name)}>
                      <RecipeItemCard recipe={recipe} />
                    </WindowList.Item>
                  ))
                : null}
            </WindowList>
          )}
        </>
      )}
    </Window>
  );
}

export { RecipesExplorer };
