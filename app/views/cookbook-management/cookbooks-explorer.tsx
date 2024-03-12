import { useEffect, useRef, useState } from 'react';
import TwoPanel from '@/app/components/two-panel';
import { Window } from '@/app/components/window';
import { WindowInfoPanel } from '@/app/components/window-info-panel';
import { WindowList } from '@/app/components/window-list';
import { useCreateCookbookMutation } from '@/app/services/cookbook-api-service';
import { CookbookDetailsCard } from './components/cookbook-details-card';
import { CookbookItemCard } from './components/cookbook-item-card';
import { NewCookbookFlow } from './components/new-cookbook-flow';
import { CookbookFormValues } from './components/new-cookbook-form';
import { TaglabelsBox } from './components/tag-labels-box';
import {
  CookbooksExplorerButtonAction,
  TopButtonsBar,
} from './components/top-buttons-bar';
import useCookbookList from './hooks/useCookbookList';

type cookbooksExplorerProps = {
  windowId: string;
  mini?: boolean;
  cookbooks?: Cookbook[];
  title?: string;
  initialXY: [number, number];
  initialSize: [number, number];
  zIndex: number | 'auto';
  hideMenuButtons?: boolean;
  buttonAction?: CookbooksExplorerButtonAction;
  returnedcookbook?: Cookbook;
  onListItemClick?: (cookbook: Cookbook) => void;
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

function getWindowSubTitle(selectedBtnAction: CookbooksExplorerButtonAction) {
  switch (selectedBtnAction) {
    case CookbooksExplorerButtonAction.SELECT_COOKBOOK:
      return `Cookbooks`;
    case CookbooksExplorerButtonAction.VIEW_COOKBOOKS:
      return `Cookbooks`;
    case CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK:
      return `Cookbooks`;
  }
}

function CookbooksExplorer(props: cookbooksExplorerProps) {
  const {
    windowId,
    title,
    mini = false,
    hideMenuButtons = false,
    buttonAction = CookbooksExplorerButtonAction.SELECT_COOKBOOK,
    initialXY = [600, 200],
    initialSize = [720, 470],
    zIndex,
    returnedcookbook,
    onCloseClick,
    onListItemClick,
    onWindowChange,
  } = props;
  const {
    cookbooks,
    error,
    isLoading,
    refetch: refetchCookbooks,
  } = useCookbookList();
  const [
    createCookbook,
    {
      data: newCookbook,
      isLoading: createCookbookIsLoding,
      error: createCookbookError,
    },
  ] = useCreateCookbookMutation();
  const [selectedBtnAction, setSelectedBtnAction] =
    useState<CookbooksExplorerButtonAction>(
      CookbooksExplorerButtonAction.VIEW_COOKBOOKS
    );
  const [selectedCookbookList, setSelectedCookbooksList] = useState<Cookbook[]>(
    []
  );
  const [displayedCookbooksList, setDisplayedCookbooksList] = useState<
    Cookbook[]
  >([]);
  const [selectedCookbook, setSelectedCookbook] = useState<
    Cookbook | undefined
  >();
  const [newlyAddedCookbookName, setNewlyAddedCookbookName] = useState<
    string | undefined
  >();
  const newCookbookRef = useRef<HTMLLIElement | null>(null);

  const isTwoPanel =
    !mini &&
    (selectedBtnAction === CookbooksExplorerButtonAction.SELECT_COOKBOOK ||
      (selectedBtnAction === CookbooksExplorerButtonAction.VIEW_COOKBOOKS &&
        selectedCookbook));

  const initialDividerPosition = 40;

  let footerText: string | undefined = cookbooks.length
    ? `${cookbooks.length} Cookbook${cookbooks.length > 1 ? 's' : ''}`
    : '';

  if (selectedBtnAction === CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK) {
    footerText = undefined;
  }

  const miniFooterText = `${cookbooks.length - displayedCookbooksList.length} / ${footerText} Selected`;

  const windowTitle = title || getWindowSubTitle(selectedBtnAction);

  function selectItem(name: string) {
    const cookbook = cookbooks.find((epoint) => epoint.name === name);
    if (cookbook) {
      setSelectedCookbook(cookbook);
    }
  }

  function handleListItemClick(name: string) {
    return () => {
      if (selectedBtnAction === CookbooksExplorerButtonAction.VIEW_COOKBOOKS) {
        selectItem(name);
      } else if (
        selectedBtnAction === CookbooksExplorerButtonAction.SELECT_COOKBOOK
      ) {
        const clickedcookbook = cookbooks.find(
          (epoint) => epoint.name === name
        );
        if (!clickedcookbook) return;

        if (
          selectedCookbookList.findIndex((epoint) => epoint.name === name) > -1
        ) {
          setSelectedCookbooksList((prev) =>
            prev.filter((epoint) => epoint.name !== clickedcookbook.name)
          );
        } else {
          setSelectedCookbooksList((prev) => [...prev, clickedcookbook]);
        }

        if (onListItemClick) {
          onListItemClick(clickedcookbook);
          // Hide the clicked item from the list by filtering it out
          const updatedcookbooks = displayedCookbooksList.filter(
            (epoint) => epoint.name !== clickedcookbook.name
          );
          console.log(updatedcookbooks);
          setDisplayedCookbooksList(updatedcookbooks);
        }
      }
    };
  }

  function handleListItemHover(name: string) {
    return () => selectItem(name);
  }

  function handleButtonClick(action: CookbooksExplorerButtonAction) {
    setSelectedBtnAction(action);
  }

  function sortDisplayedcookbooksByName(list: Cookbook[]): Cookbook[] {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }

  async function saveNewCookbook(data: CookbookFormValues) {
    const newCookbook = {
      name: data.name,
      description: data.description,
      recipes: data.recipes,
    };
    const response = await createCookbook(newCookbook);
    if ('error' in response) {
      console.error(response.error);
      //TODO - create error visuals
      return;
    }
    setSelectedBtnAction(CookbooksExplorerButtonAction.VIEW_COOKBOOKS);
    setSelectedCookbook(newCookbook);
    setNewlyAddedCookbookName(newCookbook.name);
    refetchCookbooks();
  }

  useEffect(() => {
    if (!isLoading && cookbooks) {
      setDisplayedCookbooksList(sortDisplayedcookbooksByName(cookbooks));
    }
  }, [isLoading, cookbooks]);

  useEffect(() => {
    if (buttonAction && hideMenuButtons) {
      setSelectedBtnAction(buttonAction);
    }
  }, [buttonAction, hideMenuButtons]);

  useEffect(() => {
    if (returnedcookbook) {
      if (mini) {
        setDisplayedCookbooksList(
          sortDisplayedcookbooksByName([
            returnedcookbook,
            ...displayedCookbooksList,
          ])
        );
      }
    }
  }, [returnedcookbook]);

  useEffect(() => {
    if (newCookbookRef.current) {
      newCookbookRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [newlyAddedCookbookName, newCookbookRef.current]);

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
      {selectedBtnAction === CookbooksExplorerButtonAction.ADD_NEW_COOKBOOK ? (
        <div className="flex justify-center h-full">
          <NewCookbookFlow
            initialDividerPosition={initialDividerPosition}
            onSaveCookbook={saveNewCookbook}
          />
        </div>
      ) : null}
      {selectedBtnAction === CookbooksExplorerButtonAction.VIEW_COOKBOOKS ||
      selectedBtnAction === CookbooksExplorerButtonAction.SELECT_COOKBOOK ? (
        <>
          {isTwoPanel ? (
            <TwoPanel initialDividerPosition={initialDividerPosition}>
              <WindowList styles={{ backgroundColor: '#FFFFFF' }}>
                {displayedCookbooksList
                  ? displayedCookbooksList.map((cookbook) => (
                      <WindowList.Item
                        ref={
                          newlyAddedCookbookName === cookbook.name
                            ? newCookbookRef
                            : undefined
                        }
                        key={cookbook.name}
                        id={cookbook.name}
                        className="justify-start"
                        enableCheckbox={
                          selectedBtnAction ===
                          CookbooksExplorerButtonAction.SELECT_COOKBOOK
                        }
                        checked={
                          selectedCookbookList.findIndex(
                            (epoint) => epoint.name === cookbook.name
                          ) > -1
                        }
                        onClick={handleListItemClick(cookbook.name)}
                        onHover={
                          selectedBtnAction ===
                          CookbooksExplorerButtonAction.SELECT_COOKBOOK
                            ? handleListItemHover(cookbook.name)
                            : undefined
                        }
                        selected={
                          selectedCookbook
                            ? selectedCookbook.name === cookbook.name
                            : false
                        }>
                        <CookbookItemCard
                          cookbook={cookbook}
                          className="w-[94%]"
                        />
                      </WindowList.Item>
                    ))
                  : null}
              </WindowList>
              {selectedBtnAction ===
                CookbooksExplorerButtonAction.SELECT_COOKBOOK ||
              selectedBtnAction ===
                CookbooksExplorerButtonAction.VIEW_COOKBOOKS ? (
                <div className="flex flex-col h-full">
                  <div
                    className={`${
                      selectedBtnAction ===
                      CookbooksExplorerButtonAction.SELECT_COOKBOOK
                        ? 'h-[60%]'
                        : 'h-full'
                    } bg-white`}>
                    <WindowInfoPanel title="Cookbook Details">
                      <div className="h-full overflow-x-hidden overflow-y-auto custom-scrollbar mr-[2px]">
                        {selectedCookbook ? (
                          <div className="flex flex-col gap-6">
                            <CookbookDetailsCard cookbook={selectedCookbook} />
                          </div>
                        ) : null}
                      </div>
                    </WindowInfoPanel>
                  </div>
                  {selectedBtnAction ===
                  CookbooksExplorerButtonAction.SELECT_COOKBOOK ? (
                    <div className="h-[60%] flex items-center pt-4">
                      {selectedCookbookList.length ? (
                        <TaglabelsBox
                          cookbooks={selectedCookbookList}
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
              {displayedCookbooksList
                ? displayedCookbooksList.map((cookbook) => (
                    <WindowList.Item
                      key={cookbook.name}
                      id={cookbook.name}
                      onClick={handleListItemClick(cookbook.name)}>
                      <CookbookItemCard cookbook={cookbook} />
                    </WindowList.Item>
                  ))
                : null}
            </WindowList>
          )}
        </>
      ) : null}
    </Window>
  );
}

export { CookbooksExplorer };
