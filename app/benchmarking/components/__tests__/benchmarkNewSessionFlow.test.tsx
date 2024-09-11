import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormState, useFormStatus } from 'react-dom';
import { BenchmarkNewSessionFlow } from '@/app/benchmarking/components/benchmarkNewSessionFlow';
import { useModelsList } from '@/app/hooks/useLLMEndpointList';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import { useAppDispatch, useAppSelector } from '@/lib/redux';

const mockCookbooks: Cookbook[] = [
  {
    id: 'cb-id-1',
    name: 'Mock Cookbook One',
    description: 'Mock description',
    recipes: ['rc-id-1'],
    total_prompt_in_cookbook: 10,
    total_dataset_in_cookbook: 1,
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
    total_dataset_in_cookbook: 2,
  },
];

const mockEndpoints: LLMEndpoint[] = [
  {
    id: '1',
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
    id: '2',
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

jest.mock('react-dom', () => {
  const actualReactDomApis = jest.requireActual('react-dom');
  return {
    ...actualReactDomApis,
    useFormState: jest.fn(),
    useFormStatus: jest.fn(),
  };
});

jest.mock('@/lib/redux', () => ({
  addBenchmarkModels: jest.fn(),
  addBenchmarkCookbooks: jest.fn(),
  removeBenchmarkModels: jest.fn(),
  resetBenchmarkCookbooks: jest.fn(),
  resetBenchmarkModels: jest.fn(),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/app/services/cookbook-api-service', () => ({
  useGetCookbooksQuery: jest.fn(),
}));
jest.mock('@/app/hooks/useLLMEndpointList', () => ({
  useModelsList: jest.fn(),
}));
jest.mock('@/app/services/connector-api-service', () => ({
  useGetAllConnectorsQuery: jest.fn(),
}));
jest.mock('@/app/services/llm-endpoint-api-service', () => ({
  useCreateLLMEndpointMutation: jest.fn(),
  useUpdateLLMEndpointMutation: jest.fn(),
}));
jest.mock('@/app/services/benchmark-api-service', () => ({
  useRunBenchmarkMutation: jest.fn(),
}));

const mockFormState: FormState<BenchmarkRunFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  run_name: '',
  description: '',
  inputs: [],
  endpoints: [],
  num_of_prompts: '',
  system_prompt: '',
  runner_processing_module: 'benchmarking',
  random_seed: '0',
  run_all: 'false',
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

it('should go to next view when next button is clicked', async () => {
  let callCount = 1; // this counter and the mock implementation below are a bit of a hack to test the flow - relying on the Nth time useAppSelector is called, it returns the expected value
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [mockCookbooks[0]];
    }
    callCount--;
    return [];
  });
  (useGetCookbooksQuery as jest.Mock).mockReturnValue({
    data: mockCookbooks,
    isFetching: false,
  });
  (useModelsList as jest.Mock).mockImplementation(() => ({
    models: mockEndpoints,
    isLoading: false,
    error: null,
  }));
  (useAppDispatch as jest.Mock).mockImplementation(() => jest.fn());

  const { rerender } = render(<BenchmarkNewSessionFlow />);
  const nextViewButton = screen.getByRole('button', { name: /Next View/i });
  expect(nextViewButton).toBeInTheDocument();
  expect(screen.getByText(mockCookbooks[0].name)).toBeInTheDocument();
  expect(screen.getByText(mockCookbooks[1].name)).toBeInTheDocument();

  await userEvent.click(nextViewButton);
  expect(
    screen.getByText(mockCookbooks[0].total_prompt_in_cookbook)
  ).toBeInTheDocument();

  await userEvent.click(nextViewButton);
  expect(screen.getByText(mockEndpoints[0].name)).toBeInTheDocument();
  expect(screen.getByText(mockEndpoints[1].name)).toBeInTheDocument();
  expect(
    screen.getByRole('checkbox', { name: /Select Endpoint 1/i })
  ).not.toBeChecked();

  // simulate 1 endpoint selected
  callCount = 1;
  (useAppSelector as jest.Mock).mockReset();
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [mockCookbooks[0]];
    }
    callCount--;
    return [mockEndpoints[0]];
  });
  await act(async () => {
    rerender(<BenchmarkNewSessionFlow />);
  });
  expect(
    screen.getByRole('checkbox', { name: /Select Endpoint 1/i })
  ).toBeChecked();
  await userEvent.click(nextViewButton);
  expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
});
