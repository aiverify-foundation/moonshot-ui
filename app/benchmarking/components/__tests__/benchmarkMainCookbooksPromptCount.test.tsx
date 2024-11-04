import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BenchmarkMainCookbooksPromptCount } from '@/app/benchmarking/components/benchmarkMainCookbooksPromptCount';
import { CookbooksProvider } from '@/app/benchmarking/contexts/cookbooksContext';

jest.mock('@/lib/redux', mockRedux);

function mockRedux() {
  return {
    useAppSelector: jest.fn(),
  };
}

const mockCookbooksLinkClick = jest.fn();

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

  it('should show loading animation', () => {
    const mockOneAlreadySelectedCookbooksFromState: Cookbook[] = mockCookbooks;
    renderWithProviders(
      <BenchmarkMainCookbooksPromptCount
        selectedCookbooks={mockOneAlreadySelectedCookbooksFromState}
        onCookbooksLinkClick={mockCookbooksLinkClick}
      />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show 30 prompts and required endpoints', () => {
    const mockOneAlreadySelectedCookbooksFromState: Cookbook[] = mockCookbooks;
    const mockAllCookbooks = mockCookbooks;
    renderWithProviders(
      <BenchmarkMainCookbooksPromptCount
        selectedCookbooks={mockOneAlreadySelectedCookbooksFromState}
        onCookbooksLinkClick={mockCookbooksLinkClick}
      />,
      { initialCookbooks: mockAllCookbooks }
    );

    expect(screen.getByText(/30/i)).toBeInTheDocument();
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

  it('should show 20 prompts', () => {
    const mockOneAlreadySelectedCookbooksFromState = [mockCookbooks[1]];
    const mockAllCookbooks = mockCookbooks;
    renderWithProviders(
      <BenchmarkMainCookbooksPromptCount
        selectedCookbooks={mockOneAlreadySelectedCookbooksFromState}
        onCookbooksLinkClick={mockCookbooksLinkClick}
      />,
      { initialCookbooks: mockAllCookbooks }
    );

    expect(screen.getByText(/20/i)).toBeInTheDocument();
  });

  it('should call onCookbooksLinkClick', async () => {
    const mockOneAlreadySelectedCookbooksFromState = mockCookbooks;
    renderWithProviders(
      <BenchmarkMainCookbooksPromptCount
        selectedCookbooks={mockOneAlreadySelectedCookbooksFromState}
        onCookbooksLinkClick={mockCookbooksLinkClick}
      />
    );
    const link = screen.getByText(/these cookbooks/i);
    await userEvent.click(link);
    expect(mockCookbooksLinkClick).toHaveBeenCalledTimes(1);
  });
});
