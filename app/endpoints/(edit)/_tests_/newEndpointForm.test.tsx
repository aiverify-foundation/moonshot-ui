import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';
import {
  useCreateLLMEndpointMutation,
  useUpdateLLMEndpointMutation,
} from '@/app/services/llm-endpoint-api-service';
import { useAppSelector } from '@/lib/redux';

const mockConnectors = ['connector1', 'connector2'];

jest.mock('@/app/services/connector-api-service', () => ({
  useGetAllConnectorsQuery: jest.fn(),
}));
jest.mock('@/app/services/llm-endpoint-api-service', () => ({
  useCreateLLMEndpointMutation: jest.fn(),
  useUpdateLLMEndpointMutation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NewEndpointForm', () => {
  const mockCreateModelEndpoint = jest.fn();
  const mockUpdateModelEndpoint = jest.fn();
  const mockRouterPush = jest.fn();
  const mockRouterRefresh = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockRouterPush,
      refresh: mockRouterRefresh,
    }));
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('other parameters textbox', async () => {
    render(<NewEndpointForm />);

    await userEvent.click(screen.getByText(/more configs/i));

    const otherParamsTextbox = screen.getByRole('textbox', {
      name: /other parameters/i,
    });
    const okButton = screen.getByRole('button', { name: /ok/i });
    expect(
      screen.getByRole('combobox', { name: /max calls per second .*/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /max concurrency .*/i })
    ).toBeInTheDocument();
    expect(otherParamsTextbox).toBeInTheDocument();

    await userEvent.clear(otherParamsTextbox);
    expect(okButton).toBeDisabled();

    await userEvent.type(otherParamsTextbox, 'test');
    expect(okButton).toBeEnabled();

    await userEvent.click(okButton);
    expect(screen.getByText(/.* is not valid JSON/i)).toBeInTheDocument();

    const mockMissingModelParams = `{
      "timeout": 300,
      "allow_retries": true,
      "num_of_retries": 3,
      "temperature": 0.5,
      "model": ""
    }`;

    // Escape { and [
    const escapedMockMissingModelParams = mockMissingModelParams.replace(
      /[{[]/g,
      '$&$&'
    );
    await userEvent.clear(otherParamsTextbox);
    await userEvent.type(otherParamsTextbox, escapedMockMissingModelParams);
    await userEvent.click(okButton);
    expect(
      screen.getByText(/parameter \"model\" is required/i)
    ).toBeInTheDocument();
  });

  test('new endpoint - form filling, popup disabled, router redirect on submit success', async () => {
    const mockCreateModelEndpointSuccess = jest.fn().mockResolvedValue({});
    (useCreateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
      mockCreateModelEndpointSuccess,
      { isLoading: false },
    ]);

    render(<NewEndpointForm disablePopupLayout />);

    const nameTextbox = screen.getByRole('textbox', { name: /name/i });
    const connectorSelect = screen.getByRole('combobox');
    const uriTextbox = screen.getByRole('textbox', { name: /uri/i });
    const tokenTextbox = screen.getByRole('textbox', { name: /token/i });

    await userEvent.clear(nameTextbox);
    await userEvent.clear(uriTextbox);
    await userEvent.clear(tokenTextbox);

    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/token is required/i)).toBeInTheDocument();

    await userEvent.type(nameTextbox, 'mockname');
    await userEvent.type(tokenTextbox, 'mocktoken');
    await userEvent.type(uriTextbox, 'mockuri');
    await userEvent.type(connectorSelect, mockConnectors[0]);
    await userEvent.type(connectorSelect, '{enter}');
    await userEvent.click(screen.getByText(/more configs/i));

    const mockValidParams = `{
      "timeout": 300,
      "allow_retries": true,
      "num_of_retries": 3,
      "temperature": 0.5,
      "model": "mock-model"
    }`;

    const otherParamsTextbox = screen.getByRole('textbox', {
      name: /other parameters/i,
    });

    // Escape { and [
    const escapedMockValidParams = mockValidParams.replace(/[{[]/g, '$&$&');
    await userEvent.clear(otherParamsTextbox);
    await userEvent.type(otherParamsTextbox, escapedMockValidParams);
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();

    const expectedPayload = {
      connector_type: 'connector1',
      max_calls_per_second: '10',
      max_concurrency: '1',
      name: 'mockname',
      params: `{
      \"timeout\": 300,
      \"allow_retries\": true,
      \"num_of_retries\": 3,
      \"temperature\": 0.5,
      \"model\": \"mock-model\"
    }`,
      token: 'mocktoken',
      uri: 'mockuri',
    };
    expect(mockCreateModelEndpointSuccess).toHaveBeenCalledWith(
      expectedPayload
    );
    expect(mockRouterPush).toHaveBeenCalledWith('/endpoints');
  }, 10000);

  test('form submit - error response', async () => {
    const mockCreateModelEndpointError = jest
      .fn()
      .mockResolvedValue({ error: 'mock error message' });
    (useCreateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
      mockCreateModelEndpointError,
      { isLoading: false },
    ]);

    render(<NewEndpointForm />);

    const nameTextbox = screen.getByRole('textbox', { name: /name/i });
    const connectorSelect = screen.getByRole('combobox');
    const uriTextbox = screen.getByRole('textbox', { name: /uri/i });
    const tokenTextbox = screen.getByRole('textbox', { name: /token/i });

    await userEvent.clear(nameTextbox);
    await userEvent.clear(uriTextbox);
    await userEvent.clear(tokenTextbox);

    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/token is required/i)).toBeInTheDocument();

    await userEvent.type(nameTextbox, 'mockname');
    await userEvent.type(tokenTextbox, 'mocktoken');
    await userEvent.type(uriTextbox, 'mockuri');
    await userEvent.type(connectorSelect, mockConnectors[0]);
    await userEvent.type(connectorSelect, '{enter}');
    await userEvent.click(screen.getByText(/more configs/i));

    const mockValidParams = `{
      "timeout": 300,
      "allow_retries": true,
      "num_of_retries": 3,
      "temperature": 0.5,
      "model": "mock-model"
    }`;

    const otherParamsTextbox = screen.getByRole('textbox', {
      name: /other parameters/i,
    });

    // Escape { and [
    const escapedMockValidParams = mockValidParams.replace(/[{[]/g, '$&$&');
    await userEvent.clear(otherParamsTextbox);
    await userEvent.type(otherParamsTextbox, escapedMockValidParams);
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('button', { name: /save/i })).not.toBeDisabled();

    const expectedPayload = {
      connector_type: 'connector1',
      max_calls_per_second: '10',
      max_concurrency: '1',
      name: 'mockname',
      params: `{
      \"timeout\": 300,
      \"allow_retries\": true,
      \"num_of_retries\": 3,
      \"temperature\": 0.5,
      \"model\": \"mock-model\"
    }`,
      token: 'mocktoken',
      uri: 'mockuri',
    };
    expect(mockCreateModelEndpointError).toHaveBeenCalledWith(expectedPayload);
    expect(screen.getByText(/mock error message/i)).toBeInTheDocument();
  }, 10000);

  test('on close callback', async () => {
    const mockCreateModelEndpointSuccess = jest.fn().mockResolvedValue({});
    const mockCloseHandler = jest.fn();
    (useCreateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
      mockCreateModelEndpointSuccess,
      { isLoading: false },
    ]);

    render(<NewEndpointForm onClose={mockCloseHandler} />);

    const nameTextbox = screen.getByRole('textbox', { name: /name/i });
    const connectorSelect = screen.getByRole('combobox');
    const uriTextbox = screen.getByRole('textbox', { name: /uri/i });
    const tokenTextbox = screen.getByRole('textbox', { name: /token/i });

    await userEvent.clear(nameTextbox);
    await userEvent.clear(uriTextbox);
    await userEvent.clear(tokenTextbox);

    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/token is required/i)).toBeInTheDocument();

    await userEvent.type(nameTextbox, 'mockname');
    await userEvent.type(tokenTextbox, 'mocktoken');
    await userEvent.type(uriTextbox, 'mockuri');
    await userEvent.type(connectorSelect, mockConnectors[0]);
    await userEvent.type(connectorSelect, '{enter}');
    await userEvent.click(screen.getByText(/more configs/i));

    const mockValidParams = `{
      "timeout": 300,
      "allow_retries": true,
      "num_of_retries": 3,
      "temperature": 0.5,
      "model": "mock-model"
    }`;

    const otherParamsTextbox = screen.getByRole('textbox', {
      name: /other parameters/i,
    });

    // Escape { and [
    const escapedMockValidParams = mockValidParams.replace(/[{[]/g, '$&$&');
    await userEvent.clear(otherParamsTextbox);
    await userEvent.type(otherParamsTextbox, escapedMockValidParams);
    await userEvent.click(screen.getByRole('button', { name: /ok/i }));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();

    const expectedPayload = {
      connector_type: 'connector1',
      max_calls_per_second: '10',
      max_concurrency: '1',
      name: 'mockname',
      params: `{
      \"timeout\": 300,
      \"allow_retries\": true,
      \"num_of_retries\": 3,
      \"temperature\": 0.5,
      \"model\": \"mock-model\"
    }`,
      token: 'mocktoken',
      uri: 'mockuri',
    };
    expect(mockCreateModelEndpointSuccess).toHaveBeenCalledWith(
      expectedPayload
    );
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  }, 10000);

  test('edit endpoint - form filling, no change to token value', async () => {
    const mockUpdateModelEndpointSuccess = jest.fn().mockResolvedValue({});
    (useUpdateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
      mockUpdateModelEndpointSuccess,
      { isLoading: false },
    ]);

    const mockEndpoint: LLMEndpoint = {
      id: 'mock-id',
      connector_type: 'connector1',
      name: 'mockname',
      uri: 'mockuri',
      token: '*****',
      max_calls_per_second: 10,
      max_concurrency: 1,
      created_date: '2024-11-15T00:00:00.000Z',
      params: {
        timeout: 300,
        allow_retries: true,
        num_of_retries: 3,
        temperature: 0.5,
        model: 'mock-model',
      },
    };

    const {
      id: _,
      token: __,
      created_date: ___,
      max_calls_per_second,
      max_concurrency,
      params,
      ...restOfMockEndpoint
    } = mockEndpoint;

    const expectedPayloadWithoutToken = {
      ...restOfMockEndpoint,
      name: `${mockEndpoint.name}-edited`,
      max_calls_per_second: String(max_calls_per_second),
      max_concurrency: String(max_concurrency),
      params: JSON.stringify(params, null, 2),
    };

    render(<NewEndpointForm endpointToEdit={mockEndpoint} />);

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    expect(screen.getByDisplayValue(mockEndpoint.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockEndpoint.uri)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockEndpoint.token)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockEndpoint.connector_type)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByText(/more configs/i));
    expect(
      screen.getByDisplayValue(mockEndpoint.max_calls_per_second.toString())
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockEndpoint.max_concurrency.toString())
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /other parameters/i })
    ).toHaveValue(JSON.stringify(mockEndpoint.params, null, 2));

    await userEvent.click(screen.getByRole('button', { name: /ok/i }));

    const nameTextbox = screen.getByDisplayValue(mockEndpoint.name);
    const saveBtn = screen.getByRole('button', { name: /save/i });
    await userEvent.type(nameTextbox, '--');
    expect(saveBtn).toBeEnabled();

    await userEvent.type(nameTextbox, '{backspace}{backspace}');
    expect(saveBtn).toBeDisabled();

    await userEvent.type(nameTextbox, '-edited');
    expect(saveBtn).toBeEnabled();

    const tokenTextbox = screen.getByDisplayValue(mockEndpoint.token);
    await userEvent.click(tokenTextbox);
    expect(tokenTextbox).toHaveValue('');
    await userEvent.click(nameTextbox);
    expect(tokenTextbox).toHaveValue(mockEndpoint.token);

    await userEvent.click(saveBtn);
    expect(mockUpdateModelEndpointSuccess).toHaveBeenCalledWith({
      id: mockEndpoint.id,
      endpointDetails: expectedPayloadWithoutToken,
    });
  }, 10000);

  test('edit endpoint - form filling, token value updated', async () => {
    const mockUpdateModelEndpointSuccess = jest.fn().mockResolvedValue({});
    (useUpdateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
      mockUpdateModelEndpointSuccess,
      { isLoading: false },
    ]);

    const mockEndpoint: LLMEndpoint = {
      id: 'mock-id',
      connector_type: 'connector1',
      name: 'mockname',
      uri: 'mockuri',
      token: '*****',
      max_calls_per_second: 10,
      max_concurrency: 1,
      created_date: '2024-11-15T00:00:00.000Z',
      params: {
        timeout: 300,
        allow_retries: true,
        num_of_retries: 3,
        temperature: 0.5,
        model: 'mock-model',
      },
    };

    const {
      id: _,
      token: __,
      created_date: ___,
      max_calls_per_second,
      max_concurrency,
      params,
      ...restOfMockEndpoint
    } = mockEndpoint;

    const updatedToken = 'updated-token';
    const expectedPayloadWithToken = {
      ...restOfMockEndpoint,
      token: updatedToken,
      name: `${mockEndpoint.name}-edited`,
      max_calls_per_second: String(max_calls_per_second),
      max_concurrency: String(max_concurrency),
      params: JSON.stringify(params, null, 2),
    };

    render(<NewEndpointForm endpointToEdit={mockEndpoint} />);

    const nameTextbox = screen.getByDisplayValue(mockEndpoint.name);
    const saveBtn = screen.getByRole('button', { name: /save/i });

    await userEvent.type(nameTextbox, '-edited');
    expect(saveBtn).toBeEnabled();

    const tokenTextbox = screen.getByDisplayValue(mockEndpoint.token);
    await userEvent.click(tokenTextbox);
    expect(tokenTextbox).toHaveValue('');
    await userEvent.type(tokenTextbox, updatedToken);
    await userEvent.click(saveBtn);
    expect(mockUpdateModelEndpointSuccess).toHaveBeenCalledWith({
      id: mockEndpoint.id,
      endpointDetails: expectedPayloadWithToken,
    });
  }, 10000);

  test('edit endpoint - form filling, no inital token value (default fresh install), new token added', async () => {
    const mockUpdateModelEndpointSuccess = jest.fn().mockResolvedValue({});
    (useUpdateLLMEndpointMutation as jest.Mock).mockImplementation(() => [
      mockUpdateModelEndpointSuccess,
      { isLoading: false },
    ]);

    const mockEndpoint: LLMEndpoint = {
      id: 'mock-id',
      connector_type: 'connector1',
      name: 'mockname',
      uri: 'mockuri',
      token: '',
      max_calls_per_second: 10,
      max_concurrency: 1,
      created_date: '2024-11-15T00:00:00.000Z',
      params: {
        timeout: 300,
        allow_retries: true,
        num_of_retries: 3,
        temperature: 0.5,
        model: 'mock-model',
      },
    };

    const {
      id: _,
      token: __,
      created_date: ___,
      max_calls_per_second,
      max_concurrency,
      params,
      ...restOfMockEndpoint
    } = mockEndpoint;

    const newToken = 'new-token';
    const expectedPayloadWithToken = {
      ...restOfMockEndpoint,
      token: newToken,
      name: mockEndpoint.name,
      max_calls_per_second: String(max_calls_per_second),
      max_concurrency: String(max_concurrency),
      params: JSON.stringify(params, null, 2),
    };

    render(<NewEndpointForm endpointToEdit={mockEndpoint} />);

    const nameTextbox = screen.getByDisplayValue(mockEndpoint.name);
    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeDisabled();

    const tokenTextbox = screen.getByRole('textbox', {name: /token/i});
    await userEvent.click(tokenTextbox);
    expect(tokenTextbox).toHaveValue('');
    await userEvent.type(tokenTextbox, newToken);
    await waitFor(() => expect(saveBtn).toBeEnabled());
    await userEvent.click(saveBtn);
    expect(mockUpdateModelEndpointSuccess).toHaveBeenCalledWith({
      id: mockEndpoint.id,
      endpointDetails: expectedPayloadWithToken,
    });
  }, 10000);
});
