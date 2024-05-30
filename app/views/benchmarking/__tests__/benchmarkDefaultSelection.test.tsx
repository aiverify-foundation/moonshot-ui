import { render, screen } from '@testing-library/react';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import { BenchmarkDefaultSelection } from '@/app/views/benchmarking/benchmarkDefaultSelection';
import { useCookbooks } from '@/app/views/benchmarking/contexts/cookbooksContext';

jest.mock('../contexts/cookbooksContext');
jest.mock('@/lib/redux', mockRedux);
jest.mock('@/app/services/cookbook-api-service', () => ({
  useGetCookbooksQuery: jest.fn(),
}));
function mockRedux() {
  return {
    useAppDispatch: () => jest.fn(),
    useAppSelector: () => jest.fn(),
    resetBenchmarkCookbooks: jest.fn(),
    resetBenchmarkModels: jest.fn(),
  };
}
function mockUseCookbooks() {
  return [[], jest.fn(), true, jest.fn()];
}

(useCookbooks as jest.Mock).mockImplementation(mockUseCookbooks);

const mockSetHiddenNavButtons = jest.fn();

describe('BenchmarkDefaultSelection', () => {
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
      <BenchmarkDefaultSelection
        setHiddenNavButtons={mockSetHiddenNavButtons}
      />
    );
  });

  it('should render cookbooks for selection', () => {
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
    function useMockGetCookbooksQuery() {
      return {
        data: mockCookbooks,
        isFetching: true,
      };
    }

    (useGetCookbooksQuery as jest.Mock).mockImplementation(
      useMockGetCookbooksQuery
    );
    render(
      <BenchmarkDefaultSelection
        setHiddenNavButtons={mockSetHiddenNavButtons}
      />
    );

    screen.debug;
  });
});
