import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { useRunBenchmarkMutation } from '@/app/services/benchmark-api-service';
import BenchmarkRunForm from '@/app/views/benchmarking/benchmarkRunForm';
import { CookbooksProvider } from '@/app/views/benchmarking/contexts/cookbooksContext';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
  useAppSelector,
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
  useAppSelector: jest.fn(),
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
  const mockRunBenchmark = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockRouterPush,
    }));
    (useRunBenchmarkMutation as jest.Mock).mockImplementation(() => [
      mockRunBenchmark,
      { isLoading: false },
    ]);
    const mockAlreadySelectedCookbooksFromState = mockCookbooks;
    const mockAlreadySelectedEndpointsFromState = mockEndpoints;
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockAlreadySelectedCookbooksFromState
    );
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockAlreadySelectedEndpointsFromState
    );
    const mockDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockImplementation(() => ({
      dispatch: mockDispatch,
    }));
    const mockResetBenchmarkCookbooks = jest.fn();
    const mockResetBenchmarkModels = jest.fn();
    // (resetBenchmarkCookbooks as jest.Mock).mockImplementation(
    //   () => mockResetBenchmarkCookbooks
    // );
    // (resetBenchmarkModels as jest.Mock).mockImplementation(
    //   () => mockResetBenchmarkModels
    // );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    renderWithProviders(
      <BenchmarkRunForm
        defaultSelectedCookbooks={mockCookbooks}
        defaultSelectedEndpoints={mockEndpoints}
      />
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Description \(optional\)/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Run a smaller set/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run/i })).toBeInTheDocument();
  });

  test('form validation and submission', async () => {
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
    renderWithProviders(
      <BenchmarkRunForm
        defaultSelectedCookbooks={mockCookbooks}
        defaultSelectedEndpoints={mockEndpoints}
      />
    );

    const runButton = screen.getByRole('button', { name: /Run/i });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/Name/i), 'Test Run');
    await userEvent.type(screen.getByLabelText(/Run a smaller set/i), '5');

    // The run button should be enabled now
    expect(runButton).toBeEnabled();

    // Submit the form
    await userEvent.click(runButton);

    expect(mockRunBenchmarkSuccess).toHaveBeenCalledWith({
      benchmarkRunInputData: {
        description: '',
        endpoints: ['ep-id-1', 'ep-id-2'],
        inputs: ['cb-id-1', 'cb-id-2'],
        num_of_prompts: '05',
        random_seed: '0',
        run_name: 'Test Run',
        runner_processing_module: 'benchmarking',
        system_prompt: '',
      },
      collectionType: 'cookbook',
    });
    // expect(resetBenchmarkCookbooks).toHaveBeenCalled();
    // expect(resetBenchmarkModels).toHaveBeenCalled();
    expect(mockRouterPush).toHaveBeenCalledWith(
      '/benchmarking/session/run?runner_id=br-id-1'
    );
  });

  test.skip('form submission with error', async () => {
    (useRunBenchmarkMutation as jest.Mock).mockImplementation(() => [
      jest.fn().mockResolvedValue({ error: 'Error' }),
      { isLoading: false },
    ]);

    render(<BenchmarkRunForm />);

    const runButton = screen.getByRole('button', { name: /Run/i });

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/Name/i), 'Test Run');
    await userEvent.type(screen.getByLabelText(/Run a smaller set/i), '5');

    // Submit the form
    await userEvent.click(runButton);

    expect(mockRunBenchmark).toHaveBeenCalled();
    expect(resetBenchmarkCookbooks).toHaveBeenCalled();
    expect(resetBenchmarkModels).toHaveBeenCalled();
    expect(mockRouterPush).not.toHaveBeenCalled();
  });
});
