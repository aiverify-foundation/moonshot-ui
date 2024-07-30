import { render, screen } from '@testing-library/react';
import { SaveBookMarkModal } from '@/app/redteaming/(fullscreen)/components/saveBookmarkModal';
import { useFormStatus } from 'react-dom';
import { useFormState } from 'react-dom';

jest.mock('react-dom', () => ({
  useFormStatus: jest.fn(),
  useFormState: jest.fn(),
}));

describe('SaveBookmarkModal', () => {
  beforeEach(() => {
    (useFormStatus as jest.Mock).mockReturnValue({ pending: false });
    (useFormState as jest.Mock).mockReturnValue({ pending: false });
  });
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
