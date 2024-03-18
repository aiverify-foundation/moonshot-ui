'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { useWindowChange } from '@/app/hooks/use-window-change';
import {
  calcTopRightWindowXY,
  getWindowId,
  getWindowSizeById,
  getWindowXYById,
} from '@/app/lib/window-utils';
import { ManualRedTeaming } from '@/app/views/manual-redteaming/red-teaming-session';
import { EndpointsExplorer } from '@/app/views/models-management/endpoints-explorer';
import {
  addOpenedWindowId,
  clearWindows,
  removeOpenedWindowId,
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  setActiveResult,
  updateFocusedWindowId,
  updateWindows,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { removeActiveSession } from '@/lib/redux/slices/activeSessionSlice';
import { toggleDarkMode } from '@/lib/redux/slices/darkModeSlice';
import {
  WindowIds,
  Z_Index,
  defaultWindowWidthHeight,
  moonshotDesktopDivID,
} from './constants';
import { useResetWindows } from './hooks/useResetWindows';
import { DesktopIcon } from '@components/desktop-icon';
import Menu from '@components/menu';
import TaskBar from '@components/taskbar';
import { BenchmarkFlowWindow } from '@views/benchmarking/benchmark-flow';
import { BenchmarksResult } from '@views/benchmarking/benchmark-report';
import { CookbooksExplorer } from '@views/cookbook-management/cookbooks-explorer';
import { SessionExplorerButtonAction } from '@views/manual-redteaming/components/explorer/top-buttons-bar';
import { SessionsExplorer } from '@views/manual-redteaming/sessions-explorer';
import { ModelsExplorerButtonAction } from '@views/models-management/components/top-buttons-bar';
import { PromptTemplatesExplorer } from '@views/prompt-templates-management/prompt-templates-explorer';
import { RecipesExplorer } from '@views/recipes-management/recipes-explorer';
import { StatusPanel } from '@views/status-panel/status-panel';

export default function MoonshotDesktop() {
  const [isCookbooksExplorerOpen, setIsCookbooksExplorerOpen] = useState(false);
  const [isChatSessionOpen, setIsChatSessionOpen] = useState(false);
  const [isRecipesExplorerOpen, setIsRecipesExplorerOpen] = useState(false);
  const [isShowWindowSavedSession, setIsShowWindowSavedSession] =
    useState(false);
  const [isDesktopIconsHidden, setIsDesktopIconsHidden] = useState(false);
  const dispatch = useAppDispatch();
  const resetWindows = useResetWindows();
  const resetWindowsCentered = useResetWindows(false);
  const handleOnWindowChange = useWindowChange();
  const windowsMap = useAppSelector((state) => state.windows.map);
  const isDarkMode = useAppSelector((state) => state.darkMode.value);
  const activeResult = useAppSelector((state) => state.activeResult.value);
  const openedWindowIds = useAppSelector(
    (state) => state.windows.openedWindowIds
  );
  const backgroundImageStyle = !isDarkMode
    ? {
        backgroundImage: 'url("/pink-bg-fade5.png")',
        backgroundBlendMode: 'multiply',
        backgroundSize: 'cover',
      }
    : {
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/dark-denim-3.png"), linear-gradient(to right bottom, rgb(113 112 112), rgb(34 34 34))',
      };

  function handleResumeSessionClick() {
    dispatch(clearWindows());
    dispatch(addOpenedWindowId(getWindowId(WindowIds.RED_TEAMING_SESSION)));
  }

  function handleModelEndpointIconClick() {
    dispatch(addOpenedWindowId(getWindowId(WindowIds.LLM_ENDPOINTS)));
    dispatch(updateFocusedWindowId(getWindowId(WindowIds.LLM_ENDPOINTS)));
  }

  function handleBenchmarkFlowCloseClick() {
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.BENCHMARKING)));
    dispatch(resetBenchmarkModels());
    dispatch(resetBenchmarkCookbooks());
  }

  function handleModelsExplorerCloseClick() {
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.LLM_ENDPOINTS)));
  }

  function handleSavedSessionsCloseClick() {
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.SAVED_SESSIONS)));
    dispatch(resetBenchmarkModels());
  }

  function handleSessionFormCloseClick() {
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.SESSION_FORM)));
    dispatch(resetBenchmarkModels());
  }

  function handlePromptTemplatesExplorerCloseClick() {
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.PROMPT_TEMPLATES)));
  }

  function handleStatusPanelCloseClick() {
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.STATUS)));
  }

  function handleResultCloseClick() {
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.RESULT)));
  }

  function handleManualRedteamingSessionCloseClick() {
    setIsChatSessionOpen(false);
    dispatch(removeActiveSession());
    dispatch(removeOpenedWindowId(getWindowId(WindowIds.RED_TEAMING_SESSION)));
    setIsDesktopIconsHidden(false);
  }

  function handleToggleDarkMode() {
    dispatch(toggleDarkMode());
    document.documentElement.classList.toggle('dark');
  }

  useEffect(() => {
    if (!openedWindowIds.length) return;
    if (openedWindowIds.includes(getWindowId(WindowIds.RED_TEAMING_SESSION))) {
      setIsShowWindowSavedSession(false);
      setIsDesktopIconsHidden(true);
      setIsChatSessionOpen(true);
    }
  }, [openedWindowIds]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    //set default window dimensions
    //position will be centralized with small random offsets to left/top positions on screen
    resetWindows(
      WindowIds.COOKBOOKS,
      WindowIds.COOKBOOKS_PICKER,
      WindowIds.RECIPES,
      WindowIds.RECIPES_PICKER,
      WindowIds.LLM_ENDPOINTS_PICKER,
      WindowIds.SAVED_SESSIONS,
      WindowIds.BENCHMARKING,
      WindowIds.PROMPT_TEMPLATES,
      WindowIds.STATUS
    );

    //position will be centralized without any offsets
    resetWindowsCentered(
      WindowIds.RESULT,
      WindowIds.SESSION_FORM,
      WindowIds.LLM_ENDPOINTS
    );

    //custom position for status panel
    const [statusPanelX, statusPanelY] = calcTopRightWindowXY(
      defaultWindowWidthHeight[WindowIds.STATUS][0],
      defaultWindowWidthHeight[WindowIds.STATUS][1],
      -50,
      50
    );
    dispatch(
      updateWindows({
        [getWindowId(WindowIds.STATUS)]: [
          statusPanelX,
          statusPanelY,
          defaultWindowWidthHeight[WindowIds.STATUS][0],
          defaultWindowWidthHeight[WindowIds.STATUS][1],
          0,
        ],
      })
    );
  }, []);

  useEffect(() => {
    handleModelEndpointIconClick();
  }, []);

  return (
    <div
      id={moonshotDesktopDivID}
      className={`
        h-screen overflow-y-hidden
        flex flex-col bg-fuchsia-100
        ${
          !isDarkMode
            ? `
          bg-gradient-to-br bg-no-repeat bg-right
          from-fuchsia-100 to-fuchsia-400`
            : ''
        }
      `}
      style={{
        ...backgroundImageStyle,
      }}>
      <TaskBar zIndex={Z_Index.Top}>
        <div className="flex w-full">
          <div className="flex-1">
            <Menu />
          </div>
          <div className="flex flex-1 justify-end items-center pr-4">
            <Icon
              name={isDarkMode ? IconName.LightSun : IconName.DarkMoon}
              size={isDarkMode ? 20 : 22}
              onClick={handleToggleDarkMode}
            />
          </div>
        </div>
      </TaskBar>
      {!isDesktopIconsHidden ? (
        <div
          id="desktopIcons"
          className="flex pt-10"
          style={{ zIndex: Z_Index.Level_1 }}>
          <div className="grid grid-rows-6 grid-cols-10 grid-flow-col p-10 gap-y-12 gap-x-4">
            <DesktopIcon
              name={IconName.SolidBox}
              label="Models"
              onClick={handleModelEndpointIconClick}
            />
            <DesktopIcon
              name={IconName.Folder}
              label="Cookbooks"
              onClick={() => {
                setIsCookbooksExplorerOpen(true);
                dispatch(
                  updateFocusedWindowId(getWindowId(WindowIds.COOKBOOKS))
                );
              }}
            />
            <DesktopIcon
              name={IconName.Folder}
              label="Recipes"
              onClick={() => {
                setIsRecipesExplorerOpen(true);
                dispatch(updateFocusedWindowId(getWindowId(WindowIds.RECIPES)));
              }}
            />
            <DesktopIcon
              name={IconName.Folder}
              label="Prompt Templates"
              onClick={() => {
                dispatch(
                  addOpenedWindowId(getWindowId(WindowIds.PROMPT_TEMPLATES))
                );
                dispatch(
                  updateFocusedWindowId(getWindowId(WindowIds.PROMPT_TEMPLATES))
                );
              }}
            />
            <DesktopIcon
              name={IconName.Folder}
              label="Saved Sessions"
              onClick={() => {
                dispatch(
                  addOpenedWindowId(getWindowId(WindowIds.SAVED_SESSIONS))
                );
                dispatch(
                  updateFocusedWindowId(getWindowId(WindowIds.SAVED_SESSIONS))
                );
              }}
            />
            <DesktopIcon
              name={IconName.Folder}
              label="Status"
              onClick={() => {
                dispatch(addOpenedWindowId(getWindowId(WindowIds.STATUS)));
                dispatch(updateFocusedWindowId(getWindowId(WindowIds.STATUS)));
              }}
            />
          </div>
        </div>
      ) : null}

      {isCookbooksExplorerOpen ? (
        <CookbooksExplorer
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.COOKBOOKS)}
          initialXY={getWindowXYById(windowsMap, WindowIds.COOKBOOKS)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.COOKBOOKS)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={() => setIsCookbooksExplorerOpen(false)}
        />
      ) : null}

      {isRecipesExplorerOpen ? (
        <RecipesExplorer
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.RECIPES)}
          initialXY={getWindowXYById(windowsMap, WindowIds.RECIPES)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.RECIPES)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={() => setIsRecipesExplorerOpen(false)}
        />
      ) : null}

      {isChatSessionOpen ? (
        <ManualRedTeaming
          zIndex={Z_Index.Level_2}
          onCloseBtnClick={handleManualRedteamingSessionCloseClick}
        />
      ) : null}

      {openedWindowIds.includes(getWindowId(WindowIds.LLM_ENDPOINTS)) ? (
        <EndpointsExplorer
          zIndex={Z_Index.Level_2}
          buttonAction={ModelsExplorerButtonAction.SELECT_MODELS}
          windowId={getWindowId(WindowIds.LLM_ENDPOINTS)}
          initialXY={getWindowXYById(windowsMap, WindowIds.LLM_ENDPOINTS)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.LLM_ENDPOINTS)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={handleModelsExplorerCloseClick}
        />
      ) : null}

      {openedWindowIds.includes(getWindowId(WindowIds.PROMPT_TEMPLATES)) ? (
        <PromptTemplatesExplorer
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.PROMPT_TEMPLATES)}
          initialXY={getWindowXYById(windowsMap, WindowIds.PROMPT_TEMPLATES)}
          initialSize={getWindowSizeById(
            windowsMap,
            WindowIds.PROMPT_TEMPLATES
          )}
          onWindowChange={handleOnWindowChange}
          onCloseClick={handlePromptTemplatesExplorerCloseClick}
        />
      ) : null}

      {openedWindowIds.includes(getWindowId(WindowIds.SAVED_SESSIONS)) ? (
        <SessionsExplorer
          zIndex={Z_Index.Level_2}
          buttonAction={SessionExplorerButtonAction.VIEW}
          windowId={getWindowId(WindowIds.SAVED_SESSIONS)}
          initialXY={getWindowXYById(windowsMap, WindowIds.SAVED_SESSIONS)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.SAVED_SESSIONS)}
          onCloseClick={handleSavedSessionsCloseClick}
          onResumeSessionClick={handleResumeSessionClick}
          onWindowChange={handleOnWindowChange}
        />
      ) : null}

      {openedWindowIds.includes(getWindowId(WindowIds.SESSION_FORM)) ? (
        <SessionsExplorer
          zIndex={Z_Index.Level_2}
          buttonAction={SessionExplorerButtonAction.ADD}
          windowId={getWindowId(WindowIds.SESSION_FORM)}
          initialXY={getWindowXYById(windowsMap, WindowIds.SESSION_FORM)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.SESSION_FORM)}
          onCloseClick={handleSessionFormCloseClick}
          onResumeSessionClick={handleResumeSessionClick}
          onWindowChange={handleOnWindowChange}
        />
      ) : null}

      {openedWindowIds.includes(getWindowId(WindowIds.BENCHMARKING)) ? (
        <BenchmarkFlowWindow
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.BENCHMARKING)}
          initialXY={getWindowXYById(windowsMap, WindowIds.BENCHMARKING)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.BENCHMARKING)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={handleBenchmarkFlowCloseClick}
        />
      ) : null}

      {openedWindowIds.includes(getWindowId(WindowIds.STATUS)) ? (
        <StatusPanel
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.STATUS)}
          initialXY={getWindowXYById(windowsMap, WindowIds.STATUS)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.STATUS)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={handleStatusPanelCloseClick}
        />
      ) : null}

      {openedWindowIds.includes(getWindowId(WindowIds.RESULT)) &&
      activeResult != undefined ? (
        <BenchmarksResult
          zIndex={Z_Index.Level_2}
          benchmarkId={activeResult}
          windowId={getWindowId(WindowIds.RESULT)}
          initialXY={getWindowXYById(windowsMap, WindowIds.RESULT)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.RESULT)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={handleResultCloseClick}
        />
      ) : null}

      {!isDesktopIconsHidden ? (
        <Image
          src="/moonshot_glow.png"
          alt="Moonshot"
          width={400}
          height={80}
          style={{
            position: 'absolute',
            bottom: 50,
            right: -40,
            zIndex: Z_Index.Base,
          }}
        />
      ) : null}
    </div>
  );
}
