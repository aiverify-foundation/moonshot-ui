import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import { act } from 'react-dom/test-utils';
import { BenchmarkRunStatus } from '@/app/benchmarking/components/benchmarkRunStatus';
import { useEventSource } from '@/app/hooks/use-eventsource';
import { useCancelBenchmarkMutation } from '@/app/services/benchmark-api-service';
import { useGetAllStatusQuery } from '@/app/services/status-api-service';
import { TestStatusProgress } from '@/app/types/enums';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';

jest.mock('@/lib/redux', () => ({
  resetBenchmarkCookbooks: jest.fn(),
  resetBenchmarkModels: jest.fn(),
  useAppDispatch: jest.fn(),
}));

const mockTestStatuses: TestStatuses = {
  'runner-id-1': {
    current_runner_id: 'runner-id-1',
    current_runner_type: 'typeA',
    current_duration: 120,
    current_status: TestStatusProgress.RUNNING,
    current_cookbook_index: 1,
    current_cookbook_name: 'Cookbook A',
    current_cookbook_total: 3,
    current_recipe_index: 2,
    current_recipe_name: 'Recipe B',
    current_recipe_total: 5,
    current_progress: 40,
    current_error_messages: [],
  },
  'runner-id-2': {
    current_runner_id: 'runner-id-2',
    current_runner_type: 'typeB',
    current_duration: 300,
    current_status: 'completed',
    current_cookbook_index: 2,
    current_cookbook_name: 'Cookbook B',
    current_cookbook_total: 4,
    current_recipe_index: 4,
    current_recipe_name: 'Recipe D',
    current_recipe_total: 6,
    current_progress: 100,
    current_error_messages: ['Error 1', 'Error 2'],
  },
};

const noOfPrompts = 100;
const mockRunner: Runner = {
  id: 'runner-id-1',
  name: 'Mock Runner One',
  endpoints: ['endpoint-id-1', 'endpoint-id-2'],
  description: 'Mock description for Runner One',
  runner_args: {
    cookbooks: ['cb-id-1', 'cb-id-2'],
    num_of_prompts: noOfPrompts,
    random_seed: 42,
    system_prompt: 'Mock system prompt',
    runner_processing_module: 'benchmarking',
    result_processing_module: 'result-processing',
  },
  start_time: 1672531200,
};

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
    id: 'endpoint-id-1',
    connector_type: 'type1',
    name: 'Endpoint 1',
    uri: 'http://endpoint1.com',
    token: 'token1',
    max_calls_per_second: 10,
    max_concurrency: 5,
    created_date: '2023-01-01',
    params: { param1: 'value1' },
  },
  {
    id: 'endpoint-id-2',
    connector_type: 'type2',
    name: 'Endpoint 2',
    uri: 'http://endpoint2.com',
    token: 'token2',
    max_calls_per_second: 20,
    max_concurrency: 10,
    created_date: '2023-02-01',
    params: { param2: 'value2' },
  },
];

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(jest.fn()),
  useSearchParams: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('@/app/hooks/use-eventsource', () => ({
  useEventSource: jest.fn(),
}));

jest.mock('@/app/services/benchmark-api-service', () => ({
  useCancelBenchmarkMutation: jest
    .fn()
    .mockReturnValue([jest.fn(), { isLoading: false }]),
}));

jest.mock('@/app/services/cookbook-api-service', () => ({
  useGetCookbooksQuery: () => ({ data: [mockCookbooks[1]] }),
}));

jest.mock('@/app/services/llm-endpoint-api-service', () => ({
  useGetLLMEndpointsQuery: () => ({ data: mockEndpoints }),
}));

jest.mock('@/app/services/runner-api-service', () => ({
  useGetRunnerByIdQuery: () => ({ data: mockRunner, isLoading: false }),
}));

jest.mock('@/app/services/status-api-service', () => ({
  useGetAllStatusQuery: jest.fn(),
}));

it('should display the "in progress" status and test details', async () => {
  const mockCloseEventSource = jest.fn();
  (useEventSource as jest.Mock).mockReturnValue([null, mockCloseEventSource]);
  (useSearchParams as jest.Mock).mockReturnValue({
    get: () => mockRunner.id,
  });
  (useGetAllStatusQuery as jest.Mock).mockImplementation(() => ({
    data: mockTestStatuses,
    isLoading: false,
  }));
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
  render(<BenchmarkRunStatus allStatuses={mockTestStatuses} />);

  expect(mockDispatch).toHaveBeenCalledTimes(2);
  expect(mockDispatch).toHaveBeenCalledWith(mockResetBenchmarkCookbooks());
  expect(mockDispatch).toHaveBeenCalledWith(mockResetBenchmarkModels());

  expect(screen.getByText(/running tests/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      new RegExp(
        `${mockTestStatuses[mockRunner.id].current_progress.toString()}%`,
        'i'
      )
    )
  ).toBeInTheDocument();

  await userEvent.click(screen.getByText(/see details/i));
  expect(screen.getByText(mockRunner.name)).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`${noOfPrompts}`, 'i'))
  ).toBeInTheDocument();
  for (const endpoint of mockRunner.endpoints) {
    expect(
      screen.getByText(
        mockEndpoints.find((e) => e.id === endpoint)?.name as string
      )
    ).toBeInTheDocument();
  }
  for (const endpoint of mockRunner.endpoints) {
    expect(
      screen.getByText(
        mockEndpoints.find((e) => e.id === endpoint)?.name as string
      )
    ).toBeInTheDocument();
  }

  cleanup();
  expect(mockCloseEventSource).toHaveBeenCalled();
});

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

