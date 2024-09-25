import React, { useEffect, useState } from 'react';
import { colors } from '@/app/customColors';
import {
  getWindowId,
  getWindowScrollTopById,
  getWindowSizeById,
  getWindowXYById,
} from '@/app/lib/window-utils';
import useChatboxesPositionsUtils from '@/app/redteaming/(fullscreen)/hooks/useChatboxesPositionsUtils';
import { useAppSelector } from '@/lib/redux';
import { ChatBox, ChatBoxControls } from './chatbox';

const minimizedStyle = {
  transform: 'scale(0.1)',
  width: 500,
  height: 500,
  top: `calc(100vh - 350px)`,
  transition:
    'transform 0.3s ease-in, top 0.4s ease-in-out, left 0.5s ease-out', // Smooth transition for the animation
};

type ChatFreeLayoutProps = {
  chatSession: SessionData;
  chatCompletionInProgress: boolean;
  isAttackMode: boolean;
  promptTemplates: PromptTemplate[];
  selectedPromptTemplate: PromptTemplate | undefined;
  promptText: string;
  handleOnWindowChange: (
    x: number,
    y: number,
    width: number,
    height: number,
    scrollPosition: number,
    windowId: string
  ) => void;
  handleCreatePromptBookmarkClick: CreatePromptBookmarkFunction;
};

const ChatboxFreeLayout = React.forwardRef(
  (
    props: ChatFreeLayoutProps,
    ref: React.Ref<Map<string, ChatBoxControls>>
  ) => {
    const {
      chatSession,
      chatCompletionInProgress,
      isAttackMode,
      promptTemplates,
      selectedPromptTemplate,
      promptText,
      handleOnWindowChange,
      handleCreatePromptBookmarkClick,
    } = props;
    const windowsMap = useAppSelector((state) => state.windows.map);
    const { resetChatboxPositions } = useChatboxesPositionsUtils(chatSession);
    const [minizedChats, setMinizedChats] = useState<string[]>([]);
    const [isMaximizing, setIsMazimizing] = useState(false);
    const chatBoxControlsMap = new Map<string, ChatBoxControls>();
    React.useImperativeHandle(ref, () => chatBoxControlsMap);

    function handleMinimizeClick(windowId: string) {
      return () => {
        setMinizedChats([...minizedChats, windowId]);
      };
    }

    function handleMaximizeClick(windowId: string) {
      return () => {
        setIsMazimizing(true);
        setMinizedChats(minizedChats.filter((id) => id !== windowId));
      };
    }

    useEffect(() => {
      resetChatboxPositions(false);
    }, [chatSession.session.session_id]);

    useEffect(() => {
      setTimeout(() => {
        setIsMazimizing(false);
      }, 300);
    }, [isMaximizing]);

    const chatboxHeaderStyle: React.CSSProperties = {
      borderTopLeftRadius: '0.5rem',
      borderTopRightRadius: '0.5rem',
    };

    return (
      <>
        {chatSession.session.endpoints.map((id: string, index: number) => {
          const isMinimized = minizedChats.includes(
            getWindowId(`${chatSession.session.session_id}-${id}`)
          );
          const left = index * 20;
          const chatboxStyle = isMinimized
            ? { ...minimizedStyle, left }
            : isMaximizing
              ? {
                  transition:
                    'transform 0.3s ease-in-out, top 0.5s ease-in-out, left 0.5s ease-in-out',
                }
              : { borderRadius: '0.5rem' };
          return windowsMap[
            getWindowId(`${chatSession.session.session_id}-${id}`)
          ] ? (
            <ChatBox
              key={id}
              disableCloseIcon={
                chatSession.session.endpoints.length === 1 ||
                chatSession.session.endpoints.length - minizedChats.length === 1
              }
              resizable
              draggable
              disableOnScroll
              disableBubbleTooltips={isMinimized}
              resizeHandlerColor={colors.moonwine[500]}
              ref={(imperativeHandles) => {
                if (imperativeHandles) {
                  chatBoxControlsMap.set(id, imperativeHandles);
                } else {
                  chatBoxControlsMap.delete(id);
                }
              }}
              windowId={getWindowId(`${chatSession.session.session_id}-${id}`)}
              title={id}
              initialXY={getWindowXYById(
                windowsMap,
                `${chatSession.session.session_id}-${id}`
              )}
              initialSize={getWindowSizeById(
                windowsMap,
                `${chatSession.session.session_id}-${id}`
              )}
              initialScrollTop={getWindowScrollTopById(
                windowsMap,
                `${chatSession.session.session_id}-${id}`
              )}
              chatHistory={
                chatSession.chat_records
                  ? chatSession.chat_records[id] || []
                  : []
              }
              promptTemplates={promptTemplates}
              currentPromptTemplate={selectedPromptTemplate}
              isAttackMode={isAttackMode}
              currentPromptText={promptText}
              isChatCompletionInProgress={chatCompletionInProgress}
              onWindowChange={handleOnWindowChange}
              styles={chatboxStyle}
              headerStyle={chatboxHeaderStyle}
              onCloseClick={handleMinimizeClick(
                getWindowId(`${chatSession.session.session_id}-${id}`)
              )}
              onWholeWindowClick={
                isMinimized
                  ? handleMaximizeClick(
                      getWindowId(`${chatSession.session.session_id}-${id}`)
                    )
                  : undefined
              }
              onCreatePromptBookmarkClick={handleCreatePromptBookmarkClick}
            />
          ) : null;
        })}
      </>
    );
  }
);

ChatboxFreeLayout.displayName = 'ChatboxFreeLayout';

export { ChatboxFreeLayout };
