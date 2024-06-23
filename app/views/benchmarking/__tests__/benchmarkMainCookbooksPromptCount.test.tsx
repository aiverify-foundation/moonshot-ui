import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CookbooksProvider,
  useCookbooks,
} from '@/app/views/benchmarking/contexts/cookbooksContext';
import { useAppSelector } from '@/lib/redux';
import { BenchmarkMainCookbooksPromptCount } from '@/app/views/benchmarking/benchmarkMainCookbooksPromptCount';

jest.mock('@/lib/redux', mockRedux);

function mockRedux() {
  return {
    useAppSelector: jest.fn(),
  };
}

const mockChangeView = jest.fn();

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

describe('BenchmarkMainCookbooksPromptCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading animation', () => {
    const mockOneAlreadySelectedCookbooksFromState = mockCookbooks;
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockOneAlreadySelectedCookbooksFromState
    );
    render(
      <CookbooksProvider>
        <BenchmarkMainCookbooksPromptCount changeView={mockChangeView} />
      </CookbooksProvider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows the correct number of prompts', () => {
    const mockOneAlreadySelectedCookbooksFromState = mockCookbooks;
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockOneAlreadySelectedCookbooksFromState
    );
    render(
      <CookbooksProvider>
        <BenchmarkMainCookbooksPromptCount changeView={mockChangeView} />
      </CookbooksProvider>
    );

    screen.debug();
  });
});
