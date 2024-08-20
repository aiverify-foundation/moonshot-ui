import { render, screen } from '@testing-library/react';
import { EndpointDetails } from '@/app/endpoints/(view)/endpointDetails';
import { EndpointsViewList } from '@/app/endpoints/(view)/endpointsViewList';

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      children,
      href,
      onClick,
    }: {
      children: React.ReactNode;
      href: string;
      onClick: React.MouseEventHandler<HTMLAnchorElement>;
    }) => {
      return (
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}>
          {children}
        </a>
      );
    },
  };
});

const mockEndpoints: LLMEndpoint[] = [
  {
    id: '1',
    name: 'Endpoint 1',
    connector_type: 'Type A',
    uri: 'http://example.com/endpoint1',
    token: 'token1',
    max_calls_per_second: 10,
    max_concurrency: 5,
    params: {
      timeout: 300,
      allow_retries: true,
      num_of_retries: 3,
      temperature: 0.5,
      model: 'model1',
    },
    created_date: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Endpoint 2',
    connector_type: 'Type B',
    uri: 'http://example.com/endpoint2',
    token: 'token2',
    max_calls_per_second: 20,
    max_concurrency: 10,
    params: {
      timeout: 200,
      allow_retries: false,
      num_of_retries: 1,
      temperature: 0.7,
      model: 'model2',
    },
    created_date: '2023-02-01T00:00:00.000Z',
  },
];

test('renders EndpointsViewList', async () => {
  render(
    <EndpointsViewList endpoints={mockEndpoints}>
      <EndpointDetails endpoint={mockEndpoints[0]} />
    </EndpointsViewList>
  );

  expect(
    screen.getByRole('link', {
      name: new RegExp(mockEndpoints[0].name, 'i'),
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', {
      name: new RegExp(mockEndpoints[1].name, 'i'),
    })
  ).toBeInTheDocument();

  expect(screen.queryAllByText(mockEndpoints[0].name)).toHaveLength(2);
});
