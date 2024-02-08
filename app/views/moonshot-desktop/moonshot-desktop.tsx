'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Icon, IconName } from '@/app/components/IconSVG';
import { useWindowChange } from '@/app/hooks/use-window-change';
import {
  getWindowId,
  getWindowSize,
  getWindowXY,
} from '@/app/lib/window';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import {
  removeActiveSession,
  setActiveSession,
} from '@/lib/redux/slices/activeSessionSlice';
import { toggleDarkMode } from '@/lib/redux/slices/darkModeSlice';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';
import { FileExplorerEndpoints } from './components/file-explorer-endpoints';
import { FileExplorerSavedSessions } from './components/file-explorer-saved-sessions';
import { WindowCreateSession } from './components/window-create-session';
import { WindowIds, Z_Index } from './constants';
import {
  useCreateSessionMutation,
  useLazySetActiveSessionQuery,
} from './services/session-api-service';
import { DesktopIcon } from '@components/desktop-icon';
import Menu from '@components/menu';
import TaskBar from '@components/taskbar';
import { Window } from '@components/window';
import { ActiveChatSession } from '@views/active-chat-session/active-chat-session';

export default function MoonshotDesktop() {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isChatSessionOpen, setIsChatSessionOpen] = useState(false);
  const [isEndpointsExplorerOpen, setIsEndpointsExplorerOpen] = useState(false);
  const [isShowWindowCreateSession, setIsShowWindowCreateSession] =
    useState(false);
  const [isShowWindowSavedSession, setIsShowWindowSavedSession] =
    useState(false);
  const [isDesktopIconsHidden, setIsDesktopIconsHidden] = useState(false);
  const [triggerSetActiveSession] = useLazySetActiveSessionQuery();
  const dispatch = useAppDispatch();
  const handleOnWindowChange = useWindowChange();
  const windowsMap = useAppSelector((state) => state.windows.map);
  const isDarkMode = useAppSelector((state) => state.darkMode.value);
  const backgroundImageStyle = !isDarkMode
    ? {
      backgroundImage: 'url("/pink-bg-fade3.png")',
      backgroundBlendMode: 'multiply',
    }
    : {
      backgroundImage:
        'url("https://www.transparenttextures.com/patterns/dark-denim-3.png"), linear-gradient(to bottom right, #454545, #0e0e0e)',
    };
  const [
    createSession,
    {
      data: newSession,
      isLoading: createSessionIsLoding,
      error: createSessionError,
    },
  ] = useCreateSessionMutation();

  async function startNewSession(
    name: string,
    description: string,
    endpoints: string[]
  ) {
    const response = await createSession({
      name,
      description,
      endpoints,
    });
    //@ts-ignore
    if (response.data) {
      const activeSessionResponse = await triggerSetActiveSession(
        //@ts-ignore
        response.data.session_id
      );
      if (activeSessionResponse.data) {
        dispatch(setActiveSession(activeSessionResponse.data));
        setIsShowWindowCreateSession(false);
        setIsChatSessionOpen(true);
        setIsDesktopIconsHidden(true);
      }
    } // todo - else and error handling
  }

  function handleContinueSessionClick() {
    setIsShowWindowSavedSession(false);
    setIsChatSessionOpen(true);
    setIsDesktopIconsHidden(true);
  }

  function handlePromptWindowCloseClick() {
    setIsChatSessionOpen(false);
    dispatch(removeActiveSession());
    setIsDesktopIconsHidden(false);
  }

  function handleToggleDarkMode() {
    dispatch(toggleDarkMode());
    document.documentElement.classList.toggle('dark');
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    //set default window dimensions
    const defaultExplorerWindowDimensions: WindowData = [600, 200, 820, 470, 0];
    const defaults: Record<string, WindowData> = {};
    defaults[getWindowId(WindowIds.LLM_ENDPOINTS)] =
      defaultExplorerWindowDimensions;
    defaults[getWindowId(WindowIds.SAVED_SESSIONS)] =
      defaultExplorerWindowDimensions;
    defaults[getWindowId(WindowIds.CREATE_SESSION)] =
      defaultExplorerWindowDimensions;
    dispatch(updateWindows(defaults));
  }, []);

  return (
    <div
      className={`
        h-screen overflow-y-hidden
        flex flex-col bg-fuchsia-100
        ${!isDarkMode
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
              onClick={() => setIsWindowOpen(true)}
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
              name={IconName.ChatBubbles}
              label="RedTeaming"
              size={40}
              onClick={() => setIsShowWindowCreateSession(true)}
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

      {isWindowOpen ? (
        <Window
          id="cookbooks"
          name="Cookbooks"
          onCloseClick={() => setIsWindowOpen(false)}>
          <ul style={{ color: '#494848', padding: 15 }}>
            <li
              style={{
                borderBottom: '1px solid #dbdada',
                cursor: 'pointer',
              }}
              onClick={() => null}>
              legal-summarisation.json
            </li>
            <li
              style={{
                borderBottom: '1px solid #dbdada',
                cursor: 'pointer',
              }}>
              bbq-lite-age-cookbook.json
            </li>
            <li
              style={{
                borderBottom: '1px solid #dbdada',
                cursor: 'pointer',
              }}>
              evaluation-catalogue-cookbook.json
            </li>
          </ul>
        </Window>
      ) : null}

      {isShowWindowCreateSession ? (
        <WindowCreateSession
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.CREATE_SESSION)}
          initialXY={getWindowXY(windowsMap, WindowIds.CREATE_SESSION)}
          initialSize={getWindowSize(windowsMap, WindowIds.CREATE_SESSION)}
          onCloseClick={() => setIsShowWindowCreateSession(false)}
          onStartClick={startNewSession}
          onWindowChange={handleOnWindowChange}
        />
      ) : null}

      {isChatSessionOpen ? (
        <ActiveChatSession
          zIndex={Z_Index.Level_2}
          onCloseBtnClick={handlePromptWindowCloseClick}
        />
      ) : null}

      {isEndpointsExplorerOpen ? (
        <FileExplorerEndpoints
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.LLM_ENDPOINTS)}
          initialXY={getWindowXY(windowsMap, WindowIds.LLM_ENDPOINTS)}
          initialSize={getWindowSize(windowsMap, WindowIds.LLM_ENDPOINTS)}
          onWindowChange={handleOnWindowChange}
          onCloseClick={() => setIsEndpointsExplorerOpen(false)}
        />
      ) : null}

      {isShowWindowSavedSession ? (
        <FileExplorerSavedSessions
          zIndex={Z_Index.Level_2}
          windowId={getWindowId(WindowIds.SAVED_SESSIONS)}
          initialXY={getWindowXY(windowsMap, WindowIds.SAVED_SESSIONS)}
          initialSize={getWindowSize(windowsMap, WindowIds.SAVED_SESSIONS)}
          onCloseClick={() => setIsShowWindowSavedSession(false)}
          onContinueSessionClick={handleContinueSessionClick}
          onWindowChange={handleOnWindowChange}
        />
      ) : null}

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
    </div>
  );
}
