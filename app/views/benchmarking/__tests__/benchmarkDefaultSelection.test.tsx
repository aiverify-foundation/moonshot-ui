import { render, screen } from '@testing-library/react';
import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';
import { BenchmarkDefaultSelection } from '@/app/views/benchmarking/benchmarkDefaultSelection';

jest.mock('@/lib/redux', () => ({
  useAppDispatch: () => jest.fn(),
  resetBenchmarkCookbooks: jest.fn(),
  resetBenchmarkModels: jest.fn(),
}));


describe('BenchmarkDefaultSelection', () => {
  const mockSetHiddenNavButtons = jest.fn();

  it('should render loading animation', () => {
    function useMockGetCookbooksQuery() {
      return {
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
    screen.debug();
  });
});
