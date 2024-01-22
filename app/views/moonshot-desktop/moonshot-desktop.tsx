'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import { Window } from '@components/window';
import { WindowCreateSession } from './window-create-session';
import { BoxPrompt } from './box-prompt';
import TaskBar from '@components/taskbar';
import Menu from '@components/menu';
import FolderIcon from '@components/folder-icon';
import JSONEditor from '@components/json-editor';
import Icon from '@components/icon';
import { useCreateSessionMutation, useSendPromptMutation } from './services/session-api-service';
import { WindowSavedSessions } from './window-saved-sessions';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { ChatWindow } from './window-chatbox';
import { lerp } from '@/app/lib/math-helpers';
import {
  removeActiveSession,
  setActiveSession,
  updateChatHistory,
} from '@/lib/redux/slices/activeSessionSlice';

const legalSummarisation = {
  name: 'Legal Summarisation',
  description: 'This cookbook runs general capabilitiy benchmark on legal summarisation model.',
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

type SessionTaskProps = {
  name: string;
};

function SessionTask(props: SessionTaskProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 200,
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: '39px',
        width: 130,
        fontSize: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        color: '#FFF',
      }}>
      <Image
        src="icons/chat_icon_white.svg"
        alt="cookbooks"
        width={20}
        height={20}
        style={{
          cursor: 'pointer',
        }}
      />
      <div>Session 1</div>
    </div>
  );
}

