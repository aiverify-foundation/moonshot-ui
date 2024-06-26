import { render, screen } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RecipesViewList } from '@/app/benchmarking/recipes/recipesViewList';
import userEvent from '@testing-library/user-event';

const mockRecipes: Recipe[] = [
  {
    id: 'rc-id-1',
    name: 'Recipe A',
    description: 'Mock Recipe A description',
    tags: [],
    categories: ['Cat A'],
    datasets: ['dataset-id-1'],
    prompt_templates: ['pt-id-1'],
    metrics: ['metric-id-1'],
    attack_modules: [],
    grading_scale: {},
    stats: {
      num_of_tags: 0,
      num_of_datasets: 1,
      num_of_prompt_templates: 1,
      num_of_metrics: 1,
      num_of_attack_modules: 0,
      num_of_datasets_prompts: {
        'dataset-id-1': 10,
      },
    },
    total_prompt_in_recipe: 10,
  },
  {
    id: 'rc-id-2',
    name: 'Recipe B',
    description: 'Mock Recipe B description',
    tags: [],
    categories: ['Cat B'],
    datasets: ['dataset-id-2'],
    prompt_templates: [],
    metrics: ['metric-id-2'],
    attack_modules: [],
    grading_scale: {},
    stats: {
      num_of_tags: 0,
      num_of_datasets: 1,
      num_of_prompt_templates: 0,
      num_of_metrics: 1,
      num_of_attack_modules: 0,
      num_of_datasets_prompts: {
        'dataset-id-2': 20,
      },
    },
    total_prompt_in_recipe: 20,
  },
];
const mockCookbooks: Cookbook[] = [
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

const newCookbookBtnRegx = /add to new cookbook/i;
const existingCookbookBtnRegx = /add to existing cookbook/i;

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('RecipesViewList', () => {
  const mockRouter: jest.Mock = jest.fn();
  const mockGetParam: jest.Mock = jest.fn();

  beforeAll(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      router: mockRouter,
    }));
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: mockGetParam,
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('View / Search / Select Recipes', () => {
    test('show first recipe details by default', () => {
      render(
        <RecipesViewList
          recipes={mockRecipes}
          cookbooks={mockCookbooks}
        />
      );

      expect(screen.getAllByText(mockRecipes[0].name)).toHaveLength(2);
      expect(screen.getAllByText(mockRecipes[0].description)).toHaveLength(2);
      expect(screen.getAllByText(mockRecipes[1].name)).toHaveLength(1);
    });

    test('show recipe details when recipe id is in url', () => {
      const mockId = mockRecipes[1].id;
      mockGetParam.mockReturnValue(mockId);
      render(
        <RecipesViewList
          recipes={mockRecipes}
          cookbooks={mockCookbooks}
        />
      );
      expect(mockGetParam).toHaveBeenCalledWith('id');
      expect(screen.getAllByText(mockRecipes[0].name)).toHaveLength(1);
      expect(screen.getAllByText(mockRecipes[1].name)).toHaveLength(2);
      expect(screen.getAllByText(mockRecipes[1].description)).toHaveLength(2);
    });

    test('filter recipes by name search', () => {
      render(
        <RecipesViewList
          recipes={mockRecipes}
          cookbooks={mockCookbooks}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search by name');
      userEvent.type(searchInput, mockRecipes[1].name);
      expect(screen.getAllByText(mockRecipes[1].name)).toHaveLength(2);
      expect(screen.getAllByText(mockRecipes[0].name)).toHaveLength(1);
    });

    test('show seleceted recipe Pill button and Add buttons', async () => {
      render(
        <RecipesViewList
          recipes={mockRecipes}
          cookbooks={mockCookbooks}
        />
      );

      expect(
        screen.queryByRole('button', { name: newCookbookBtnRegx })
      ).toBeNull();

      expect(
        screen.queryByRole('button', { name: existingCookbookBtnRegx })
      ).toBeNull();

      expect(
        screen.queryByRole('button', { name: mockRecipes[1].name })
      ).toBeNull();

      await userEvent.click(
        screen.getByRole('checkbox', { name: `Select ${mockRecipes[1].name}` })
      );

      expect(
        screen.queryByRole('button', { name: newCookbookBtnRegx })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: existingCookbookBtnRegx })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: mockRecipes[1].name })
      ).toBeInTheDocument();

      await await userEvent.click(
        screen.getByRole('button', { name: mockRecipes[1].name })
      );

      expect(
        screen.queryByRole('button', { name: mockRecipes[1].name })
      ).toBeNull();
    });
  });

  describe('Add Recipes to Cookbook', () => {
    test('show cookbook selection', async () => {
      render(
        <RecipesViewList
          recipes={mockRecipes}
          cookbooks={mockCookbooks}
        />
      );

      await userEvent.click(
        screen.getByRole('checkbox', { name: `Select ${mockRecipes[1].name}` })
      );

      await userEvent.click(
        screen.getByRole('button', { name: existingCookbookBtnRegx })
      );

      expect(screen.getAllByText(mockCookbooks[0].name)).toHaveLength(2);
      expect(screen.getAllByText(mockCookbooks[1].name)).toHaveLength(1);
    });
  });
});