it('should display the "completed" status', async () => {
  const completedTestData = {
    current_runner_id: 'runner-id-1',
    current_runner_type: 'typeA',
    current_duration: 120,
    current_status: TestStatusProgress.COMPLETED,
    current_cookbook_index: 1,
    current_cookbook_name: 'Cookbook A',
    current_cookbook_total: 3,
    current_recipe_index: 2,
    current_recipe_name: 'Recipe B',
    current_recipe_total: 5,
    current_progress: 100,
    current_error_messages: [],
  };
  const mockCloseEventSource = jest.fn();
  (useSearchParams as jest.Mock).mockReturnValue({
    get: () => mockRunner.id,
  });
  (useGetAllStatusQuery as jest.Mock).mockImplementation(() => ({
    data: mockTestStatuses,
    isLoading: false,
  }));
  const { rerender } = render(
    <BenchmarkRunStatus allStatuses={mockTestStatuses} />
  );

  // Simulate an update to useEventSource and trigger re-render
  await act(async () => {
    (useEventSource as jest.Mock).mockReturnValue([
      completedTestData,
      mockCloseEventSource,
    ]);
    rerender(<BenchmarkRunStatus allStatuses={mockTestStatuses} />);
  });
  expect(screen.getByText(/tests completed/i)).toBeInTheDocument();
  expect(
    screen.getByText(
      new RegExp(`${completedTestData.current_progress.toString()}%`, 'i')
    )
  ).toBeInTheDocument();
});

it('should display the "cancelled" status', async () => {
  const cancelledTestData = {
    current_runner_id: 'runner-id-1',
    current_runner_type: 'typeA',
    current_duration: 120,
    current_status: TestStatusProgress.CANCELLED,
    current_cookbook_index: 1,
    current_cookbook_name: 'Cookbook A',
    current_cookbook_total: 3,
    current_recipe_index: 2,
    current_recipe_name: 'Recipe B',
    current_recipe_total: 5,
    current_progress: 10,
    current_error_messages: [],
  };
  const mockCloseEventSource = jest.fn();
  (useSearchParams as jest.Mock).mockReturnValue({
    get: () => mockRunner.id,
  });
  const mockTriggerCancelBenchmark = jest.fn();
  (useCancelBenchmarkMutation as jest.Mock).mockReturnValue([
    mockTriggerCancelBenchmark,
    { isLoading: false },
  ]);
  (useGetAllStatusQuery as jest.Mock).mockImplementation(() => ({
    data: mockTestStatuses,
    isLoading: false,
  }));
  const { rerender } = render(
    <BenchmarkRunStatus allStatuses={mockTestStatuses} />
  );
  const cancelButton = screen.getByRole('button', { name: /cancel/i });
  await userEvent.click(cancelButton);
  expect(mockTriggerCancelBenchmark).toHaveBeenCalled();
  expect(cancelButton).toBeDisabled();

  // Simulate an update to useEventSource and trigger re-render
  await act(async () => {
    (useEventSource as jest.Mock).mockReturnValue([
      cancelledTestData,
      mockCloseEventSource,
    ]);
    rerender(<BenchmarkRunStatus allStatuses={mockTestStatuses} />);
  });
  expect(screen.getByText(/tests cancelled/i)).toBeInTheDocument();
});

it('should display the "errored" status', async () => {
  const erroredTestData = {
    current_runner_id: 'runner-id-1',
    current_runner_type: 'typeA',
    current_duration: 120,
    current_status: TestStatusProgress.ERRORS,
    current_cookbook_index: 1,
    current_cookbook_name: 'Cookbook A',
    current_cookbook_total: 3,
    current_recipe_index: 2,
    current_recipe_name: 'Recipe B',
    current_recipe_total: 5,
    current_progress: 100,
    current_error_messages: ['Mock error message 1'],
  };
  const mockCloseEventSource = jest.fn();
  (useSearchParams as jest.Mock).mockReturnValue({
    get: () => mockRunner.id,
  });
  (useGetAllStatusQuery as jest.Mock).mockImplementation(() => ({
    data: mockTestStatuses,
    isLoading: false,
  }));
  const { rerender } = render(
    <BenchmarkRunStatus allStatuses={mockTestStatuses} />
  );

  // Simulate an update to useEventSource and trigger re-render
  await act(async () => {
    (useEventSource as jest.Mock).mockReturnValue([
      erroredTestData,
      mockCloseEventSource,
    ]);
    rerender(<BenchmarkRunStatus allStatuses={mockTestStatuses} />);
  });
  expect(screen.getByText(/tests completed/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /view errors/i }));
  expect(
    screen.getByText(erroredTestData.current_error_messages[0])
  ).toBeInTheDocument();
});
