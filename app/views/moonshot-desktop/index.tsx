'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { useWindowChange } from '@/app/hooks/use-window-change';
import {
  getWindowId,
  getWindowSizeById,
  getWindowXYById,
} from '@/app/lib/window-utils';
import { useCreateSessionMutation } from '@/app/services/session-api-service';
import { ManualRedTeaming } from '@/app/views/manual-redteaming/red-teaming-session';
import { EndpointsExplorer } from '@/app/views/models-management/endpoints-explorer';
import {
  addOpenedWindowId,
  removeOpenedWindowId,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { removeActiveSession } from '@/lib/redux/slices/activeSessionSlice';
import { toggleDarkMode } from '@/lib/redux/slices/darkModeSlice';
import { WindowIds, Z_Index, moonshotDesktopDivID } from './constants';
import { useResetWindows } from './hooks/useResetWindows';
import { DesktopIcon } from '@components/desktop-icon';
import Menu from '@components/menu';
import TaskBar from '@components/taskbar';
import { CookbooksExplorer } from '@views/cookbook-management/cookbooks-explorer';
import { SessionExplorerButtonAction } from '@views/manual-redteaming/components/explorer/top-buttons-bar';
import { SessionsExplorer } from '@views/manual-redteaming/sessions-explorer';

export default function MoonshotDesktop() {
  const [isCookbooksExplorerOpen, setIsCookbooksExplorerOpen] = useState(false);
  const [isChatSessionOpen, setIsChatSessionOpen] = useState(false);
  const [isEndpointsExplorerOpen, setIsEndpointsExplorerOpen] = useState(false);
  const [isShowWindowSavedSession, setIsShowWindowSavedSession] =
    useState(false);
  const [isDesktopIconsHidden, setIsDesktopIconsHidden] = useState(false);
  const dispatch = useAppDispatch();
  const resetWindows = useResetWindows();
  const handleOnWindowChange = useWindowChange();
  const windowsMap = useAppSelector((state) => state.windows.map);
  const isDarkMode = useAppSelector((state) => state.darkMode.value);
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
  const [
    createSession,
    {
      data: newSession,
      isLoading: createSessionIsLoding,
      error: createSessionError,
    },
  ] = useCreateSessionMutation();

  function handleResumeSessionClick() {
    dispatch(addOpenedWindowId(getWindowId(WindowIds.RED_TEAMING_SESSION)));
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
    resetWindows(
      WindowIds.COOKBOOKS,
      WindowIds.LLM_ENDPOINTS,
      WindowIds.LLM_ENDPOINTS_PICKER,
      WindowIds.SAVED_SESSIONS,
      WindowIds.CREATE_SESSION
    );
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
              name={IconName.Folder}
              label="Cookbooks"
              onClick={() => setIsCookbooksExplorerOpen(true)}
            />
            <DesktopIcon
              name={IconName.Folder}
              label="Recipes"
            />
            <DesktopIcon
              name={IconName.Folder}
              label="LLM Endpoints"
              onClick={() => setIsEndpointsExplorerOpen(true)}
            />
            <DesktopIcon
              name={IconName.Folder}
              label="Prompt Templates"
            />
            <DesktopIcon
              name={IconName.RunCookbook}
              label="Run Cookbook"
              onClick={() => null}
            />
            <DesktopIcon
              name={IconName.FolderForChatSessions}
              label="Saved Sessions"
              onClick={() => setIsShowWindowSavedSession(true)}
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

      {isChatSessionOpen ? (
        <ManualRedTeaming
          zIndex={Z_Index.Level_2}
          onCloseBtnClick={handleManualRedteamingSessionCloseClick}
        />
      ) : null}

      {isEndpointsExplorerOpen ? (
        <EndpointsExplorer
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.LLM_ENDPOINTS)}
          initialXY={getWindowXYById(windowsMap, WindowIds.LLM_ENDPOINTS)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.LLM_ENDPOINTS)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={() => setIsEndpointsExplorerOpen(false)}
        />
      ) : null}

      {isShowWindowSavedSession ? (
        <SessionsExplorer
          zIndex={Z_Index.Level_2}
          buttonAction={SessionExplorerButtonAction.VIEW}
          windowId={getWindowId(WindowIds.SAVED_SESSIONS)}
          initialXY={getWindowXYById(windowsMap, WindowIds.SAVED_SESSIONS)}
          initialSize={getWindowSizeById(windowsMap, WindowIds.SAVED_SESSIONS)}
          onCloseClick={() => setIsShowWindowSavedSession(false)}
          onResumeSessionClick={handleResumeSessionClick}
          onWindowChange={handleOnWindowChange}
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
