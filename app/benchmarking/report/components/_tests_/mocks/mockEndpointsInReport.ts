export const mockEndpointsInReport: LLMEndpoint[] = [
  {
    id: 'endpoint-1',
    name: 'Endpoint 1',
    connector_type: 'type-1',
    uri: 'https://api.example.com/endpoint-1',
    token: 'token-1',
    max_calls_per_second: 10,
    max_concurrency: 5,
    created_date: '2023-01-01T00:00:00Z',
    params: { param1: 'value1', param2: 2, param3: true },
  },
  {
    id: 'endpoint-2',
    name: 'Endpoint 2',
    connector_type: 'type-2',
    uri: 'https://api.example.com/endpoint-2',
    token: 'token-2',
    max_calls_per_second: 20,
    max_concurrency: 10,
    created_date: '2023-01-02T00:00:00Z',
    params: { param1: 'value2', param2: 3, param3: false },
  },
];
