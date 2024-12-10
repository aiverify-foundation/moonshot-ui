import { calcTotalPromptsAndEstimatedTime } from '@/app/lib/cookbookUtils';

const mockCookbooks: Cookbook[] = [
  {
    id: '1',
    name: 'Cookbook 1',
    description: 'Mock Cookbook 1',
    recipes: ['Recipe 1', 'Recipe 2'],
    total_prompt_in_cookbook: 5,
    total_dataset_in_cookbook: 1,
    required_config: null,
  },
  {
    id: '2',
    name: 'Cookbook 2',
    description: 'Mock Cookbook 2',
    recipes: ['Recipe 3', 'Recipe 4'],
    total_prompt_in_cookbook: 10,
    total_dataset_in_cookbook: 2,
    required_config: null,
  },
  {
    id: '3',
    name: 'Cookbook 3',
    description: 'Mock Cookbook 3',
    recipes: ['Recipe 5', 'Recipe 6'],
    total_prompt_in_cookbook: 15,
    total_dataset_in_cookbook: 3,
    required_config: null,
  },
];

describe('calcTotalPromptsAndEstimatedTime', () => {
  it('calculates total prompts and estimated time correctly', () => {
    const result = calcTotalPromptsAndEstimatedTime(mockCookbooks, 10);
    expect(result.totalPrompts).toBe(30);
    expect(result.estTotalPromptResponseTime).toBe(300);
    expect(result.totalHours).toBe(0);
    expect(result.totalMinutes).toBe(5);
  });

  it('returns zero values when no cookbooks are provided', () => {
    const result = calcTotalPromptsAndEstimatedTime([], 10);
    expect(result.totalPrompts).toBe(0);
    expect(result.estTotalPromptResponseTime).toBe(0);
    expect(result.totalHours).toBe(0);
    expect(result.totalMinutes).toBe(0);
  });

  it('handles cookbooks with no prompts correctly', () => {
    const cookbooksWithNoPrompts: Cookbook[] = [
      {
        id: '1',
        name: 'Cookbook 1',
        description: 'Mock Cookbook 1',
        recipes: ['Recipe 1', 'Recipe 2'],
        total_prompt_in_cookbook: 0,
        total_dataset_in_cookbook: 0,
        required_config: null,
      },
      {
        id: '2',
        name: 'Cookbook 2',
        description: 'Mock Cookbook 2',
        recipes: ['Recipe 3', 'Recipe 4'],
        total_prompt_in_cookbook: 0,
        total_dataset_in_cookbook: 0,
        required_config: null,
      },
    ];
    const result = calcTotalPromptsAndEstimatedTime(cookbooksWithNoPrompts, 10);
    expect(result.totalPrompts).toBe(0);
    expect(result.estTotalPromptResponseTime).toBe(0);
    expect(result.totalHours).toBe(0);
    expect(result.totalMinutes).toBe(0);
  });

  it('calculates total prompts and estimated time with different seconds per prompt', () => {
    const result = calcTotalPromptsAndEstimatedTime(mockCookbooks, 20);
    expect(result.totalPrompts).toBe(30);
    expect(result.estTotalPromptResponseTime).toBe(600);
    expect(result.totalHours).toBe(0);
    expect(result.totalMinutes).toBe(10);
  });
});
