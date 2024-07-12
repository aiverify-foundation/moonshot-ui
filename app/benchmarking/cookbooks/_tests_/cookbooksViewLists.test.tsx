import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import { CookbooksViewList } from '@/app/benchmarking/cookbooks/cookbooksViewList';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockCookbooks: Cookbook[] = [
  {
    id: 'cb-id-1',
    name: 'Mock Cookbook One',
    description: 'Mock description one',
    recipes: ['rc-id-1'],
    total_prompt_in_cookbook: 10,
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description two',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
  },
];

describe('CookbooksViewList', () => {
  const mockGetParam: jest.Mock = jest.fn();

  beforeAll(() => {
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: mockGetParam,
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('View / Search / Select Cookbook', () => {
    test('show first cookbook details by default', () => {
      render(<CookbooksViewList cookbooks={mockCookbooks} />);
      expect(screen.getAllByText(mockCookbooks[0].name)).toHaveLength(2);
    });

    test('show selected cookbook details when cookbook id is in url query parameter', () => {
      mockGetParam.mockReturnValue(mockCookbooks[1].id);
      render(<CookbooksViewList cookbooks={mockCookbooks} />);
      expect(screen.getAllByText(mockCookbooks[1].name)).toHaveLength(2);
    });

    test('filter cookbooks by name text search', async () => {
      render(<CookbooksViewList cookbooks={mockCookbooks} />);
      const searchInput = screen.getByPlaceholderText('Search by name');
      await userEvent.type(searchInput, mockCookbooks[1].name);
      expect(screen.getAllByText(mockCookbooks[1].name)).toHaveLength(2);
      expect(screen.queryByText(mockCookbooks[0].name)).toBeNull();
    });

    test('hide run button when no cookbooks are selected', async () => {
      render(<CookbooksViewList cookbooks={mockCookbooks} />);
      expect(screen.queryByRole('button', { name: /run/i })).toBeNull();
      expect(screen.queryByRole('button', { name: /run/i })).toBeNull();

      await userEvent.click(
        screen.getByRole('checkbox', {
          name: `Select ${mockCookbooks[1].name}`,
        })
      );

      expect(
        screen.getByRole('checkbox', {
          name: `Select ${mockCookbooks[1].name}`,
        })
      ).toBeChecked();

      expect(screen.getAllByText(mockCookbooks[1].name)).toHaveLength(3);
      expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
    });
  });
});
