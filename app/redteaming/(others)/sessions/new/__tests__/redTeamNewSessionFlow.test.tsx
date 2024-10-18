import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormState, useFormStatus } from 'react-dom';
import { useModelsList } from '@/app/hooks/useLLMEndpointList';
import { RedteamNewSessionFlow } from '@/app/redteaming/(others)/sessions/new/redteamNewSessionFlow';
import { useGetAllAttackModulesQuery } from '@/app/services/attack-modules-api-service';
import { useAppDispatch, useAppSelector } from '@/lib/redux';
// import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';

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

const mockAttackModules: AttackModule[] = [
  {
    id: '1',
    name: 'Attack Module 1',
    description: 'Description 1',
    endpoints: [],
    configurations: { param1: 'value1' },
  },
  {
    id: '2',
    name: 'Attack Module 2',
    description: 'Description 1',
    endpoints: [],
    configurations: { param1: 'value1' },
  },
];

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

//We are not asserting anything on the form action. In React, form action is a reference to a function (server action). There is no way to stub the action.
//Set it to a string to suppress jest from reporting invalid value prop error.
const mockFormAction = 'unused';

jest.mock('react-dom', () => {
  const actualReactDomApis = jest.requireActual('react-dom');
  return {
    ...actualReactDomApis,
    useFormState: jest.fn(),
    useFormStatus: jest.fn(),
  };
});

jest.mock('@/lib/redux', () => ({
  addRedteamModels: jest.fn(),
  removeRedteamModels: jest.fn(),
  resetAttackModule: jest.fn(),
  resetRedteamModels: jest.fn(),
  setAttackModule: jest.fn(),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/app/services/cookbook-api-service', () => ({
  useGetCookbooksQuery: jest.fn(),
}));
jest.mock('@/app/services/connector-api-service', () => ({
  useGetAllConnectorsQuery: jest.fn(),
}));
jest.mock('@/app/services/attack-modules-api-service', () => ({
  useGetAllAttackModulesQuery: jest.fn(),
}));
jest.mock('@/app/services/session-api-service', () => ({
  useCreateSessionMutation: jest.fn(),
}));
jest.mock('@/app/services/llm-endpoint-api-service', () => ({
  useCreateLLMEndpointMutation: jest.fn(),
  useUpdateLLMEndpointMutation: jest.fn(),
}));
jest.mock('@/app/hooks/useLLMEndpointList', () => ({
  useModelsList: jest.fn(),
}));

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

it('should show the correct views when next or back icons are clicked', async () => {
  (useAppSelector as jest.Mock).mockImplementation(() => []);
  (useModelsList as jest.Mock).mockImplementation(() => ({
    models: mockEndpoints,
    isLoading: false,
    error: null,
  }));
  (useGetAllAttackModulesQuery as jest.Mock).mockImplementation(() => ({
    data: mockAttackModules,
    isLoading: false,
    error: null,
  }));
  (useAppDispatch as jest.Mock).mockImplementation(() => jest.fn());

  const { rerender } = render(<RedteamNewSessionFlow />);
  const nextButton = screen.getByRole('button', { name: /next view/i });

  // endpoints selection screen
  for (const endpoint of mockEndpoints) {
    expect(screen.getByText(endpoint.name)).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: `Select ${endpoint.name}` })
    ).not.toBeChecked();
  }
  await userEvent.click(
    screen.getByRole('checkbox', { name: `Select ${mockEndpoints[0].name}` })
  );
  expect(
    screen.getByRole('checkbox', { name: /Select Endpoint 1/i })
  ).toBeChecked();
  await userEvent.click(nextButton);

  // attack modules selection screen
  for (const attackModule of mockAttackModules) {
    expect(screen.getByText(attackModule.name)).toBeInTheDocument();
  }
  screen.debug();
  expect(
    screen.queryByRole('button', { name: /next view/i })
  ).not.toBeInTheDocument();
});
