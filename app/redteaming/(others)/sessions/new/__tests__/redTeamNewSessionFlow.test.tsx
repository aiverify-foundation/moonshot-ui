import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormState, useFormStatus } from 'react-dom';
import { useModelsList } from '@/app/hooks/useLLMEndpointList';
import { RedteamNewSessionFlow } from '@/app/redteaming/(others)/sessions/new/redteamNewSessionFlow';
import { useGetAllAttackModulesQuery } from '@/app/services/attack-modules-api-service';
import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';
import {
  useCreateLLMEndpointMutation,
  useUpdateLLMEndpointMutation,
} from '@/app/services/llm-endpoint-api-service';
import {
  addRedteamModels,
  removeRedteamModels,
  setAttackModule,
  resetAttackModule,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';

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

const mockFormState: FormState<RedteamRunFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  name: '',
  description: '',
  endpoints: [],
  attack_module: undefined,
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

const mockAppDispatch: jest.Mock = jest.fn();

beforeAll(() => {
  const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
    return [
      mockFormState,
      mockFormAction, // use a dummy string to prevent jest from complaining
    ];
  });
  (useFormState as jest.Mock).mockImplementation(mockUseFormState);
  (useFormStatus as jest.Mock).mockImplementation(() => ({ pending: false }));

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

  (useAppDispatch as jest.Mock).mockImplementation(() => mockAppDispatch);
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should select/unselect endpoint, go to attack modules selection screen when next button is clicked', async () => {
  let callCount = 1;
  // relying on the Nth time useAppSelector is called, it returns the expected value. useAppSelector is called twice in the component.
  // first call returns selectedModels. second call returns selectedAttack
  // similate 1 endpoint selected
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [mockEndpoints[0]];
    }
    callCount--;
    return undefined;
  });

  const mockAddRedteamModels: jest.Mock = jest.fn();
  (addRedteamModels as unknown as jest.Mock).mockImplementation(
    mockAddRedteamModels
  );
  const mockRemoveRedteamModels: jest.Mock = jest.fn();
  (removeRedteamModels as unknown as jest.Mock).mockImplementation(
    mockRemoveRedteamModels
  );

  const { rerender } = render(<RedteamNewSessionFlow />);
  const nextButton = screen.getByRole('button', { name: /next view/i });

  // endpoints selection screen, 1 endpoint selected
  for (const endpoint of mockEndpoints) {
    expect(screen.getByText(endpoint.name)).toBeInTheDocument();
  }
  expect(
    screen.getByRole('checkbox', { name: `Select ${mockEndpoints[0].name}` })
  ).toBeChecked();

  // unselect endpoint
  await userEvent.click(
    screen.getByRole('checkbox', { name: `Select ${mockEndpoints[0].name}` })
  );
  expect(
    screen.getByRole('checkbox', { name: `Select ${mockEndpoints[0].name}` })
  ).not.toBeChecked();
  expect(mockAppDispatch).toHaveBeenCalled();
  expect(mockRemoveRedteamModels).toHaveBeenCalledWith([mockEndpoints[0]]);

  await act(() => {
    let callCount = 1;
    // similate no endpoint selected
    (useAppSelector as jest.Mock).mockReset();
    (useAppSelector as jest.Mock).mockImplementation(() => {
      if (callCount === 1) {
        callCount++;
        return [];
      }
      callCount--;
      return undefined;
    });

    rerender(<RedteamNewSessionFlow />);
  });

  await userEvent.click(
    screen.getByRole('checkbox', { name: `Select ${mockEndpoints[0].name}` })
  );
  expect(
    screen.getByRole('checkbox', { name: `Select ${mockEndpoints[0].name}` })
  ).toBeChecked();

  expect(mockAppDispatch).toHaveBeenCalled();
  expect(mockAddRedteamModels).toHaveBeenCalledWith([mockEndpoints[0]]);

  // select endpoint and go to next screen
  await userEvent.click(nextButton);

  // attack modules selection screen
  for (const attackModule of mockAttackModules) {
    expect(screen.getByText(attackModule.name)).toBeInTheDocument();
  }
});

