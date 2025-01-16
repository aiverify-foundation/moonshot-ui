import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookbooksSelection } from '@/app/benchmarking/components/cookbooksSelection';
import { CookbooksProvider } from '@/app/benchmarking/contexts/cookbooksContext';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';
import {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  updateBenchmarkCookbooks,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';

jest.mock('@/app/services/recipe-api-service', () => ({
  useGetAllRecipesQuery: jest.fn(),
}));

jest.mock('@/moonshot.config', () => ({
  __esModule: true,
  default: {
    ...jest.requireActual('@/moonshot.config').default,
    cookbooksOrder: ['cb-id-2', 'cb-id-3'],
  },
}));

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

const mockCookbooks: Cookbook[] = [
  {
    id: 'cb-id-1',
    name: 'Mock Cookbook One',
    description: 'Mock description',
    recipes: ['rc-id-1'],
    total_prompt_in_cookbook: 10,
    total_dataset_in_cookbook: 1,
    required_config: {
      configurations: {
        embeddings: ['embed-endpoint-1', 'endpoint-2'],
      },
      endpoints: ['endpoint-1', 'endpoint-2'],
    },
    tags: ['tag1', 'tag2'],
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
    total_dataset_in_cookbook: 2,
    required_config: null,
    tags: ['tag3', 'tag4'],
  },
  {
    id: 'cb-id-3',
    name: 'Mock Cookbook Three',
    description: 'Mock description',
    recipes: ['rc-id-3'],
    total_prompt_in_cookbook: 30,
    total_dataset_in_cookbook: 30,
    required_config: null,
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
  const mockOnCookbookSelected = jest.fn();
  const mockOnCookbookUnselected = jest.fn();
  const mockOnCookbookAboutClick = jest.fn();
  const mockOnCookbookAboutClose = jest.fn();
  const mockAddBenchmarkCookbooks = jest.fn();
  const mockUpdateBenchmarkCookbooks = jest.fn();

  beforeAll(() => {
    function useMockGetCookbooksQuery() {
      return {
        data: mockCookbooks,
        isFetching: false,
      };
    }

    (useAppDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (addBenchmarkCookbooks as unknown as jest.Mock).mockImplementation(
      mockAddBenchmarkCookbooks
    );
    (useGetCookbooksQuery as jest.Mock).mockImplementation(
      useMockGetCookbooksQuery
    );
    (updateBenchmarkCookbooks as unknown as jest.Mock).mockImplementation(
      mockUpdateBenchmarkCookbooks
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display cookbooks in the correct order and render required endpoints tooltip', () => {
    const mockAlreadySelectedCookbooks = [mockCookbooks[0], mockCookbooks[2]];
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockAlreadySelectedCookbooks
    );
    renderWithProviders(
      <CookbooksSelection
        onCookbookSelected={mockOnCookbookSelected}
        onCookbookUnselected={mockOnCookbookUnselected}
        onCookbookAboutClick={mockOnCookbookAboutClick}
        onCookbookAboutClose={mockOnCookbookAboutClose}
      />
    );
    const cookbookItems = screen.getAllByRole('cookbookcard');
    expect(cookbookItems).toHaveLength(mockCookbooks.length);
    expect(cookbookItems[0]).toHaveTextContent(mockCookbooks[1].name);
    expect(cookbookItems[1]).toHaveTextContent(mockCookbooks[2].name);
    expect(cookbookItems[2]).toHaveTextContent(mockCookbooks[0].name);
    const tagNames = mockCookbooks.flatMap((cookbook) => cookbook.tags ?? []);
    for (const tag of tagNames) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
    expect(
      screen.getByRole('checkbox', {
        name: `Select ${mockCookbooks[0].id}`,
      })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', {
        name: `Select ${mockCookbooks[2].id}`,
      })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', {
        name: `Select ${mockCookbooks[1].id}`,
      })
    ).not.toBeChecked();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      updateBenchmarkCookbooks([mockCookbooks[0], mockCookbooks[2]])
    );
    mockCookbooks.forEach((cookbook) => {
      if (cookbook.required_config?.endpoints?.length) {
        cookbook.required_config.endpoints.forEach((endpoint) => {
          expect(screen.getByText(endpoint)).toBeInTheDocument();
        });
      }
      if (cookbook.required_config?.configurations?.embeddings?.length) {
        cookbook.required_config.configurations.embeddings.forEach(
          (endpoint) => {
            expect(screen.getByText(endpoint)).toBeInTheDocument();
          }
        );
      }
    });
  });

  it('should select and deselect a cookbook', async () => {
    const mockNoSelectedCookbooks: Cookbook[] = [];
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockNoSelectedCookbooks
    );
    const { rerender } = renderWithProviders(
      <CookbooksSelection
        onCookbookSelected={mockOnCookbookSelected}
        onCookbookUnselected={mockOnCookbookUnselected}
        onCookbookAboutClick={mockOnCookbookAboutClick}
        onCookbookAboutClose={mockOnCookbookAboutClose}
      />,
      {
        initialCookbooks: mockCookbooks,
      }
    );

    const cookbookOneCheckbox = screen.getByRole('checkbox', {
      name: `Select ${mockCookbooks[0].id}`,
    });

    await userEvent.click(cookbookOneCheckbox);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      addBenchmarkCookbooks([mockCookbooks[0]])
    );
    expect(mockOnCookbookSelected).toHaveBeenCalledTimes(1);
    expect(mockOnCookbookSelected).toHaveBeenCalledTimes(1);
    expect(mockOnCookbookSelected).toHaveBeenCalledTimes(1);
    expect(cookbookOneCheckbox).toBeChecked();

    await act(async () => {
      (useAppSelector as jest.Mock).mockImplementation(
        () => [mockCookbooks[0]] // simulate 1 cookbook selected
      );
      rerender(
        <CookbooksSelection
          onCookbookSelected={mockOnCookbookSelected}
          onCookbookUnselected={mockOnCookbookUnselected}
          onCookbookAboutClick={mockOnCookbookAboutClick}
          onCookbookAboutClose={mockOnCookbookAboutClose}
        />
      );
    });
    await userEvent.click(cookbookOneCheckbox);
    expect(mockDispatch).toHaveBeenCalledWith(
      removeBenchmarkCookbooks([mockCookbooks[0]])
    );
    expect(mockOnCookbookUnselected).toHaveBeenCalledTimes(1);
    expect(cookbookOneCheckbox).not.toBeChecked();
  });

  it('should call about click handler', async () => {
    const mockNoSelectedCookbooks: Cookbook[] = [];
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockNoSelectedCookbooks
    );
    (useGetAllRecipesQuery as jest.Mock).mockReturnValue({
      data: [],
      isFetching: false,
    });
    renderWithProviders(
      <CookbooksSelection
        onCookbookSelected={mockOnCookbookSelected}
        onCookbookUnselected={mockOnCookbookUnselected}
        onCookbookAboutClick={mockOnCookbookAboutClick}
        onCookbookAboutClose={mockOnCookbookAboutClose}
      />,
      {
        initialCookbooks: mockCookbooks,
      }
    );

    const aboutButtons = screen.getAllByText('About');
    await userEvent.click(aboutButtons[0]);
    expect(mockOnCookbookAboutClick).toHaveBeenCalledTimes(1);
  });
});
