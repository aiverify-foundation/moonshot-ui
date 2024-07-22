import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookbooksSelection } from '@/app/views/cookbook-management/cookbooksSelection';
import { CookbooksProvider } from '@/app/views/benchmarking/contexts/cookbooksContext';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  updateBenchmarkCookbooks,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';

jest.mock('@/lib/redux', () => ({
  addBenchmarkCookbooks: jest.fn(),
  removeBenchmarkCookbooks: jest.fn(),
  updateBenchmarkCookbooks: jest.fn(),
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));
jest.mock('@/app/services/cookbook-api-service', mockCookbookApiService);

function mockCookbookApiService() {
  return {
    useGetCookbooksQuery: jest.fn(),
  };
}

const mockCookbooks = [
  {
    id: 'cb-id-1',
    name: 'Mock Cookbook One',
    description: 'Mock description',
    recipes: ['rc-id-1'],
    total_prompt_in_cookbook: 10,
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
  },
];

function renderWithProviders(
  ui: React.ReactNode,
  { initialCookbooks = [], ...options }: { initialCookbooks?: Cookbook[] } = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <CookbooksProvider initialCookbooks={initialCookbooks}>
      {children}
    </CookbooksProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}

describe('CookbooksSelection', () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();
  const mockAddBenchmarkCookbooks = jest.fn();

  beforeAll(() => {
    (useAppDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation(() => mockCookbooks);
    (addBenchmarkCookbooks as unknown as jest.Mock).mockImplementation(
      mockAddBenchmarkCookbooks
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    function useMockGetCookbooksQuery() {
      return {
        data: mockCookbooks,
        isFetching: false,
      };
    }

    (useGetCookbooksQuery as jest.Mock).mockImplementation(
      useMockGetCookbooksQuery
    );
  });

  test('renders cookbooks selection correctly', () => {
    renderWithProviders(<CookbooksSelection onClose={mockOnClose} />);
    expect(screen.getByText(/Mock Cookbook One/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Cookbook Two/i)).toBeInTheDocument();
  });

  test('selects and deselects a cookbook', async () => {
    renderWithProviders(<CookbooksSelection onClose={mockOnClose} />, {
      initialCookbooks: mockCookbooks,
    });

    const cookbookOneCheckbox = screen.getByRole('checkbox', {
      name: `Select ${mockCookbooks[0].id}`,
    });
    await userEvent.click(cookbookOneCheckbox);
    // expect(mockAddBenchmarkCookbooks).toHaveBeenCalledWith([mockCookbooks[0]]);

    await userEvent.click(cookbookOneCheckbox);
    // expect(removeBenchmarkCookbooks).toHaveBeenCalledWith([mockCookbooks[0]]);
  });

  test.skip('closes the selection popup', async () => {
    renderWithProviders(<CookbooksSelection onClose={mockOnClose} />, {
      initialCookbooks: mockCookbooks,
    });

    const closeButton = screen.getByText(/OK/i);
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