it('should select/unselect attack module, go to run form screen when next button is clicked', async () => {
  let callCount = 1;
  // no endpoint selected, attack module is undefined (not selected)
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [];
    }
    callCount--;
    return undefined;
  });

  const mockSetAttackModule: jest.Mock = jest.fn();
  (setAttackModule as unknown as jest.Mock).mockImplementation(
    mockSetAttackModule
  );
  const mockResetAttackModule: jest.Mock = jest.fn();
  (resetAttackModule as unknown as jest.Mock).mockImplementation(
    mockResetAttackModule
  );

  const { rerender } = render(<RedteamNewSessionFlow />);
  await userEvent.click(
    screen.getByRole('checkbox', { name: `Select ${mockEndpoints[0].name}` })
  );
  const nextButton = screen.getByRole('button', { name: /next view/i });
  await userEvent.click(nextButton);

  // attack module selection screen, select attack module
  expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
  await userEvent.click(screen.getByText(mockAttackModules[0].name));
  expect(mockAppDispatch).toHaveBeenCalled();
  expect(mockSetAttackModule).toHaveBeenCalledWith(mockAttackModules[0]);
  expect(screen.queryByRole('button', { name: /skip/i })).toBeNull();

  // simulate attack module selected
  await act(() => {
    let callCount = 1;
    // attack module selected
    (useAppSelector as jest.Mock).mockReset();
    (useAppSelector as jest.Mock).mockImplementation(() => {
      if (callCount === 1) {
        callCount++;
        return [mockEndpoints[0]];
      }
      callCount--;
      return mockAttackModules[0];
    });

    rerender(<RedteamNewSessionFlow />);
  });
  // unselect attack module
  await userEvent.click(screen.getByText(mockAttackModules[0].name));
  expect(mockAppDispatch).toHaveBeenCalled();
  expect(mockResetAttackModule).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();

  // simulate no attack module selected again
  await act(() => {
    let callCount = 1;
    // attack module selected
    (useAppSelector as jest.Mock).mockReset();
    (useAppSelector as jest.Mock).mockImplementation(() => {
      if (callCount === 1) {
        callCount++;
        return [mockEndpoints[0]];
      }
      callCount--;
      return undefined;
    });

    rerender(<RedteamNewSessionFlow />);
  });

  // select attack module
  await userEvent.click(screen.getByText(mockAttackModules[0].name));

  // simulate attack module selected
  await act(() => {
    let callCount = 1;
    // attack module selected
    (useAppSelector as jest.Mock).mockReset();
    (useAppSelector as jest.Mock).mockImplementation(() => {
      if (callCount === 1) {
        callCount++;
        return [mockEndpoints[0]];
      }
      callCount--;
      return mockAttackModules[0];
    });

    rerender(<RedteamNewSessionFlow />);
  });
  await userEvent.click(screen.getByRole('button', { name: /next view/i }));
  expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();

  // test going back to attack module selection screen
  await userEvent.click(screen.getByRole('button', { name: /previous view/i }));
  expect(screen.getByText(mockAttackModules[0].name)).toBeInTheDocument();

  // test going back to endpoint selection screen
  await userEvent.click(screen.getByRole('button', { name: /previous view/i }));
  expect(screen.getByText(mockEndpoints[0].name)).toBeInTheDocument();
});

it('should show new endpoint form', async () => {
  const mockCreateModelEndpoint = jest.fn();
  const mockUpdateModelEndpoint = jest.fn();
  const mockConnectors = ['connector1', 'connector2'];
  let callCount = 1;
  // no endpoint selected, attack module is undefined (not selected)
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [];
    }
    callCount--;
    return undefined;
  });
  (useGetAllConnectorsQuery as jest.Mock).mockImplementation(() => ({
    data: mockConnectors,
    loading: false,
  }));
  (useCreateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
    mockCreateModelEndpoint,
    { isLoading: false },
  ]);
  (useUpdateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
    mockUpdateModelEndpoint,
    { isLoading: false },
  ]);

  const mockSetAttackModule: jest.Mock = jest.fn();
  (setAttackModule as unknown as jest.Mock).mockImplementation(
    mockSetAttackModule
  );
  const mockResetAttackModule: jest.Mock = jest.fn();
  (resetAttackModule as unknown as jest.Mock).mockImplementation(
    mockResetAttackModule
  );

  render(<RedteamNewSessionFlow />);
  await userEvent.click(
    screen.getByRole('button', { name: /create new endpoint/i })
  );
  expect(screen.getByText('Create New Endpoint')).toBeInTheDocument();
});

it('should show edit endpoint form', async () => {
  const mockCreateModelEndpoint = jest.fn();
  const mockUpdateModelEndpoint = jest.fn();
  const mockConnectors = ['connector1', 'connector2'];
  let callCount = 1;
  // no endpoint selected, attack module is undefined (not selected)
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [];
    }
    callCount--;
    return undefined;
  });
  (useGetAllConnectorsQuery as jest.Mock).mockImplementation(() => ({
    data: mockConnectors,
    loading: false,
  }));
  (useCreateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
    mockCreateModelEndpoint,
    { isLoading: false },
  ]);
  (useUpdateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
    mockUpdateModelEndpoint,
    { isLoading: false },
  ]);

  const mockSetAttackModule: jest.Mock = jest.fn();
  (setAttackModule as unknown as jest.Mock).mockImplementation(
    mockSetAttackModule
  );
  const mockResetAttackModule: jest.Mock = jest.fn();
  (resetAttackModule as unknown as jest.Mock).mockImplementation(
    mockResetAttackModule
  );

  render(<RedteamNewSessionFlow />);
  await userEvent.click(
    screen.getByRole('button', { name: `Edit ${mockEndpoints[0].name}` })
  );
  expect(
    screen.getByText(`Update ${mockEndpoints[0].name}`)
  ).toBeInTheDocument();
});
