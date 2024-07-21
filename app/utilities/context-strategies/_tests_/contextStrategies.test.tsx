import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'next/navigation';
import { ContextStrategiesList } from '@/app/utilities/context-strategies/contextStrategiesList';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockGetParam: jest.Mock = jest.fn();

const mockContextStrategies: ContextStrategy[] = [
  {
    id: '1',
    name: 'Strategy One',
    description: 'Description for Strategy One',
  },
  {
    id: '2',
    name: 'Strategy Two',
    description: 'Description for Strategy Two',
  },
  {
    id: '3',
    name: 'Strategy Three',
    description: 'Description for Strategy Three',
  },
];

it('renders ContextStrategiesList', async () => {
  (useSearchParams as jest.Mock).mockImplementation(() => ({
    get: mockGetParam,
  }));
  mockGetParam.mockReturnValue(undefined);
  render(<ContextStrategiesList strategies={mockContextStrategies} />);

  expect(screen.queryAllByText(mockContextStrategies[0].name)).toHaveLength(2);
  expect(screen.queryAllByText(mockContextStrategies[1].name)).toHaveLength(1);

  await userEvent.click(screen.getByText(mockContextStrategies[1].name));
  expect(screen.queryAllByText(mockContextStrategies[0].name)).toHaveLength(1);
  expect(screen.queryAllByText(mockContextStrategies[1].name)).toHaveLength(2);
});
