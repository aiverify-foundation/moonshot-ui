import { screen, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { NewEndpointForm } from '@/app/endpoints/(edit)/newEndpointForm';
// import { useFormik } from 'formik';
import { useAppSelector } from '@/lib/redux';
import { useGetAllConnectorsQuery } from '@/app/services/connector-api-service';
import {
  useCreateLLMEndpointMutation,
  useUpdateLLMEndpointMutation,
} from '@/app/services/llm-endpoint-api-service';
import userEvent from '@testing-library/user-event';

const mockConnectors = ['connector1', 'connector2'];

jest.mock('@/lib/redux', mockRedux);
jest.mock('@/app/services/connector-api-service', () => ({
  useGetAllConnectorsQuery: jest.fn(),
}));
jest.mock('@/app/services/llm-endpoint-api-service', () => ({
  useCreateLLMEndpointMutation: jest.fn(),
  useUpdateLLMEndpointMutation: jest.fn(),
}));

function mockRedux() {
  return {
    useAppSelector: jest.fn(),
  };
}

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

  test('new endpoint form filling, popup disabled, router redirect on submit success', async () => {
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
    expect(mockCreateModelEndpointSuccess).toHaveBeenCalledWith(
      expectedPayload
    );
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  }, 10000);
});
