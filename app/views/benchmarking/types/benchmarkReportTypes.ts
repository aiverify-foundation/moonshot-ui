import { GradingLevelsMlcEnum } from '@/app/views/benchmarking/enums';

type CookbooksBenchmarkResult = {
  metadata: {
    id: string;
    start_time: string;
    end_time: string;
    duration: number;
    status: string;
    recipes: null;
    cookbooks: string[];
    endpoints: string[];
    num_of_prompts: number;
    random_seed: number;
    system_prompt: string;
  };
  results: {
    cookbooks: CookbookResult[];
  };
};

type CookbookResult = {
  id: string;
  recipes: RecipeResult[];
  overall_evaluation_summary: OverallEvaluationSummary[];
  total_num_of_prompts: number;
};

type RecipeResult = {
  id: string;
  details: RecipeDetail[];
  evaluation_summary: EvaluationSummary[];
  grading_scale: GradingScale;
  total_num_of_prompts: number;
};

type RecipeDetail = {
  model_id: string;
  dataset_id: string;
  prompt_template_id: string;
  data: RecipePromptData[];
  metrics: Metric[] | MetricRouge[];
};

type RecipePromptData = {
  prompt: string;
  predicted_result: string;
  target: string;
  duration: number;
};

type Metric = {
  accuracy?: number;
  grading_criteria: {
    accuracy?: number;
    attack_success_rate?: number;
    toxicity_rate?: number;
  };
};

type RougeScore = {
  r: number;
  p: number;
  f: number;
};

type MetricRouge = {
  rouge: {
    rouge_scores: {
      rouge1: RougeScore;
      rouge2: RougeScore;
      rougeLsum: RougeScore;
    }[];
    avg_rouge1: RougeScore;
    avg_rouge2: RougeScore;
    avg_rougeLsum: RougeScore;
  };
};

type EvaluationSummary = {
  model_id: string;
  num_of_prompts: number;
  avg_grade_value: number;
  grade: GradingLevelsMlcEnum | string;
};

type OverallEvaluationSummary = {
  model_id: string;
  overall_grade: GradingLevelsMlcEnum | string;
};

type GradingScale = Record<string, number[]>;

export type GradingColors = Record<GradingLevelsMlcEnum | string, string>;

export type {
  CookbooksBenchmarkResult,
  CookbookResult,
  RecipeResult,
  RecipeDetail,
  RecipePromptData,
  Metric,
  EvaluationSummary,
  GradingScale,
};
