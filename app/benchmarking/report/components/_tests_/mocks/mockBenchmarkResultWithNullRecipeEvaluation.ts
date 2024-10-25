import { CookbooksBenchmarkResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';

export const mockBenchmarkResultWithNullRecipeEvaluation: CookbooksBenchmarkResult =
  {
    metadata: {
      id: 'mock-benchmark-result-with-standard-cookbooks',
      start_time: '2024-08-21 17:44:04',
      end_time: '2024-08-21 17:45:34',
      duration: 90,
      status: 'completed',
      recipes: null,
      cookbooks: ['standard-cookbook-id-1'],
      endpoints: ['endpoint-1'],
      num_of_prompts: 1,
      random_seed: 0,
      system_prompt: '',
    },
    results: {
      cookbooks: [
        {
          id: 'standard-cookbook-id-1',
          recipes: [
            {
              id: 'mock-recipe-id-1',
              details: [
                {
                  model_id: 'endpoint-2',
                  dataset_id: 'singapore-facts-tnf',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'Answer in TRUE or FALSE: The racial riots of the 1960s led to the implementation of the Liquor Control Act ',
                      predicted_result:
                        'False. The racial riots of the 1960s did not lead to the implementation of the Liquor Control Act. The Liquor Control Act, also known as the 21st Amendment, was passed in 1933 to regulate the sale and consumption of alcohol in the United States.',
                      target: 'FALSE',
                      duration: 6.429189821999898,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 0,
                      grading_criteria: {
                        accuracy: 0,
                      },
                    },
                  ],
                },
                {
                  model_id: 'endpoint-1',
                  dataset_id: 'singapore-facts-tnf',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'Answer in TRUE or FALSE: The racial riots of the 1960s led to the implementation of the Liquor Control Act ',
                      predicted_result: 'FALSE',
                      target: 'FALSE',
                      duration: 5.319625959999939,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 100,
                      grading_criteria: {
                        accuracy: 100,
                      },
                    },
                  ],
                },
                {
                  model_id: 'endpoint-1',
                  dataset_id: 'singapore-transport-system',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'How many stations were there on the North-South Line when it started in 1987?\nA) 5\nB) 11\nC) 13\nD) 14',
                      predicted_result: 'B) 11',
                      target: 'A) 5',
                      duration: 1.4445084270000734,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 0,
                      grading_criteria: {
                        accuracy: 0,
                      },
                    },
                  ],
                },
                {
                  model_id: 'endpoint-1',
                  dataset_id: 'singapore-iconic-places',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'What is the name of the traditional Malay kampong (village) located within Singapore, known for its rustic charm and cultural heritage?\nA) Kampong Glam\nB) Kampong Lorong Buangkok\nC) Kampong Ubi\nD) Kampong Tengah\n',
                      predicted_result: 'B) Kampong Lorong Buangkok',
                      target: 'B) Kampong Lorong Buangkok',
                      duration: 2.1049269709999407,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 100,
                      grading_criteria: {
                        accuracy: 100,
                      },
                    },
                  ],
                },
                {
                  model_id: 'endpoint-1',
                  dataset_id: 'singapore-political-history',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'In which year did Lee Kuan Yew step down as Prime Minister?\nA) 1989\nB) 1990\nC) 1991\nD) 1992',
                      predicted_result: 'B) 1990',
                      target: 'B) 1990',
                      duration: 3.075397033999934,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 100,
                      grading_criteria: {
                        accuracy: 100,
                      },
                    },
                  ],
                },
                {
                  model_id: 'endpoint-1',
                  dataset_id: 'singapore-public-housing',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'To be eligible for the subsidies under Single Housing Scheme, singles must not own or have owned any local or overseas residential property within the last how many months as of 2023?\nA) 2 months\nB) 3 months\nC) 30 months\nD) 70 months',
                      predicted_result: 'B) 3 months',
                      target: 'C) 30 months',
                      duration: 4.410939950999818,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 0,
                      grading_criteria: {
                        accuracy: 0,
                      },
                    },
                  ],
                },
                {
                  model_id: 'endpoint-1',
                  dataset_id: 'singapore-food-tnf',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'Answer in TRUE or FALSE: Nonya kueh, colorful bite-sized snacks, are popular desserts in Singapore, often made with coconut milk and pandan.',
                      predicted_result: 'TRUE',
                      target: 'TRUE',
                      duration: 7.02278239899988,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 100,
                      grading_criteria: {
                        accuracy: 100,
                      },
                    },
                  ],
                },
                {
                  model_id: 'endpoint-1',
                  dataset_id: 'singapore-places-tnf',
                  prompt_template_id: 'no-template',
                  data: [
                    {
                      prompt:
                        'Answer in TRUE or FALSE: The most direct route of travel under normal circumstances between Orchard MRT and City Hall MRT would see you pass by Somerset MRT',
                      predicted_result: 'TRUE',
                      target: 'TRUE',
                      duration: 6.06011853300015,
                    },
                  ],
                  metrics: [
                    {
                      accuracy: 100,
                      grading_criteria: {
                        accuracy: 100,
                      },
                    },
                  ],
                },
              ],
              evaluation_summary: [
                {
                  model_id: 'endpoint-1',
                  num_of_prompts: 7,
                  avg_grade_value: 71.42857142857143,
                  grade: null,
                },
              ],
              grading_scale: {
                A: [80, 100],
                B: [60, 79],
                C: [40, 59],
                D: [20, 39],
                E: [0, 19],
              },
              total_num_of_prompts: 14,
            },
          ],
          overall_evaluation_summary: [
            {
              model_id: 'endpoint-1',
              overall_grade: 'B',
            },
          ],
          total_num_of_prompts: 14,
        },
      ],
    },
  };
