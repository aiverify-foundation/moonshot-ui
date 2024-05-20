import React, { useEffect, useState } from 'react';
import {
  getWindowId,
  getWindowScrollTopById,
  getWindowSizeById,
  getWindowXYById,
} from '@/app/lib/window-utils';
import { colors } from '@/app/views/shared-components/customColors';
import { useAppSelector } from '@/lib/redux';
import { ChatBox, ChatBoxControls } from './chatbox';
import useChatboxesPositionsUtils from '@views/redteaming/hooks/useChatboxesPositionsUtils';

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
    }, []);

    useEffect(() => {
      setTimeout(() => {
        setIsMazimizing(false);
      }, 300);
    }, [isMaximizing]);

    return (
      <>
        {chatSession.session.endpoints.map((id: string, index: number) => {
          const isMinimized = minizedChats.includes(getWindowId(id));
          const left = index * 20;
          return windowsMap[getWindowId(id)] ? (
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
              windowId={getWindowId(id)}
              title={id}
              initialXY={getWindowXYById(windowsMap, id)}
              initialSize={getWindowSizeById(windowsMap, id)}
              initialScrollTop={getWindowScrollTopById(windowsMap, id)}
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
              styles={
                isMinimized
                  ? { ...minimizedStyle, left }
                  : isMaximizing
                    ? {
                        transition:
                          'transform 0.3s ease-in-out, top 0.5s ease-in-out, left 0.5s ease-in-out',
                      }
                    : { borderRadius: '0.5rem' }
              }
              headerStyle={{
                borderTopLeftRadius: '0.5rem',
                borderTopRightRadius: '0.5rem',
              }}
              onCloseClick={handleMinimizeClick(getWindowId(id))}
              onWholeWindowClick={
                isMinimized ? handleMaximizeClick(getWindowId(id)) : undefined
              }
            />
          ) : null;
        })}
      </>
    );
  }
);

ChatboxFreeLayout.displayName = 'ChatboxFreeLayout';

export { ChatboxFreeLayout };
