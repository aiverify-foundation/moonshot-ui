import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import BenchmarkRunForm from '@/app/benchmarking/components/benchmarkRunForm';
import { CookbooksProvider } from '@/app/benchmarking/contexts/cookbooksContext';
import { useRunBenchmarkMutation } from '@/app/services/benchmark-api-service';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/services/benchmark-api-service', () => ({
  useRunBenchmarkMutation: jest.fn(),
}));

jest.mock('@/lib/redux', () => ({
  resetBenchmarkCookbooks: jest.fn(),
  resetBenchmarkModels: jest.fn(),
  useAppDispatch: jest.fn(),
}));

const mockCookbooks = [
  {
    id: 'cb-id-1',
    name: 'Mock Cookbook One',
    description: 'Mock description',
    recipes: ['rc-id-1'],
    total_prompt_in_cookbook: 10,
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
  },
];

const mockEndpoints: LLMEndpoint[] = [
  {
    id: 'ep-id-1',
    connector_type: 'type-1',
    name: 'Mock Endpoint One',
    uri: 'http://mock-endpoint-one.com',
    token: 'mock-token-1',
    max_calls_per_second: 10,
    max_concurrency: 5,
    created_date: '2023-01-01T00:00:00Z',
    params: {
      param1: 'value1',
      param2: 2,
      param3: true,
    },
  },
  {
    id: 'ep-id-2',
    connector_type: 'type-2',
    name: 'Mock Endpoint Two',
    uri: 'http://mock-endpoint-two.com',
    token: 'mock-token-2',
    max_calls_per_second: 20,
    max_concurrency: 10,
    created_date: '2023-01-02T00:00:00Z',
    params: {
      param1: 'value2',
      param2: 3,
      param3: false,
    },
  },
];

function renderWithProviders(
  ui: React.ReactNode,
  { initialCookbooks = [], ...options }: { initialCookbooks?: Cookbook[] } = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CookbooksProvider initialCookbooks={initialCookbooks}>
      {children}
    </CookbooksProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

describe('BenchmarkRunForm', () => {
  const mockRouterPush = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockRouterPush,
    }));
    (useRunBenchmarkMutation as jest.Mock).mockImplementation(() => [
      jest.fn(),
      { isLoading: false },
    ]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form initial state', async () => {
    // have to use act because benchmarkrunform has stateupdaters in useEffect which
    // are not automatically wraped by the react testing lib
    await act(async () =>
      renderWithProviders(
        <BenchmarkRunForm
          selectedCookbooks={mockCookbooks}
          selectedEndpoints={mockEndpoints}
        />
      )
    );
    expect(screen.getByRole('button', { name: /Run/i })).toBeDisabled();
  });

  test('form validation and submission', async () => {
    const mockDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    const mockResetBenchmarkCookbooks = jest.fn();
    const mockResetBenchmarkModels = jest.fn();
    (resetBenchmarkCookbooks as unknown as jest.Mock).mockImplementation(
      mockResetBenchmarkCookbooks
    );
    (resetBenchmarkModels as unknown as jest.Mock).mockImplementation(
      mockResetBenchmarkModels
    );
    const mockRunBenchmarkSuccess = jest.fn().mockResolvedValue({
      data: {
        id: 'br-id-1',
        name: 'Test Run',
        description: 'Test description',
        status: 'pending',
      },
    });
    (useRunBenchmarkMutation as jest.Mock).mockImplementation(() => [
      mockRunBenchmarkSuccess,
      { isLoading: false },
    ]);
    await act(async () =>
      renderWithProviders(
        <BenchmarkRunForm
          selectedCookbooks={mockCookbooks}
          selectedEndpoints={mockEndpoints}
        />
      )
    );

    const runButton = screen.getByRole('button', { name: /Run/i });

    await userEvent.type(screen.getByLabelText(/Name/i), 'Test Run');
    await userEvent.clear(screen.getByLabelText(/Run a smaller set/i));
    await userEvent.type(screen.getByLabelText(/Run a smaller set/i), '5');

    expect(runButton).toBeEnabled();

    await userEvent.click(runButton);

    expect(mockRunBenchmarkSuccess).toHaveBeenCalledWith({
      benchmarkRunInputData: {
        description: '',
        endpoints: ['ep-id-1', 'ep-id-2'],
        inputs: ['cb-id-1', 'cb-id-2'],
        num_of_prompts: '5',
        random_seed: '0',
        run_name: 'Test Run',
        runner_processing_module: 'benchmarking',
        system_prompt: '',
      },
      collectionType: 'cookbook',
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(mockResetBenchmarkCookbooks());
    expect(mockDispatch).toHaveBeenCalledWith(mockResetBenchmarkModels());
    expect(mockRouterPush).toHaveBeenCalledWith(
      '/benchmarking/session/run?runner_id=br-id-1'
    );
  });

  test('form submission with error', async () => {
    const mockRunBenchmarkError = jest.fn().mockResolvedValue({
      error: 'Error',
    });
    (useRunBenchmarkMutation as jest.Mock).mockImplementation(() => [
      mockRunBenchmarkError,
      { isLoading: false },
    ]);

    await act(async () =>
      renderWithProviders(
        <BenchmarkRunForm
          selectedCookbooks={mockCookbooks}
          selectedEndpoints={mockEndpoints}
        />
      )
    );

    const runButton = screen.getByRole('button', { name: /Run/i });

    await userEvent.type(screen.getByLabelText(/Name/i), 'Test Run');
    await userEvent.type(screen.getByLabelText(/Run a smaller set/i), '5');
    await userEvent.click(runButton);

    expect(mockRunBenchmarkError).toHaveBeenCalled();
    expect(mockRouterPush).not.toHaveBeenCalled();
    // TODO - assert show error modal
  });
});
