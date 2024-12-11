import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import BenchmarkRunsView from '@/app/benchmarking/components/benchmarkRunsView';

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

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockGetParam: jest.Mock = jest.fn();

const mockRunners: Runner[] = [
  {
    id: '1',
    name: 'Runner 1',
    endpoints: ['endpoint1', 'endpoint2'],
    description: 'Description for Runner 1',
    runner_args: {
      cookbooks: ['cookbook1', 'cookbook2'],
      prompt_selection_percentage: 10,
      random_seed: 123,
      system_prompt: 'System prompt for Runner 1',
      runner_processing_module: 'benchmarking',
      result_processing_module: 'resultProcessor1',
    },
    start_time: 1620000000,
  },
  {
    id: '2',
    name: 'Runner 2',
    endpoints: ['endpoint3', 'endpoint4'],
    description: 'Description for Runner 2',
    runner_args: {
      cookbooks: ['cookbook3', 'cookbook4'],
      prompt_selection_percentage: 20,
      random_seed: 456,
      system_prompt: 'System prompt for Runner 2',
      runner_processing_module: 'benchmarking',
      result_processing_module: 'resultProcessor2',
    },
    start_time: 1620003600,
  },
];

const mockResultIds: string[] = ['1', '2'];

it('renders BenchmarkRunsView', async () => {
  (useSearchParams as jest.Mock).mockImplementation(() => ({
    get: mockGetParam,
  }));
  mockGetParam.mockReturnValue(undefined);
  render(
    <BenchmarkRunsView
      runners={mockRunners}
      resultIds={mockResultIds}
    />
  );

  const viewResultsLink = screen.getByRole('link', { name: /view results/i });
  expect(viewResultsLink).toBeInTheDocument();
  expect(viewResultsLink.getAttribute('href')).toBe(
    `/benchmarking/report?id=${mockRunners[0].id}`
  );
  expect(screen.queryAllByText(mockRunners[0].name)).toHaveLength(2);
  expect(screen.queryAllByText(mockRunners[1].name)).toHaveLength(1);

  await userEvent.click(screen.getByText(mockRunners[1].name));
  expect(screen.queryAllByText(mockRunners[0].name)).toHaveLength(1);
  expect(screen.queryAllByText(mockRunners[1].name)).toHaveLength(2);
  expect(viewResultsLink.getAttribute('href')).toBe(
    `/benchmarking/report?id=${mockRunners[1].id}`
  );
});
