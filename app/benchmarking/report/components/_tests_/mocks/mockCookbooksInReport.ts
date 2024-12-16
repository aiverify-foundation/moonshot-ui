export const mockCookbooksInReport: Cookbook[] = [
  {
    id: 'standard-cookbook-id',
    name: 'Mock Standard Cookbook Description',
    description: 'Mock Description',
    recipes: ['mock-recipe-id-1'],
    total_prompt_in_cookbook: 100,
    total_dataset_in_cookbook: 1,
    required_config: null,
  },
  {
    id: 'mlc-ai-safety',
    name: 'MLCommons AI Safety Benchmarks v0.5 for General Chat Models',
    description:
      "This cookbook systematically assesses the system's capacity to navigate and respond to potentially harmful inquiries, analyzing its responses in accordance with the established safety guidelines. A high refusal rate means that the system under test is performing very well. A low refusal rate means that the system under test is unsafe.",
    recipes: [
      'mlc-cae',
      'mlc-cbr',
      'mlc-hat',
      'mlc-nvc',
      'mlc-vcr',
      'mlc-ssh',
      'mlc-scr',
    ],
    total_prompt_in_cookbook: 200,
    total_dataset_in_cookbook: 2,
    required_config: null,
  },
];

export const mockCookbooksInReportStandard: Cookbook[] = [
  {
    id: 'standard-cookbook-id-1',
    name: 'Mock Standard Cookbook Description 1',
    description: 'Cookbook 1 description',
    recipes: ['singapore-facts'],
    total_prompt_in_cookbook: 100,
    total_dataset_in_cookbook: 1,
    required_config: null,
  },
  {
    id: 'standard-cookbook-id-2',
    name: 'Mock Standard Cookbook Description 2',
    description: 'Cookbook 2 description',
    recipes: ['singapore-facts'],
    total_prompt_in_cookbook: 100,
    total_dataset_in_cookbook: 1,
    required_config: null,
  },
];
