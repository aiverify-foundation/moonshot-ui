import { render, screen } from '@testing-library/react';
import { BenchmarkMainCookbooksPromptCount } from '@/app/views/benchmarking/benchmarkMainCookbooksPromptCount';
import { CookbooksProvider } from '@/app/views/benchmarking/contexts/cookbooksContext';
import { useAppSelector } from '@/lib/redux';

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

describe('BenchmarkMainCookbooksPromptCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading animation', () => {
    const mockOneAlreadySelectedCookbooksFromState = mockCookbooks;
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockOneAlreadySelectedCookbooksFromState
    );
    renderWithProviders(
      <BenchmarkMainCookbooksPromptCount changeView={mockChangeView} />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows 30 prompts', () => {
    const mockOneAlreadySelectedCookbooksFromState = mockCookbooks;
    const mockAllCookbooks = mockCookbooks;
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockOneAlreadySelectedCookbooksFromState
    );
    renderWithProviders(
      <BenchmarkMainCookbooksPromptCount changeView={mockChangeView} />,
      { initialCookbooks: mockAllCookbooks }
    );

    expect(screen.getByText(/30/i)).toBeInTheDocument();
  });

  test('shows 20 prompts', () => {
    const mockOneAlreadySelectedCookbooksFromState = [mockCookbooks[1]];
    const mockAllCookbooks = mockCookbooks;
    (useAppSelector as jest.Mock).mockImplementation(
      () => mockOneAlreadySelectedCookbooksFromState
    );
    renderWithProviders(
      <BenchmarkMainCookbooksPromptCount changeView={mockChangeView} />,
      { initialCookbooks: mockAllCookbooks }
    );

    expect(screen.getByText(/20/i)).toBeInTheDocument();
  });
});
