import { render, screen } from '@testing-library/react';
import { ChatBox } from '@/app/redteaming/(fullscreen)/components/chatbox';
import { useAppDispatch, useAppSelector } from '@/lib/redux';

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
    expect(container).toMatchSnapshot();
  });
});
