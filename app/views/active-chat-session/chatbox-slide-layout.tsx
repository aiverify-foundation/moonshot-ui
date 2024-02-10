import { MutableRefObject, SetStateAction, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Chatbox } from './chatbox';
import { getWindowId } from '@/app/lib/window';

type ChatSlideLayoutProps = {
  chatSession: Session;
  boxWidth: number;
  boxHeight: number;
  boxGap: number;
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

function ChatboxSlideLayout(props: ChatSlideLayoutProps) {
  const {
    chatSession,
    boxWidth,
    boxHeight,
    boxGap,
    boxRefs,
    chatCompletionInProgress,
    selectedPromptTemplate,
    promptText,
    handleOnWindowChange,
    handleOnWheel,
  } = props;
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  return (
    <>
      <div
        id="chatboxSlideNavBtns"
        className="absolute w-screen justify-between"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
        <div className="flex items-center justify-between gap-4 w-full px-20 select-none">
          <Icon
            size={40}
            name={IconName.CircleArrowLeft}
            onClick={() =>
              setCurrentBoxIndex((prevIndex) => Math.max(prevIndex - 1, 0))
            }
            disabled={currentBoxIndex === 0}
          />
          <Icon
            size={40}
            name={IconName.CircleArrowRight}
            onClick={() =>
              setCurrentBoxIndex((prevIndex) =>
                Math.min(prevIndex + 1, chatSession.chats.length - 1)
              )
            }
            disabled={currentBoxIndex === chatSession.chats.length - 3}
          />
        </div>
      </div>
      <div className="chat-window-container">
        <div
          className="chat-window-slide"
          style={{
            transform: `translateX(-${currentBoxIndex * (boxWidth + boxGap)}px)`,
          }}>
          {chatSession.chats.map((id: string, index: number) => {
            if (
              (currentBoxIndex > 0 && index === currentBoxIndex - 1) ||
              index === currentBoxIndex ||
              index === currentBoxIndex + 1 ||
              index === currentBoxIndex + 2 ||
              index === currentBoxIndex + 3
            ) {
              const xpos = index === 0 ? 0 : (boxWidth + boxGap) * index;
              const scrollPosition = boxRefs.current[index]
                ? boxRefs.current[index].scrollHeight -
                  boxRefs.current[index].clientHeight
                : 0;
              return (
                <Chatbox.Container
                  ref={(el) => (boxRefs.current[index] = el as HTMLDivElement)}
                  windowId={getWindowId(id)}
                  key={id}
                  name={id}
                  initialXY={[xpos, 0]}
                  initialSize={[boxWidth, boxHeight]}
                  initialScrollTop={scrollPosition}
                  resizable={false}
                  draggable={false}
                  disableOnScroll
                  onCloseClick={() => null}
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
                              styles={{
                                textAlign: 'left',
                              }}>
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
          })}
        </div>
      </div>
    </>
  );
}

export { ChatboxSlideLayout };
