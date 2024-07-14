import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModelsList } from '@/app/hooks/useLLMEndpointList';
import { EndpointSelectVew } from '@/app/views/models-management/endpointsSelector';

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

const mockModelClickHandler = jest.fn();
const mockEditClickHandler = jest.fn();
const mockCreateClickHandler = jest.fn();

jest.mock('@/app/hooks/useLLMEndpointList', () => ({
  useModelsList: jest.fn(),
}));

describe('EndpointSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator', () => {
    (useModelsList as jest.Mock).mockImplementation(() => ({
      models: [],
      isLoading: true,
      error: null,
    }));

    render(
      <EndpointSelectVew
        totalSelected={0}
        selectedModels={[]}
        onModelClick={mockModelClickHandler}
        onEditClick={mockEditClickHandler}
        onCreateClick={mockCreateClickHandler}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays endpoints', () => {
    (useModelsList as jest.Mock).mockImplementation(() => ({
      models: mockEndpoints,
      isLoading: false,
      error: null,
    }));

    render(
      <EndpointSelectVew
        totalSelected={0}
        selectedModels={[]}
        onModelClick={mockModelClickHandler}
        onEditClick={mockEditClickHandler}
        onCreateClick={mockCreateClickHandler}
      />
    );

    expect(screen.queryByText(/loading/i)).toBeNull();
    expect(screen.queryAllByRole('checkbox')).toHaveLength(2);
  });

  it('check selected endpoint checkbox', async () => {
    (useModelsList as jest.Mock).mockImplementation(() => ({
      models: mockEndpoints,
      isLoading: false,
      error: null,
    }));

    render(
      <EndpointSelectVew
        totalSelected={0}
        selectedModels={[mockEndpoints[1]]}
        onModelClick={mockModelClickHandler}
        onEditClick={mockEditClickHandler}
        onCreateClick={mockCreateClickHandler}
      />
    );

    const selectedCheckbox = screen.getByRole('checkbox', {
      name: `Select ${mockEndpoints[1].name}`,
    });

    expect(selectedCheckbox).toBeChecked();

    await userEvent.click(selectedCheckbox);
    expect(mockModelClickHandler).toHaveBeenCalledWith(mockEndpoints[1]);
    expect(mockModelClickHandler).toHaveBeenCalledTimes(1);

    const editButtons = screen.queryAllByRole('button', {
      name: /edit/i,
    });

    await userEvent.click(editButtons[0]);

    expect(mockEditClickHandler).toHaveBeenCalledWith(mockEndpoints[0]);
    expect(mockEditClickHandler).toHaveBeenCalledTimes(1);

    await userEvent.click(
      screen.getByRole('button', {
        name: /create new endpoint/i,
      })
    );

    expect(mockEditClickHandler).toHaveBeenCalledTimes(1);
  });
});
