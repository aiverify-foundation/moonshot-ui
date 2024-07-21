import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EndpointDetails } from '@/app/endpoints/(view)/endpointDetails';
import { EndpointsViewList } from '@/app/endpoints/(view)/endpointsViewList';

jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({
      children,
      href,
      onClick,
      onMouseEnter,
      onMouseLeave,
    }: {
      children: React.ReactNode;
      href: string;
      onClick: React.MouseEventHandler<HTMLAnchorElement>;
      onMouseEnter: React.MouseEventHandler<HTMLAnchorElement>;
      onMouseLeave: React.MouseEventHandler<HTMLAnchorElement>;
    }) => {
      return (
        <a
          href={href}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
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
  await userEvent.click(
    screen.getByRole('link', {
      name: new RegExp(mockEndpoints[1].name, 'i'),
    })
  );
  expect(screen.getByRole('list')).toMatchInlineSnapshot(`
    <ul
      class="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar"
      role="list"
    >
      <li
        class=" bg-moongray-900 text-white hover:bg-moongray-800  hover:border-moonwine-700 cursor-pointer"
        style="transition: background-color 0.2s ease-in-out;"
      >
        <a
          href="/endpoints/1"
        >
          <div
            class="flex gap-2 mb-3 items-start"
          >
            <div
              class="
            flex items-center justify-center 
            default
            
            
          "
            >
              <svg
                fill="none"
                height="20"
                stroke="#FFFFFF"
                viewBox="0 0 49 54"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M46.0999 15.0219L24.5395 26.9999M24.5395 26.9999L2.97911 15.0219M24.5395 26.9999L24.5396 51.0969M47.3682 37.2946V16.7054C47.3682 15.8363 47.3682 15.4017 47.2402 15.0142C47.1269 14.6713 46.9417 14.3565 46.697 14.091C46.4204 13.7908 46.0405 13.5798 45.2807 13.1577L26.5105 2.72982C25.7912 2.33017 25.4315 2.13034 25.0506 2.052C24.7134 1.98267 24.3657 1.98267 24.0286 2.052C23.6477 2.13034 23.288 2.33017 22.5686 2.72982L3.79842 13.1577C3.03867 13.5798 2.6588 13.7908 2.38218 14.091C2.13747 14.3566 1.95228 14.6713 1.83899 15.0142C1.71094 15.4017 1.71094 15.8363 1.71094 16.7054V37.2946C1.71094 38.1637 1.71094 38.5983 1.83899 38.9858C1.95228 39.3287 2.13747 39.6435 2.38218 39.909C2.6588 40.2092 3.03867 40.4202 3.79842 40.8423L22.5686 51.2702C23.288 51.6698 23.6477 51.8697 24.0286 51.948C24.3657 52.0173 24.7134 52.0173 25.0506 51.948C25.4315 51.8697 25.7912 51.6698 26.5105 51.2702L45.2807 40.8423C46.0405 40.4202 46.4204 40.2092 46.697 39.909C46.9417 39.6435 47.1269 39.3287 47.2402 38.9858C47.3682 38.5983 47.3682 38.1637 47.3682 37.2946Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
              </svg>
            </div>
            <div>
              <h4
                class="text-[1rem] font-semibold"
              >
                Endpoint 1
              </h4>
              <p
                class="text-[0.9rem]"
              >
                <span
                  class="font-semibold"
                >
                  Type
                </span>
                 
                <span
                  class="text-moongray-300"
                >
                  Type A
                </span>
              </p>
            </div>
          </div>
          <p
            class="text-[0.8rem] text-moongray-300 text-right"
          >
            Added on 
            Jan 01, 2023, 08:00:00
          </p>
        </a>
      </li>
      <li
        class=" bg-moongray-900 text-white hover:bg-moongray-800  hover:border-moonwine-700 cursor-pointer"
        style="transition: background-color 0.2s ease-in-out; background-color: rgb(82, 78, 86);"
      >
        <a
          href="/endpoints/2"
        >
          <div
            class="flex gap-2 mb-3 items-start"
          >
            <div
              class="
            flex items-center justify-center 
            default
            
            
          "
            >
              <svg
                fill="none"
                height="20"
                stroke="#FFFFFF"
                viewBox="0 0 49 54"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M46.0999 15.0219L24.5395 26.9999M24.5395 26.9999L2.97911 15.0219M24.5395 26.9999L24.5396 51.0969M47.3682 37.2946V16.7054C47.3682 15.8363 47.3682 15.4017 47.2402 15.0142C47.1269 14.6713 46.9417 14.3565 46.697 14.091C46.4204 13.7908 46.0405 13.5798 45.2807 13.1577L26.5105 2.72982C25.7912 2.33017 25.4315 2.13034 25.0506 2.052C24.7134 1.98267 24.3657 1.98267 24.0286 2.052C23.6477 2.13034 23.288 2.33017 22.5686 2.72982L3.79842 13.1577C3.03867 13.5798 2.6588 13.7908 2.38218 14.091C2.13747 14.3566 1.95228 14.6713 1.83899 15.0142C1.71094 15.4017 1.71094 15.8363 1.71094 16.7054V37.2946C1.71094 38.1637 1.71094 38.5983 1.83899 38.9858C1.95228 39.3287 2.13747 39.6435 2.38218 39.909C2.6588 40.2092 3.03867 40.4202 3.79842 40.8423L22.5686 51.2702C23.288 51.6698 23.6477 51.8697 24.0286 51.948C24.3657 52.0173 24.7134 52.0173 25.0506 51.948C25.4315 51.8697 25.7912 51.6698 26.5105 51.2702L45.2807 40.8423C46.0405 40.4202 46.4204 40.2092 46.697 39.909C46.9417 39.6435 47.1269 39.3287 47.2402 38.9858C47.3682 38.5983 47.3682 38.1637 47.3682 37.2946Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                />
              </svg>
            </div>
            <div>
              <h4
                class="text-[1rem] font-semibold"
              >
                Endpoint 2
              </h4>
              <p
                class="text-[0.9rem]"
              >
                <span
                  class="font-semibold"
                >
                  Type
                </span>
                 
                <span
                  class="text-moongray-300"
                >
                  Type B
                </span>
              </p>
            </div>
          </div>
          <p
            class="text-[0.8rem] text-moongray-300 text-right"
          >
            Added on 
            Feb 01, 2023, 08:00:00
          </p>
        </a>
      </li>
    </ul>
  `);
});
