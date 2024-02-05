'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Icon, IconName } from '@/app/components/IconSVG';
import { CodeEditor } from '@/app/components/code-editor';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import {
  removeActiveSession,
  setActiveSession,
} from '@/lib/redux/slices/activeSessionSlice';
import { toggleDarkMode } from '@/lib/redux/slices/darkModeSlice';
import { FileExplorerSavedSessions } from './components/file-explorer-saved-sessions';
import { WindowCreateSession } from './components/window-create-session';
import {
  useCreateSessionMutation,
  useLazySetActiveSessionQuery,
} from './services/session-api-service';
import { DesktopIcon } from '@components/desktop-icon';
import Menu from '@components/menu';
import TaskBar from '@components/taskbar';
import { Window } from '@components/window';
import { ActiveChatSession } from '@views/active-chat-session/active-chat-session';
import { FileExplorerEndpoints } from './components/file-explorer-endpoints';
import {
  getWindowId,
  getWindowScrollTop,
  getWindowSize,
  getWindowXY,
} from '@/app/lib/window';
import { useWindowChange } from '@/app/hooks/use-window-change';
import { WindowIds } from './constants';
import { updateWindows } from '@/lib/redux/slices/windowsSlice';

const legalSummarisation = {
  name: 'Legal Summarisation',
  description:
    'This cookbook runs general capabilitiy benchmark on legal summarisation model.',
  recipes: [
    'analogical-similarity',
    'auto-categorisation',
    'cause-and-effect-one-sentence',
    'cause-and-effect-two-sentence',
    'contextual-parametric-knowledge-conflicts',
    'coqa-conversational-qna',
    'gre-reading-comprehension',
    'squad_shifts-tnf',
    'sg-legal-glossary',
    'sg-university-tutorial-questions-legal',
  ],
};

export default function MoonshotDesktop() {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isChatSessionOpen, setIsChatSessionOpen] = useState(false);
  const [isEndpointsExplorerOpen, setIsEndpointsExplorerOpen] =
    useState(false);
  const [isShowWindowCreateSession, setIsShowWindowCreateSession] =
    useState(false);
  const [isShowWindowSavedSession, setIsShowWindowSavedSession] =
    useState(false);
  const [isShowPromptTemplates, setIsShowPromptTemplates] =
    useState(false);
  const [isShowPromptPreview, setIsShowPromptPreview] =
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
        'url("https://www.transparenttextures.com/patterns/dark-denim-3.png"), linear-gradient(to bottom right, #595858, #090909)',
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
    if (response.data) {
      const activeSessionResponse = await triggerSetActiveSession(
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
    setIsDesktopIconsHidden(false)
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
    const defaults: Record<string, WindowData> = {};
    defaults[getWindowId(WindowIds.LLM_ENDPOINTS)] = [
      600, 200, 820, 470, 0,
    ];
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
      <TaskBar>
        <div className="flex w-full">
          <div className="flex-1">
            <Menu />
          </div>
          <div className="flex flex-1 justify-end items-center pr-4">
            <Icon
              name={
                isDarkMode ? IconName.LightSun : IconName.DarkMoon
              }
              size={isDarkMode ? 20 : 22}
              onClick={handleToggleDarkMode}
            />
          </div>
        </div>
      </TaskBar>
      {!isDesktopIconsHidden ?
        <div className="flex pt-10">
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
        </div> : null}

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
          onCloseClick={() => setIsShowWindowCreateSession(false)}
          onStartClick={startNewSession}
        />
      ) : null}

      {isChatSessionOpen ? (
        <ActiveChatSession
          onCloseBtnClick={handlePromptWindowCloseClick}
        />
      ) : null}

      {isEndpointsExplorerOpen ? (
        <FileExplorerEndpoints
          windowId={getWindowId(WindowIds.LLM_ENDPOINTS)}
          initialXY={getWindowXY(windowsMap, WindowIds.LLM_ENDPOINTS)}
          initialSize={getWindowSize(
            windowsMap,
            WindowIds.LLM_ENDPOINTS
          )}
          onWindowChange={handleOnWindowChange}
          onCloseClick={() => setIsEndpointsExplorerOpen(false)}
        />
      ) : null}

      {isShowWindowSavedSession ? (
        <FileExplorerSavedSessions
          onCloseClick={() => setIsShowWindowSavedSession(false)}
          onContinueSessionClick={handleContinueSessionClick}
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
          right: 0,
          zIndex: 1,
        }}
      />

      {isShowPromptTemplates ? (
        <Window
          id="prompt-templates"
          styles={{ width: 800 }}
          name="Prompt Templates"
          initialXY={[950, 370]}
          onCloseClick={() => setIsShowPromptTemplates(false)}>
          <div style={{ display: 'flex' }}>
            <ul style={{ color: '#494848', padding: 15 }}>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}
                onClick={() => setIsShowPromptPreview(true)}>
                advglue-templatemnli
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                advglue-templateqnli
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                advglue-templateqqp
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                advglue-templaterte
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                advglue-templatesst2
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                analogical-similarity
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                auto-categorisation
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                bbq-template1
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                cause-and-effect-one-sentence
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                cause-and-effect-two-sentence
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                contextual-parametric-knowledge-conflicts
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                coqa-conversational-question-answering
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                enronemail-templatea
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                enronemail-templateb
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                enronemail-templatec
              </li>
              <li
                style={{
                  borderBottom: '1px solid #dbdada',
                  cursor: 'pointer',
                }}>
                enronemail-templated
              </li>
            </ul>
            {isShowPromptPreview ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: 15,
                }}>
                <h2
                  style={{
                    marginTop: 20,
                    color: '#000',
                    marginBottom: 10,
                  }}>
                  advglue-templatemnli
                </h2>

                <div style={{ fontSize: 14, color: 'gray' }}>
                  This template is used for the MNLI dataset. Given a
                  premise sentence and a hypothesis sentence, the task
                  is to predict whether the premise entails the
                  hypothesis.
                </div>
                <h4
                  style={{
                    marginTop: 20,
                    color: '#000',
                    marginBottom: 10,
                  }}>
                  Template
                </h4>
                <div style={{ fontSize: 14, color: 'gray' }}>
                  &quot;&#123;&#123;prompt&#125;&#125;&quot; Please
                  identify whether the premise entails the hypothesis.
                  The answer should be exactly &apos;yes&apos; or
                  &apos;no&apos;, without capitalization.
                </div>
              </div>
            ) : null}
          </div>
        </Window>
      ) : null}
    </div>
  );
}
