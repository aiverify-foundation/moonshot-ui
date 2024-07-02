import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';
import { updateCookbookRecipes } from '@/actions/updateCookbookRecipes';
import { Step } from '@/app/benchmarking/recipes/enums';
import { RecipesViewList } from '@/app/benchmarking/recipes/recipesViewList';

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
const createCookbookBtnRegx = /create cookbook/i;
const viewCookbooksBtnRegx = /view cookbooks/i;

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/actions/updateCookbookRecipes', () => ({
  updateCookbookRecipes: jest.fn(),
}));

jest.mock('react-dom', () => {
  const actualReactDom = jest.requireActual('react-dom');
  return {
    ...actualReactDom,
    useFormState: jest.fn(),
  };
});

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

    test('filter recipes by name search', async () => {
      render(
        <RecipesViewList
          recipes={mockRecipes}
          cookbooks={mockCookbooks}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search by name');
      await userEvent.type(searchInput, mockRecipes[1].name);
      expect(screen.getAllByText(mockRecipes[1].name)).toHaveLength(2);
      expect(screen.queryByText(mockRecipes[0].name)).toBeNull();
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

  describe('Add Recipes to Existing Cookbook', () => {
    const mockUpdateCookbookRecipes: jest.Mock = jest.fn(() => {
      return Promise.resolve({
        statusCode: 200,
        data: 'success',
      });
    });

    beforeAll(() => {
      (updateCookbookRecipes as jest.Mock).mockImplementation(
        mockUpdateCookbookRecipes
      );
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('hide add button if no recipes selected', async () => {
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
      expect(
        screen.getByRole('checkbox', {
          name: `Select ${mockCookbooks[0].name}`,
        })
      ).toBeChecked();

      const selectedRecipePillBtn = screen.queryByRole('button', {
        name: mockRecipes[1].name,
      });
      expect(selectedRecipePillBtn).toBeInTheDocument();

      await userEvent.click(selectedRecipePillBtn as HTMLElement);
      expect(screen.queryByRole('button', { name: /add/i })).toBeNull();
    });

    test('select cookbook and add recipe to selected cookbook', async () => {
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

      await userEvent.click(screen.getAllByText(mockCookbooks[1].name)[0]);
      expect(
        screen.getByRole('checkbox', {
          name: `Select ${mockCookbooks[1].name}`,
        })
      ).toBeChecked();

      await userEvent.click(
        screen.queryByRole('button', { name: /add/i }) as HTMLElement
      );

      expect(
        screen.getByRole('button', { name: /view cookbooks/i })
      ).toBeInTheDocument();

      expect(mockUpdateCookbookRecipes).toHaveBeenCalledWith({
        cookbookId: mockCookbooks[1].id,
        recipeIds: [mockRecipes[1].id],
      });
    });

    test('show error message if error adding recipes to cookbook', async () => {
      const mockUpdateCookbookRecipesWithError: jest.Mock = jest.fn(() => {
        return Promise.resolve({
          statusCode: 500,
          data: 'there was an error',
        });
      });

      (updateCookbookRecipes as jest.Mock).mockImplementation(
        mockUpdateCookbookRecipesWithError
      );

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

      await userEvent.click(screen.getAllByText(mockCookbooks[1].name)[0]);
      expect(
        screen.getByRole('checkbox', {
          name: `Select ${mockCookbooks[1].name}`,
        })
      ).toBeChecked();

      await userEvent.click(
        screen.queryByRole('button', { name: /add/i }) as HTMLElement
      );

      expect(screen.getByText(/error/i)).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });
  });

  describe('Add Recipes to New Cookbook', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('new cookbook form - initial form state', async () => {
      const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
        return [
          {
            formStatus: 'initial',
            formErrors: undefined,
          },
          'actions-cannot-be-tested-yet', // use a dummy string to prevent jest from complaining
        ];
      });

      (useFormState as jest.Mock).mockImplementation(mockUseFormState);

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
        screen.getByRole('button', { name: newCookbookBtnRegx })
      );

      expect(
        screen.queryByRole('button', {
          name: mockRecipes[1].name,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('checkbox', {
          name: `Hidden selected recipe ${mockRecipes[1].name}`,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: createCookbookBtnRegx })
      ).toBeInTheDocument();
    });

    test('new cookbook form - success form state', async () => {
      const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
        return [
          {
            formStatus: 'success',
            formErrors: undefined,
          },
          'actions-cannot-be-tested-yet', // use a dummy string to prevent jest from complaining
        ];
      });

      (useFormState as jest.Mock).mockImplementation(mockUseFormState);

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
        screen.getByRole('button', { name: newCookbookBtnRegx })
      );

      expect(
        screen.getByRole('button', { name: viewCookbooksBtnRegx })
      ).toBeInTheDocument();
    });

    test('new cookbook form - error form state', async () => {
      const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
        return [
          {
            formStatus: 'error',
            formErrors: {
              name: ['mock name error'],
              description: ['mock description error'],
            },
          },
          'actions-cannot-be-tested-yet', // use a dummy string to prevent jest from complaining
        ];
      });

      (useFormState as jest.Mock).mockImplementation(mockUseFormState);

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
        screen.getByRole('button', { name: newCookbookBtnRegx })
      );

      expect(screen.getAllByText(/mock name error/i)).toHaveLength(2);
      expect(screen.getAllByText(/mock description error/i)).toHaveLength(2);

      expect(
        screen.getByRole('button', { name: /close/i })
      ).toBeInTheDocument();
    });
  });

  describe('Create Cookbook flow', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('starts with cookbook form', async () => {
      const mockUseFormState: jest.Mock = jest.fn().mockImplementation(() => {
        return [
          {
            formStatus: 'initial',
            formErrors: undefined,
          },
          'actions-cannot-be-tested-yet', // use a dummy string to prevent jest from complaining
        ];
      });

      (useFormState as jest.Mock).mockImplementation(mockUseFormState);
      render(
        <RecipesViewList
          defaultFirstStep={Step.ADD_TO_NEW_COOKBOOK}
          recipes={mockRecipes}
          cookbooks={mockCookbooks}
        />
      );

      expect(screen.getByText(/no recipes selected/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: createCookbookBtnRegx })
      ).toBeInTheDocument();

      expect(screen.queryByRole('button', { name: /back/i })).toBeNull();
    });
  });
});
