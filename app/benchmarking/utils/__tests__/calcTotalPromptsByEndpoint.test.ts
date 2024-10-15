import { CookbooksBenchmarkResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { calcTotalPromptsByEndpoint } from '@/app/benchmarking/utils/calcTotalPromptsByEndpoint';

describe('calcTotalPromptsByEndpoint', () => {
  const mockResult: CookbooksBenchmarkResult = {
    results: {
      cookbooks: [
        {
          id: 'cb-id-1',
          recipes: [
            {
              id: 'rc-id-1',
              details: [], // Add appropriate mock details here
              evaluation_summary: [
                {
                  model_id: 'ep-id-1',
                  num_of_prompts: 10,
                  avg_grade_value: 4.5,
                  grade: 'A',
                },
                {
                  model_id: 'ep-id-2',
                  num_of_prompts: 5,
                  avg_grade_value: 3.8,
                  grade: 'B',
                },
              ],
              grading_scale: {}, // Add appropriate mock grading scale here
              total_num_of_prompts: 15,
            },
            {
              id: 'rc-id-2',
              details: [], // Add appropriate mock details here
              evaluation_summary: [
                {
                  model_id: 'ep-id-1',
                  num_of_prompts: 20,
                  avg_grade_value: 4.0,
                  grade: 'A-',
                },
              ],
              grading_scale: {}, // Add appropriate mock grading scale here
              total_num_of_prompts: 20,
            },
          ],
          overall_evaluation_summary: [],
          total_num_of_prompts: 0,
        },
        {
          id: 'cb-id-2',
          recipes: [
            {
              id: 'rc-id-3',
              details: [], // Add appropriate mock details here
              evaluation_summary: [
                {
                  model_id: 'ep-id-1',
                  num_of_prompts: 15,
                  avg_grade_value: 4.2,
                  grade: 'A',
                },
              ],
              grading_scale: {}, // Add appropriate mock grading scale here
              total_num_of_prompts: 15,
            },
          ],
          overall_evaluation_summary: [],
          total_num_of_prompts: 0,
        },
      ],
    },
    metadata: {
      id: '',
      start_time: '',
      end_time: '',
      duration: 0,
      status: '',
      recipes: null,
      cookbooks: [],
      endpoints: [],
      num_of_prompts: 0,
      random_seed: 0,
      system_prompt: '',
    },
  };

  test('calculates total prompts for a given endpoint', () => {
    const totalPrompts = calcTotalPromptsByEndpoint(mockResult, 'ep-id-1');
    expect(totalPrompts).toBe(45);
  });

  test('returns 0 if the endpoint is not found', () => {
    const totalPrompts = calcTotalPromptsByEndpoint(mockResult, 'ep-id-3');
    expect(totalPrompts).toBe(0);
  });

  test('calculates total prompts correctly when there are no cookbooks', () => {
    const emptyResult: CookbooksBenchmarkResult = {
      results: {
        cookbooks: [],
      },
      metadata: {
        id: '',
        start_time: '',
        end_time: '',
        duration: 0,
        status: '',
        recipes: null,
        cookbooks: [],
        endpoints: [],
        num_of_prompts: 0,
        random_seed: 0,
        system_prompt: '',
      },
    };
    const totalPrompts = calcTotalPromptsByEndpoint(emptyResult, 'ep-id-1');
    expect(totalPrompts).toBe(0);
  });

  test('calculates total prompts correctly when there are no recipes', () => {
    const noRecipesResult: CookbooksBenchmarkResult = {
      results: {
        cookbooks: [
          {
            id: 'cb-id-1',
            recipes: [],
            overall_evaluation_summary: [],
            total_num_of_prompts: 0,
          },
        ],
      },
      metadata: {
        id: '',
        start_time: '',
        end_time: '',
        duration: 0,
        status: '',
        recipes: null,
        cookbooks: [],
        endpoints: [],
        num_of_prompts: 0,
        random_seed: 0,
        system_prompt: '',
      },
    };
    const totalPrompts = calcTotalPromptsByEndpoint(noRecipesResult, 'ep-id-1');
    expect(totalPrompts).toBe(0);
  });

  test('calculates total prompts correctly when there are no evaluation summaries', () => {
    const noEvaluationSummaryResult: CookbooksBenchmarkResult = {
      results: {
        cookbooks: [
          {
            id: 'cb-id-1',
            recipes: [
              {
                id: 'rc-id-1',
                evaluation_summary: [],
                details: [],
                grading_scale: {},
                total_num_of_prompts: 0,
              },
            ],
            overall_evaluation_summary: [],
            total_num_of_prompts: 0,
          },
        ],
      },
      metadata: {
        id: '',
        start_time: '',
        end_time: '',
        duration: 0,
        status: '',
        recipes: null,
        cookbooks: [],
        endpoints: [],
        num_of_prompts: 0,
        random_seed: 0,
        system_prompt: '',
      },
    };
    const totalPrompts = calcTotalPromptsByEndpoint(
      noEvaluationSummaryResult,
      'ep-id-1'
    );
    expect(totalPrompts).toBe(0);
  });
});
