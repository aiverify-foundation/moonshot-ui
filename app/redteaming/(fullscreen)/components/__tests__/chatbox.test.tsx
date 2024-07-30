import { ChatBox } from '@/app/redteaming/(fullscreen)/components/chatbox';
import { render, screen } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
import { updateFocusedWindowId } from '@/lib/redux/slices/windowsSlice';

jest.mock('@/lib/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

const mockPromptTemplates: PromptTemplate[] = [
  {
    name: 'template1',
    description: 'Description for Template 1',
    template: 'This is the template for {{ prompt }} with some context',
  },
  {
    name: 'template2',
    description: 'Description for Template 2',
    template: 'Another template with {{ prompt }} and additional information',
  },
];

const mockPromptDetails: PromptDetails[] = [
  {
    chat_record_id: 1,
    conn_id: 'conn1',
    context_strategy: 'strategy1',
    prompt_template: 'template1',
    attack_module: 'module1',
    metric: 'metric1',
    prompt: 'Test prompt 1',
    prepared_prompt: 'Prepared test prompt 1',
    system_prompt: 'System prompt 1',
    predicted_result: 'Predicted result 1',
    duration: '1s',
    prompt_time: '2023-06-01T12:00:00Z',
  },
  {
    chat_record_id: 2,
    conn_id: 'conn2',
    context_strategy: 'strategy2',
    prompt_template: 'template2',
    attack_module: 'module2',
    metric: 'metric2',
    prompt: 'Test prompt 2',
    prepared_prompt: 'Prepared test prompt 2',
    system_prompt: 'System prompt 2',
    predicted_result: 'Predicted result 2',
    duration: '2s',
    prompt_time: '2023-06-01T12:01:00Z',
  },
];

describe('Chatbox', () => {
  beforeAll(() => {
    const mockDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue(jest.fn());
  });
  it('render chatbox containing prompt and response talk bubbles', () => {
    const { container } = render(
      <ChatBox
        windowId="test-window"
        title="Test Chat"
        resizable={false}
        draggable={false}
        disableOnScroll={true}
        chatHistory={mockPromptDetails}
        initialXY={[0, 0]}
        initialSize={[300, 400]}
        initialScrollTop={0}
        promptTemplates={mockPromptTemplates}
        isAttackMode={false}
        isChatCompletionInProgress={false}
        onWindowChange={() => null}
        onCreatePromptBookmarkClick={() => null}
      />
    );

    expect(
      screen.getByText(mockPromptDetails[0].prepared_prompt)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockPromptDetails[0].predicted_result)
    ).toBeInTheDocument();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="absolute pt-0 text-white 
                min-w-96 shadow-moongray-800
                dark:shadow-moongray-900/30 bg-moongray-950 backdrop-blur-sm 
                
              "
          id="test-window"
          style="left: 0px; top: 0px; background-color: rgb(45, 43, 47); width: 300px; height: 400px;"
        >
          <div
            class="flex flex-col w-full h-full"
          >
            <div
              class="flex flex-col w-full mb-6 bg-moongray-1000"
              style="margin-bottom: 14px;"
            >
              <div
                class="flex px-3 justify-between w-full"
              >
                <div
                  class="flex items-center h-7 text-sm"
                >
                  Test Chat
                </div>
              </div>
            </div>
            <div
              class="h-full px-4 overflow-x-hidden overflow-y-auto   bg-white size-full custom-scrollbar snap-mandatory"
              style="padding-left: 0px; padding-right: 0px; margin-left: 0.7rem; margin-right: 0.7rem;"
            >
              <div
                class="h-full overflow-y-auto custom-scrollbar bg-chatboxbg"
                id="chatContainer"
              >
                <li
                  class="flex flex-col p-2"
                >
                  <h1
                    class="flex flex-col text-right pr-2 text-sm text-white"
                  >
                    You
                  </h1>
                  <div
                    class="self-end snap-top max-w-[90%]"
                  >
                    <div
                      class="flex items-center"
                    >
                      <div
                        class="flex gap-2"
                      >
                        <div
                          class="cursor-pointer pt-2"
                        >
                          <div
                            class="childWrapper"
                          >
                            <div
                              class="
              flex items-center justify-center 
              cursor-pointer
              hover:opacity-50 active:opacity-25
              
            "
                            >
                              <svg
                                fill="#FFFFFF"
                                height="20"
                                viewBox="0 0 14 19"
                                width="20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.75433 13.9464L7.40078 13.5929L7.04723 13.9464L3.00377 17.9899C2.04707 17.8913 1.30078 17.0827 1.30078 16.1V2.9C1.30078 1.85074 2.15152 1 3.20078 1H11.6008C12.65 1 13.5008 1.85074 13.5008 2.9V16.1C13.5008 17.0827 12.7545 17.8913 11.7978 17.9899L7.75433 13.9464Z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div
                          class="childWrapper"
                        >
                          <div
                            style="text-align: right; color: rgb(255, 255, 255); padding: 12px 16px; font-size: 14px; background-color: rgb(73, 48, 90); margin: 0px 0px 0px 0px; border-radius: 14px; min-width: 35%; border: 1px solid transparent;"
                          >
                            Prepared test prompt 1
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h1
                    class="max-w-[90%] flex flex-col text-left pl-2 text-sm text-white"
                  >
                    AI
                  </h1>
                  <div
                    style="text-align: left; color: rgb(0, 0, 0); padding: 12px 16px; font-size: 14px; background-color: rgb(221, 221, 221); margin: 0px 0px 0px 0px; border-radius: 14px; min-width: 35%; border: 1px solid transparent;"
                  >
                    Predicted result 1
                  </div>
                </li>
                <li
                  class="flex flex-col p-2"
                >
                  <h1
                    class="flex flex-col text-right pr-2 text-sm text-white"
                  >
                    You
                  </h1>
                  <div
                    class="self-end snap-top max-w-[90%]"
                  >
                    <div
                      class="flex items-center"
                    >
                      <div
                        class="flex gap-2"
                      >
                        <div
                          class="cursor-pointer pt-2"
                        >
                          <div
                            class="childWrapper"
                          >
                            <div
                              class="
              flex items-center justify-center 
              cursor-pointer
              hover:opacity-50 active:opacity-25
              
            "
                            >
                              <svg
                                fill="#FFFFFF"
                                height="20"
                                viewBox="0 0 14 19"
                                width="20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.75433 13.9464L7.40078 13.5929L7.04723 13.9464L3.00377 17.9899C2.04707 17.8913 1.30078 17.0827 1.30078 16.1V2.9C1.30078 1.85074 2.15152 1 3.20078 1H11.6008C12.65 1 13.5008 1.85074 13.5008 2.9V16.1C13.5008 17.0827 12.7545 17.8913 11.7978 17.9899L7.75433 13.9464Z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div
                          class="childWrapper"
                        >
                          <div
                            style="text-align: right; color: rgb(255, 255, 255); padding: 12px 16px; font-size: 14px; background-color: rgb(73, 48, 90); margin: 0px 0px 0px 0px; border-radius: 14px; min-width: 35%; border: 1px solid transparent;"
                          >
                            Prepared test prompt 2
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h1
                    class="max-w-[90%] flex flex-col text-left pl-2 text-sm text-white"
                  >
                    AI
                  </h1>
                  <div
                    style="text-align: left; color: rgb(0, 0, 0); padding: 12px 16px; font-size: 14px; background-color: rgb(221, 221, 221); margin: 0px 0px 0px 0px; border-radius: 14px; min-width: 35%; border: 1px solid transparent;"
                  >
                    Predicted result 2
                  </div>
                </li>
              </div>
            </div>
            <div
              class="flex items-center justify-start text-xs text-white/70 px-3"
              style="height: 17px;"
            />
          </div>
        </div>
      </div>
    `);
  });
});