export default function MoonshotDesktop() {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [isChatSessionOpen, setIsChatSessionOpen] = useState(false);
  const [isChatPromptOpen, setIsChatPromptOpen] = useState(false);
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
  const [isShowWindowCreateSession, setIsShowWindowCreateSession] = useState(false);
  const [isShowWindowSavedSession, setIsShowWindowSavedSession] = useState(false);
  const [isTransitionPrompt, setIsTransitionPrompt] = useState(false);
  const [isShowPromptTemplates, setIsShowPromptTemplates] = useState(false);
  const [isShowPromptPreview, setIsShowPromptPreview] = useState(false);
  const [windowPositions, setWindowPositions] = useState<Record<string, [number, number]>>({});
  const activeSessionChatHistory = useAppSelector((state) => state.activeSession.entity);
  const dispatch = useAppDispatch();
  const [
    sendPrompt,
    { data: updatedSessionChatHistory, isLoading: sendPromptIsLoading, error: sendPromptError },
  ] = useSendPromptMutation();
  const [
    createSession,
    { data: newSession, isLoading: createSessionIsLoding, error: createSessionError },
  ] = useCreateSessionMutation();

  async function startNewSession(name: string, description: string, endpoints: string[]) {
    const response = await createSession({
      name,
      description,
      endpoints,
    });
    dispatch(setActiveSession(response.data));
    setIsShowWindowCreateSession(false);
    setIsTransitionPrompt(true);
    setIsChatPromptOpen(true);
  }

  function handleContinueSessionClick() {
    setIsShowWindowSavedSession(false);
    setIsTransitionPrompt(true);
    setIsChatPromptOpen(true);
  }

  function handlePromptWindowCloseClick() {
    setIsChatPromptOpen(false);
    setIsChatSessionOpen(false);
    dispatch(removeActiveSession());
  }

  function handleSendPromptClick(message: string) {
    if (!activeSessionChatHistory) return;
    sendPrompt({
      prompt: message,
      session_id: activeSessionChatHistory.session_id,
    });
  }

  function handleOnWindowDragDrop(x: number, y: number, windowId: string) {
    setWindowPositions((prev) => ({
      ...prev,
      [windowId]: [x, y],
    }));
  }

  useEffect(() => {
    if (!updatedSessionChatHistory) return;
    dispatch(updateChatHistory(updatedSessionChatHistory));
  }, [updatedSessionChatHistory, dispatch]);

  useEffect(() => {
    if (isChatPromptOpen) {
      setIsTransitionPrompt(true);
      setTimeout(() => {
        setIsChatSessionOpen(true);
      }, 1000);
    }
  }, [isChatPromptOpen]);

  function ChatBoxes() {
    const chatBoxRefs = useRef<HTMLDivElement[]>([]);
    const isZKeyPressed = useRef(false);
    // Function to synchronize scrolling
    const syncScroll = (deltaY: number) => {
      chatBoxRefs.current.forEach((ref) => {
        if (ref) {
          ref.scrollTop += deltaY * 0.2;
        }
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.key.toLowerCase() === 'z') {
        isZKeyPressed.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'z') {
        isZKeyPressed.current = false;
      }
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (isZKeyPressed.current !== undefined && isZKeyPressed.current === true) {
        syncScroll(e.deltaY);
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    
    if (activeSessionChatHistory === undefined) return null;
    return activeSessionChatHistory.chats.map((id, index) => {
      const viewportWidth = window.innerWidth;
      const leftPos = lerp(0, viewportWidth, index / activeSessionChatHistory.chats.length) + 250;
      const initialXY = windowPositions[`win_${id}`] || [leftPos, 70];

      return (
        <ChatWindow.ChatBox
          ref={(el) => (chatBoxRefs.current[index] = el as HTMLDivElement)}
          windowId={`win_${id}`}
          key={id}
          name={id}
          initialXY={initialXY}
          onCloseClick={() => null}
          onDrop={handleOnWindowDragDrop}
          onWheel={handleWheel}>
          {!activeSessionChatHistory.chat_history
            ? null
            : activeSessionChatHistory.chat_history[id].map((dialogue, index) => {
                return (
                  <div
                    key={index}
                    style={{ display: 'flex', flexDirection: 'column', paddingRight: 10 }}>
                    <ChatWindow.TalkBubble backgroundColor="#a3a3a3" fontColor="#FFF">
                      {dialogue.prepared_prompt}
                    </ChatWindow.TalkBubble>
                    <ChatWindow.TalkBubble
                      backgroundColor="#3498db"
                      fontColor="#FFF"
                      styles={{ textAlign: 'right', alignSelf: 'flex-end' }}>
                      {dialogue.predicted_result}
                    </ChatWindow.TalkBubble>
                  </div>
                );
              })}
          {sendPromptIsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 15 }}>
              <ChatWindow.LoadingAnimation />
            </div>
          ) : null}
        </ChatWindow.ChatBox>
      );
    });
  }

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/dark-denim-3.png"), linear-gradient(to bottom right, #434343, black)',
      }}>
      <TaskBar>
        <Menu />
      </TaskBar>

      {isChatSessionOpen ? <SessionTask /> : null}

      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: 150,
          }}>
          <FolderIcon name="Cookbooks" onClick={() => setIsWindowOpen(true)} />
          <FolderIcon name="Recipes" />
          <FolderIcon name="Endpoints" />
          <FolderIcon name="Prompt Templates" />
          <Icon name="Run Cookbook" iconPath="icons/run_icon_white.svg" />
          <Icon
            name="New Session"
            iconPath="icons/chat_icon_white.svg"
            onClick={() => setIsShowWindowCreateSession(true)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            width: 150,
          }}>
          <Icon
            width={50}
            height={50}
            gapSize={0}
            name="Saved Sessions"
            iconPath="icons/folder_saved.svg"
            onClick={() => setIsShowWindowSavedSession(true)}
          />
        </div>
      </div>

      {isWindowOpen ? (
        <Window name="Cookbooks" onCloseClick={() => setIsWindowOpen(false)}>
          <ul style={{ color: '#494848', padding: 15 }}>
            <li
              style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer' }}
              onClick={() => setIsJsonEditorOpen(true)}>
              legal-summarisation.json
            </li>
            <li style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer' }}>
              bbq-lite-age-cookbook.json
            </li>
            <li style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer' }}>
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
      {isChatSessionOpen ? <ChatBoxes /> : null}

      {isChatPromptOpen ? (
        <BoxPrompt
          styles={{
            opacity: isTransitionPrompt ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
          name="Prompt"
          onPromptTemplateClick={() => {
            setIsShowPromptTemplates(true);
          }}
          onCloseClick={handlePromptWindowCloseClick}
          onSendClick={handleSendPromptClick}
        />
      ) : null}

      {isJsonEditorOpen ? (
        <Window
          name="legal-summarisation.json"
          initialXY={[800, 300]}
          onCloseClick={() => setIsJsonEditorOpen(false)}
          styles={{
            width: 510,
            zIndex: 100,
          }}>
          <JSONEditor placeholder={legalSummarisation} />
        </Window>
      ) : null}

      {isShowWindowSavedSession ? (
        <WindowSavedSessions
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
        }}
      />

      {isShowPromptTemplates ? (
        <Window
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
                <h2 style={{ marginTop: 20, color: '#000', marginBottom: 10 }}>
                  advglue-templatemnli
                </h2>

                <div style={{ fontSize: 14, color: 'gray' }}>
                  This template is used for the MNLI dataset. Given a premise sentence and a
                  hypothesis sentence, the task is to predict whether the premise entails the
                  hypothesis.
                </div>
                <h4 style={{ marginTop: 20, color: '#000', marginBottom: 10 }}>Template</h4>
                <div style={{ fontSize: 14, color: 'gray' }}>
                  &quot;&#123;&#123;prompt&#125;&#125;&quot; Please identify whether the premise
                  entails the hypothesis. The answer should be exactly &apos;yes&apos; or
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
