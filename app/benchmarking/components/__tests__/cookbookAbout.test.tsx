import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookbookAbout } from '@/app/benchmarking/components/cookbookAbout';
import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';

jest.mock('@/app/services/recipe-api-service', () => ({
  useGetAllRecipesQuery: jest.fn(),
}));

const mockCookbook = {
  id: 'cb-id-1',
  name: 'Mock Cookbook',
  description: 'Mock description',
  recipes: ['rc-id-1', 'rc-id-2'],
  total_prompt_in_cookbook: 10,
  total_dataset_in_cookbook: 1,
  required_config: null,
};

const mockRecipes = [
  {
    id: 'rc-id-1',
    name: 'Mock Recipe One',
    description: 'Mock description one',
    total_prompt_in_recipe: 5,
    stats: {
      num_of_datasets: 1,
    },
    required_config: ['endpoint-1', 'endpoint-2'],
  },
  {
    id: 'rc-id-2',
    name: 'Mock Recipe Two',
    description: 'Mock description two',
    total_prompt_in_recipe: 5,
    stats: {
      num_of_datasets: 2,
    },
    required_config: ['endpoint-1', 'endpoint-2'],
  },
];

describe('CookbookAbout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cookbook details correctly', () => {
    (useGetAllRecipesQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isFetching: false,
    });

    render(
      <CookbookAbout
        cookbook={mockCookbook}
        checked={false}
        onSelectChange={jest.fn()}
      />
    );

    expect(screen.getByText(mockCookbook.name)).toBeInTheDocument();
    expect(screen.getByText(mockCookbook.description)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockCookbook.total_prompt_in_cookbook} prompts`)
    ).toBeInTheDocument();
  });

  it('renders recipes correctly', () => {
    (useGetAllRecipesQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isFetching: false,
    });

    render(
      <CookbookAbout
        cookbook={mockCookbook}
        checked={false}
        onSelectChange={jest.fn()}
      />
    );

    mockRecipes.forEach((recipe) => {
      expect(screen.getByText(recipe.name)).toBeInTheDocument();
      expect(screen.getByText(recipe.description)).toBeInTheDocument();
    });
  });

  it('calls onSelectChange when checkbox is clicked', async () => {
    const mockOnSelectChange = jest.fn();

    (useGetAllRecipesQuery as jest.Mock).mockReturnValue({
      data: mockRecipes,
      isFetching: false,
    });

    render(
      <CookbookAbout
        cookbook={mockCookbook}
        checked={false}
        onSelectChange={mockOnSelectChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(mockOnSelectChange).toHaveBeenCalledWith(mockCookbook);
  });

  it('shows loading animation when fetching recipes', () => {
    (useGetAllRecipesQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isFetching: true,
    });

    render(
      <CookbookAbout
        cookbook={mockCookbook}
        checked={false}
        onSelectChange={jest.fn()}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
