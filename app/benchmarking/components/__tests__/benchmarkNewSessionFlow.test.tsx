import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormState, useFormStatus } from 'react-dom';
import { getRecipesStatsById } from '@/actions/getRecipesStatsById';
import { BenchmarkNewSessionFlow } from '@/app/benchmarking/components/benchmarkNewSessionFlow';
import { flowSteps } from '@/app/benchmarking/components/benchmarkNewSessionFlowReducer';
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
    required_config: null,
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
    total_dataset_in_cookbook: 2,
    required_config: {
      configurations: {
        embeddings: ['embed-endpoint-1', 'endpoint-2'],
      },
      endpoints: ['endpoint-id-1'],
    },
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
  updateBenchmarkCookbooks: jest.fn(),
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

jest.mock('@/actions/getRecipesStatsById');

const mockFormState: FormState<BenchmarkRunFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  run_name: '',
  description: '',
  inputs: [],
  endpoints: [],
  prompt_selection_percentage: '1',
  system_prompt: '',
  runner_processing_module: 'benchmarking',
  random_seed: '0',
};

//We are not asserting anything on the form action. In React, form action is a reference to a function (server action). There is no way to stub the action.
//Set it to a string to suppress jest from reporting invalid value prop error.
const mockFormAction = 'unused';

const mockRecipesStats: RecipeStats[] = [
  {
    num_of_datasets_prompts: {
      dataset1: 100,
      dataset2: 200,
    },
    num_of_tags: 3,
    num_of_datasets: 2,
    num_of_prompt_templates: 0,
    num_of_metrics: 2,
    num_of_attack_modules: 1,
  },
  {
    num_of_datasets_prompts: {
      dataset1: 300,
      dataset2: 400,
      dataset3: 500,
    },
    num_of_tags: 5,
    num_of_datasets: 3,
    num_of_prompt_templates: 2,
    num_of_metrics: 3,
    num_of_attack_modules: 2,
  },
];

const mockDispatch = jest.fn();

beforeAll(() => {
  const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
    return [
      mockFormState,
      mockFormAction, // use a dummy string to prevent jest from complaining
    ];
  });
  (useFormState as jest.Mock).mockImplementation(mockUseFormState);
  (useFormStatus as jest.Mock).mockImplementation(() => ({ pending: false }));
  (getRecipesStatsById as jest.Mock).mockResolvedValue({
    status: 'success',
    data: mockRecipesStats,
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
});

beforeEach(() => {
  mockDispatch.mockReset();
  (useAppDispatch as jest.Mock).mockImplementation(() => mockDispatch);
});

it('should show correct views when next or back icons are clicked (No cookbooks with required endpoints selected)', async () => {
  (useAppSelector as jest.Mock).mockImplementation(() => []); //simuate no cookbooks or endpoints selected
  const { rerender } = render(<BenchmarkNewSessionFlow />);
  const nextButton = screen.getByRole('button', { name: /Next View/i });
  expect(nextButton).toBeDisabled();

  const steps = screen.queryAllByRole('step');
  expect(steps).toHaveLength(3);
  flowSteps.forEach((flowStep, index) => {
    expect(steps[index].textContent).toEqual(flowStep);
  });

  // endpoints selection screen
  expect(
    screen.getByRole('step', { name: `Step - ${flowSteps[0]}` }).className
  ).toMatch(/active/);

  for (const endpoint of mockEndpoints) {
    expect(screen.getByText(endpoint.name)).toBeInTheDocument();
  }

  await userEvent.click(
    screen.getByRole('checkbox', {
      name: `Select ${mockEndpoints[0].name}`,
    })
  );

  // simulate 1 endpoint selected after clicking the select endpoint checkbox above, and rerender the component for further assertions
  await act(async () => {
    (useAppSelector as jest.Mock).mockReset();
    let callCount = 1; // relying on the call counter to return the expected value
    // in BenchmarkNewSessionFlow, useAppSelector is called twice to get selectedCookbooks first and then, selectedModels
    (useAppSelector as jest.Mock).mockImplementation(() => {
      if (callCount === 1) {
        callCount++;
        return []; // simulate no cookbooks selected
      }
      callCount--;
      return [mockEndpoints[0]]; // simulate mockEndpoints[0] selected
    });
    rerender(<BenchmarkNewSessionFlow />);
  });

  expect(nextButton).toBeEnabled();
  await userEvent.click(nextButton);

  // cookbooks selection screen
  expect(
    screen.getByRole('step', { name: `Step - ${flowSteps[1]}` }).className
  ).toMatch(/active/);

  for (const cookbook of mockCookbooks) {
    expect(screen.getByText(cookbook.name)).toBeInTheDocument();
  }

  expect(nextButton).toBeDisabled();
  const backButton = screen.getByRole('button', { name: /Previous View/i });
  expect(backButton).toBeEnabled();

  await userEvent.click(
    screen.getByRole('checkbox', {
      name: `Select ${mockCookbooks[0].id}`,
    })
  );
  expect(nextButton).toBeEnabled();

  // simulate 1 endpoint selected and 1 cookbook selected after clicking the select cookbook checkbox above, before clicking next button which will rerender the component
  (useAppSelector as jest.Mock).mockReset();
  let callCount = 1; // relying on the call counter to return the expected value
  // in BenchmarkNewSessionFlow, useAppSelector is called twice to get selectedCookbooks first and then, selectedModels
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [mockCookbooks[0]]; // simulate mockCookbooks[0] selected
    }
    callCount--;
    return [mockEndpoints[0]]; // simulate mockEndpoints[0] selected
  });

  await userEvent.click(nextButton);

  // run form screen
  expect(
    screen.getByRole('step', { name: `Step - ${flowSteps[2]}` }).className
  ).toMatch(/active/);
  expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /next view/i })).toBeNull();

  // prepare to go back
  const prevButton = screen.getByRole('button', { name: /Previous View/i });

  await userEvent.click(prevButton);

  // back at cookbooks selection screen
  expect(
    screen.getByRole('checkbox', {
      name: `Select ${mockCookbooks[0].id}`,
    })
  ).toBeChecked();

  await userEvent.click(prevButton);

  // endpoints selection screen
  for (const endpoint of mockEndpoints) {
    expect(screen.getByText(endpoint.name)).toBeInTheDocument();
  }
});
