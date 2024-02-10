import { MutableRefObject } from 'react';
import {
  getWindowId,
  getWindowScrollTop,
  getWindowSize,
  getWindowXY,
} from '@/app/lib/window';
import { useAppSelector } from '@/lib/redux';
import { Chatbox } from './chatbox';

type ChatFreeLayoutProps = {
  chatSession: Session;
  boxRefs: MutableRefObject<HTMLDivElement[]>;
  chatCompletionInProgress: boolean;
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
  handleOnWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
};

function ChatboxFreeLayout(props: ChatFreeLayoutProps) {
  const {
    chatSession,
    boxRefs,
    chatCompletionInProgress,
    selectedPromptTemplate,
    promptText,
    handleOnWindowChange,
    handleOnWheel,
  } = props;

  const windowsMap = useAppSelector((state) => state.windows.map);

  return chatSession.chats.map((id: string, index: number) => {
    if (windowsMap[getWindowId(id)]) {
      return (
        <Chatbox.Container
          ref={(el) => (boxRefs.current[index] = el as HTMLDivElement)}
          windowId={getWindowId(id)}
          key={id}
          name={id}
          initialXY={getWindowXY(windowsMap, id)}
          initialSize={getWindowSize(windowsMap, id)}
          initialScrollTop={getWindowScrollTop(windowsMap, id)}
          onWindowChange={handleOnWindowChange}
          onWheel={handleOnWheel}>
          {!chatSession.chat_history
            ? null
            : chatSession.chat_history[id].map((dialogue, index) => {
                return (
                  <div
                    className="flex flex-col p-2"
                    key={index}>
                    <div className="flex flex-col text-right pr-2 text-xs text-black">
                      You
                    </div>
                    <Chatbox.TalkBubble
                      backgroundColor="#a3a3a3"
                      fontColor="#FFF"
                      styles={{
                        alignSelf: 'flex-end',
                        maxWidth: '90%',
                      }}>
                      {dialogue.prepared_prompt}
                    </Chatbox.TalkBubble>
                    <div
                      className="flex flex-col text-left pl-2 text-xs text-black"
                      style={{
                        maxWidth: '90%',
                      }}>
                      AI
                    </div>
                    <Chatbox.TalkBubble
                      backgroundColor="#3498db"
                      fontColor="#FFF"
                      styles={{ textAlign: 'left' }}>
                      {dialogue.predicted_result}
                    </Chatbox.TalkBubble>
                  </div>
                );
              })}
          {chatCompletionInProgress ? (
            <div className="flex flex-col p-2">
              <div className="flex flex-col text-right pr-2 text-xs text-black">
                You
              </div>
              <Chatbox.TalkBubble
                backgroundColor="#a3a3a3"
                fontColor="#FFF"
                styles={{ alignSelf: 'flex-end' }}>
                {selectedPromptTemplate
                  ? selectedPromptTemplate.template.replace(
                      '{{ prompt }}',
                      promptText
                    )
                  : promptText}
              </Chatbox.TalkBubble>
              <div className="flex flex-col text-left pl-2 text-xs text-black">
                AI
              </div>
              <div className="flex justify-start mr-4">
                <Chatbox.LoadingAnimation />
              </div>
            </div>
          ) : null}
        </Chatbox.Container>
      );
    }
  });
}

export { ChatboxFreeLayout };
