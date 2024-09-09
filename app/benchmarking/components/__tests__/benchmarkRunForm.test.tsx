import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormState, useFormStatus } from 'react-dom';
import BenchmarkRunForm from '@/app/benchmarking/components/benchmarkRunForm';
import { CookbooksProvider } from '@/app/benchmarking/contexts/cookbooksContext';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';

jest.mock('react-dom', () => {
  const actualReactDom = jest.requireActual('react-dom');
  return {
    ...actualReactDom,
    useFormState: jest.fn(),
    useFormStatus: jest.fn(),
  };
});

jest.mock('@/lib/redux', () => ({
  resetBenchmarkCookbooks: jest.fn(),
  resetBenchmarkModels: jest.fn(),
  useAppDispatch: jest.fn(),
}));

const mockCookbooks: Cookbook[] = [
  {
    id: 'cb-id-1',
    name: 'Mock Cookbook One',
    description: 'Mock description',
    recipes: ['rc-id-1'],
    total_prompt_in_cookbook: 10,
    total_dataset_in_cookbook: 10,
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
    total_dataset_in_cookbook: 20,
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
  const mockFormState: FormState<BenchmarkRunFormValues> = {
    formStatus: 'initial',
    formErrors: undefined,
    run_name: '',
    description: '',
    inputs: [],
    endpoints: [],
    num_of_prompts: 1,
    system_prompt: '',
    runner_processing_module: 'benchmarking',
    random_seed: 0,
  };
  const mockFormAction = 'unused'; // we are not asserting anything on the server action. Set it to a string instead to suppress jest from reporting invalid value prop error

  beforeAll(() => {
    const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
      return [
        mockFormState,
        mockFormAction, // use a dummy string to prevent jest from complaining
      ];
    });
    (useFormState as jest.Mock).mockImplementation(mockUseFormState);
    (useFormStatus as jest.Mock).mockImplementation(() => ({ pending: false }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should renders form initial state', async () => {
    const { container } = renderWithProviders(
      <BenchmarkRunForm
        selectedCookbooks={mockCookbooks}
        selectedEndpoints={mockEndpoints}
      />
    );
    for (const cookbook of mockCookbooks) {
      expect(
        container.querySelector(`input[value=${cookbook.id}`)
      ).toBeDefined();
    }
    for (const endpoint of mockEndpoints) {
      expect(
        container.querySelector(`input[value=${endpoint.id}`)
      ).toBeDefined();
    }
    expect(container.querySelector('input[name="random_seed"]')).toHaveValue(
      String(mockFormState.random_seed)
    );
    expect(
      container.querySelector('input[name="runner_processing_module"]')
    ).toHaveValue(mockFormState.runner_processing_module);
    expect(container.querySelector('input[name="system_prompt"]')).toHaveValue(
      mockFormState.system_prompt
    );
    expect(screen.getByRole('button', { name: /Run/i })).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/Name/i), 'Test Run');
    await userEvent.type(screen.getByLabelText(/Run a smaller set/i), '5');
    expect(screen.getByRole('button', { name: /Run/i })).toBeEnabled();
  });

  it('should clear selected cookbooks and endpoints when form is submitted and display form errors', async () => {
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

    const { rerender } = renderWithProviders(
      <BenchmarkRunForm
        selectedCookbooks={mockCookbooks}
        selectedEndpoints={mockEndpoints}
      />
    );

    await act(async () => {
      (useFormStatus as jest.Mock).mockImplementation(() => ({
        pending: true,
      }));
      rerender(
        <BenchmarkRunForm
          selectedCookbooks={mockCookbooks}
          selectedEndpoints={mockEndpoints}
        />
      );
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(mockResetBenchmarkCookbooks());
    expect(mockDispatch).toHaveBeenCalledWith(mockResetBenchmarkModels());

    const mockFormStateWithErrors: FormState<BenchmarkRunFormValues> = {
      ...mockFormState,
      formStatus: 'error',
      formErrors: {
        run_name: ['mock error 1'],
        num_of_prompts: ['mock error 2'],
        description: ['mock error 3'],
      },
    };
    await act(async () => {
      const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
        return [
          mockFormStateWithErrors,
          mockFormAction, // use a dummy string to prevent jest from complaining
        ];
      });
      (useFormState as jest.Mock).mockImplementation(mockUseFormState);
      rerender(
        <BenchmarkRunForm
          selectedCookbooks={mockCookbooks}
          selectedEndpoints={mockEndpoints}
        />
      );
    });
    expect(screen.getAllByText('mock error 1')).toHaveLength(2);
    expect(screen.getAllByText('mock error 2')).toHaveLength(2);
    expect(screen.getAllByText('mock error 3')).toHaveLength(2);
  });
});
