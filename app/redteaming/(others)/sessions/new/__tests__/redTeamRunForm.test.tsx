import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormState, useFormStatus } from 'react-dom';
import { RedteamRunForm } from '@/app/redteaming/(others)/sessions/new/redteamRunForm';
import { useAppSelector } from '@/lib/redux';

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
  useAppSelector: jest.fn(),
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

afterEach(() => {
  jest.clearAllMocks();
});

it('should render form initial state', async () => {
  // simulate endpoint and attack module selected
  let callCount = 1;
  (useAppSelector as jest.Mock).mockReset();
  (useAppSelector as jest.Mock).mockImplementation(() => {
    if (callCount === 1) {
      callCount++;
      return [mockEndpoints[0]];
    }
    callCount--;
    return mockAttackModules[0];
  });
  const { container } = render(<RedteamRunForm />);
  const form = container.querySelector('form');
  expect(form).toHaveFormValues({
    name: '',
    description: '',
    endpoints: mockEndpoints[0].id,
    attack_module: mockAttackModules[0].id,
  });
  expect(screen.getByRole('button', { name: /Run/i })).toBeDisabled();
  await userEvent.type(screen.getByLabelText(/Name/i), 'Test Run');
  expect(screen.getByRole('button', { name: /Run/i })).toBeEnabled();
});

it('should display form errors', async () => {
  const { rerender } = render(<RedteamRunForm />);

  await act(async () => {
    (useFormStatus as jest.Mock).mockImplementation(() => ({
      pending: true,
    }));
    rerender(<RedteamRunForm />);
  });

  const mockFormStateWithErrors: FormState<BenchmarkRunFormValues> = {
    ...mockFormState,
    formStatus: 'error',
    formErrors: {
      name: ['mock error 1'],
      description: ['mock error 2'],
      endpoints: ['mock error 3'],
      attack_module: ['mock error 4'],
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
    rerender(<RedteamRunForm />);
  });
  expect(screen.getAllByText('mock error 1')).toHaveLength(2);
  expect(screen.getAllByText('mock error 2')).toHaveLength(2);
  expect(screen.getAllByText('mock error 3')).toHaveLength(1);
  expect(screen.getAllByText('mock error 4')).toHaveLength(1);
});
