import { SaveBookMarkModal } from '@/app/redteaming/(fullscreen)/components/saveBookmarkModal';
import { render, screen } from '@testing-library/react';

describe('SaveBookmarkModal', () => {
  it('should render', () => {
    const mockProps = {
      duration: '2s',
      prompt: 'Test prompt',
      preparedPrompt: 'Prepared test prompt',
      attackModule: 'Test attack module',
      contextStrategy: 'Test context strategy',
      promptTemplateName: 'Test template',
      template: 'Test template string',
      response: 'Test response',
      metric: 'Test metric',
      onCloseIconClick: jest.fn(),
    };

    const { container } = render(<SaveBookMarkModal {...mockProps} />);
  });
});
