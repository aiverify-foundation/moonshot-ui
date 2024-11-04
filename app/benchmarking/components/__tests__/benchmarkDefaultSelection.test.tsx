import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BenchmarkDefaultSelection } from '@/app/benchmarking/components/benchmarkDefaultSelection';
import { CookbooksProvider } from '@/app/benchmarking/contexts/cookbooksContext';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import {
  useAppDispatch,
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
} from '@/lib/redux';

jest.mock('@/moonshot.config', () => ({
  __esModule: true,
  default: {
    baselineSelectedCookbooks: ['cb-id-1'],
  },
}));
jest.mock('@/lib/redux', mockRedux);
jest.mock('@/app/services/cookbook-api-service', mockCookbookApiService);
function mockRedux() {
  return {
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
    removeBenchmarkCookbooks: jest.fn(),
    addBenchmarkCookbooks: jest.fn(),
  };
}
function mockCookbookApiService() {
  return {
    useGetCookbooksQuery: jest.fn(),
  };
}

let mockDispatchUpdateSelectedCookbooksInState: jest.Mock;
let mockAddCookbooksMutation: jest.Mock;
let mockRemoveCookbooksMutation: jest.Mock;
const mockHandleSelectorUnselect = jest.fn();

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
  },
  {
    id: 'cb-id-2',
    name: 'Mock Cookbook Two',
    description: 'Mock description',
    recipes: ['rc-id-2'],
    total_prompt_in_cookbook: 20,
    total_dataset_in_cookbook: 2,
    required_config: null,
  },
];

describe('BenchmarkDefaultSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatchUpdateSelectedCookbooksInState = jest.fn();
    mockAddCookbooksMutation = jest.fn();
    mockRemoveCookbooksMutation = jest.fn();
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

  it('should render loading animation', () => {
    function useMockGetCookbooksQuery() {
      return {
        data: undefined,
        isFetching: true,
      };
    }

    (useGetCookbooksQuery as jest.Mock).mockImplementation(
      useMockGetCookbooksQuery
    );
    render(
      <CookbooksProvider>
        <BenchmarkDefaultSelection
          selectedCookbooks={[]}
          onCookbookSelected={mockHandleSelectorUnselect}
          onCookbookUnselected={mockHandleSelectorUnselect}
        />
      </CookbooksProvider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render cookbooks for selection', async () => {
    const mockNoneAlreadySelectedCookbooksFromState: Cookbook[] = [];
    const baseLineCookbooksFromConfig = mockCookbooks[0];
    (useAppDispatch as jest.Mock).mockImplementation(
      () => mockDispatchUpdateSelectedCookbooksInState
    );
    (addBenchmarkCookbooks as unknown as jest.Mock).mockImplementation(
      mockAddCookbooksMutation
    );

    function useMockGetCookbooksQuery() {
      return {
        data: mockCookbooks,
        isFetching: false,
      };
    }

    (useGetCookbooksQuery as jest.Mock).mockImplementation(
      useMockGetCookbooksQuery
    );

    render(
      <CookbooksProvider>
        <BenchmarkDefaultSelection
          selectedCookbooks={mockNoneAlreadySelectedCookbooksFromState}
          onCookbookSelected={mockHandleSelectorUnselect}
          onCookbookUnselected={mockHandleSelectorUnselect}
        />
      </CookbooksProvider>
    );

    expect(mockAddCookbooksMutation).toHaveBeenNthCalledWith(1, [
      baseLineCookbooksFromConfig,
    ]);
    const mockCookbookOneButton = screen.getByRole('button', {
      name: /Mock Cookbook One/i,
    });
    const mockCookbookTwoButton = screen.getByRole('button', {
      name: /Mock Cookbook Two/i,
    });
    expect(mockCookbookOneButton).toBeInTheDocument();
    expect(mockCookbookTwoButton).toBeInTheDocument();
    expect(mockCookbookOneButton.style.backgroundColor).toBeFalsy();
    expect(mockCookbookTwoButton.style.backgroundColor).toBeFalsy();
    await userEvent.click(mockCookbookOneButton);
    expect(mockAddCookbooksMutation).toHaveBeenNthCalledWith(2, [
      mockCookbooks[0],
    ]);
    expect(mockDispatchUpdateSelectedCookbooksInState).toHaveBeenCalledTimes(2);
    expect(mockHandleSelectorUnselect).toHaveBeenCalledTimes(1);
  });

  it('should render selected cookbook button with color', async () => {
    const mockOneAlreadySelectedCookbooksFromState: Cookbook[] = [
      mockCookbooks[0],
    ];
    (useAppDispatch as jest.Mock).mockImplementation(
      () => mockDispatchUpdateSelectedCookbooksInState
    );
    (removeBenchmarkCookbooks as unknown as jest.Mock).mockImplementation(
      mockRemoveCookbooksMutation
    );

    render(
      <CookbooksProvider>
        <BenchmarkDefaultSelection
          selectedCookbooks={mockOneAlreadySelectedCookbooksFromState}
          onCookbookSelected={mockHandleSelectorUnselect}
          onCookbookUnselected={mockHandleSelectorUnselect}
        />
      </CookbooksProvider>
    );

    const mockCookbookOneButton = screen.getByRole('button', {
      name: /Mock Cookbook One/i,
    });
    expect(mockCookbookOneButton.style.backgroundColor).toBeTruthy();
    await userEvent.click(mockCookbookOneButton);
    const clickedCookbook = mockCookbooks[0];
    expect(mockRemoveCookbooksMutation).toHaveBeenNthCalledWith(1, [
      clickedCookbook,
    ]);
    expect(mockHandleSelectorUnselect).toHaveBeenCalledTimes(1);
  });
});
