import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormStatus } from 'react-dom';
import { useFormState } from 'react-dom';
import { SaveBookMarkModal } from '@/app/redteaming/(fullscreen)/components/saveBookmarkModal';
import { useAppDispatch, useAppSelector } from '@/lib/redux';

jest.mock('@/lib/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: jest.fn(),
  useFormState: jest.fn(),
}));

describe('SaveBookmarkModal', () => {
  const mockFormState: FormState<BookmarkFormValues> = {
    formStatus: 'initial',
    formErrors: undefined,
    name: '',
    prompt_template: '',
    prepared_prompt: '',
    response: '',
    metric: undefined,
    attack_module: undefined,
    context_strategy: undefined,
  };
  const mockFormAction = 'unused'; // we are not asserting anything on the server action. Set it to a string instead to suppress jest from reporting invalid value prop error
  const mockDispatch = jest.fn();

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
    onPrimaryBtnClick: jest.fn(),
  };

  beforeAll(() => {
    (useFormStatus as jest.Mock).mockImplementation(() => ({ pending: false }));
    (useFormState as jest.Mock).mockImplementation(() => [
      mockFormState,
      mockFormAction,
    ]);
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue(jest.fn());
  });

  it('renders and populates hidden form elements with the correct values', async () => {
    const { container } = render(<SaveBookMarkModal {...mockProps} />);
    expect(container).toMatchSnapshot();

    expect(container.querySelector('input[name="prompt"]')).toHaveValue(
      mockProps.prompt
    );
    expect(
      container.querySelector('input[name="prompt_template"]')
    ).toHaveValue(mockProps.template);
    expect(
      container.querySelector('input[name="prepared_prompt"]')
    ).toHaveValue(mockProps.preparedPrompt);
    expect(container.querySelector('input[name="response"]')).toHaveValue(
      mockProps.response
    );
    expect(container.querySelector('input[name="metric"]')).toHaveValue(
      mockProps.metric
    );
    expect(container.querySelector('input[name="attack_module"]')).toHaveValue(
      mockProps.attackModule
    );
    expect(
      container.querySelector('input[name="context_strategy"]')
    ).toHaveValue(mockProps.contextStrategy);

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    await userEvent.type(
      screen.getByRole('textbox', { name: /name/i }),
      'Test name'
    );
    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
  });

  it('displays success message', async () => {
    const mockSuccessFormState: FormState<BookmarkFormValues> = {
      formStatus: 'success',
      formErrors: undefined,
      name: 'Test name',
      prompt: 'Test prompt',
      prepared_prompt: 'Prepared test prompt',
      attack_module: 'Test attack module',
      context_strategy: 'Test context strategy',
      prompt_template: 'Test template string',
      response: 'Test response',
      metric: 'Test metric',
    };
    (useFormState as jest.Mock).mockImplementation(() => [
      mockSuccessFormState,
      mockFormAction,
    ]);
    const mockOnPrimaryBtnClick = jest.fn();
    render(
      <SaveBookMarkModal
        {...mockProps}
        onPrimaryBtnClick={mockOnPrimaryBtnClick}
      />
    );
    expect(screen.getByText(/bookmark saved/i)).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /view bookmarks/i })
    );
    expect(mockOnPrimaryBtnClick).toHaveBeenCalled();
  });

  it('displays error message', () => {
    const expectedErrorMsg = 'error: mock error';
    const mockErrorFormState: FormState<BookmarkFormValues> = {
      formStatus: 'error',
      formErrors: { error: ['mock error'] },
      name: 'Test name',
      prompt: 'Test prompt',
      prepared_prompt: 'Prepared test prompt',
      attack_module: 'Test attack module',
      context_strategy: 'Test context strategy',
      prompt_template: 'Test template string',
      response: 'Test response',
      metric: 'Test metric',
    };
    (useFormState as jest.Mock).mockImplementation(() => [
      mockErrorFormState,
      mockFormAction,
    ]);
    render(<SaveBookMarkModal {...mockProps} />);
    expect(screen.getByText(expectedErrorMsg)).toBeInTheDocument();
  });
});
