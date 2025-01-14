import { GradingLevelsMlcEnum } from '@/app/benchmarking/report/components/mlcReportComponents/enums';

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
  recipes: RecipeEvaluationResult[];
  overall_evaluation_summary: OverallEvaluationSummary[];
  total_num_of_prompts: number;
};

type RecipeEvaluationResult = {
  id: string;
  details: RecipeResultPromptData[];
  evaluation_summary: EvaluationSummary[];
  grading_scale: GradingScale;
  total_num_of_prompts: number;
};

type RecipeResultPromptData = {
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

type MetricPromptAndScore = {
  prompt: string;
  predicted_value: string;
  target: string;
};

type IndividualScore = {
  individual_scores: {
    successful?: MetricPromptAndScore[];
    unsuccessful?: MetricPromptAndScore[];
  };
};

type GradingCriteria = {
  accuracy?: number;
  attack_success_rate?: number;
  toxicity_rate?: number;
  refusal_rate?: number;
};

type Metric = {
  grading_criteria: GradingCriteria;
} & {
  [key: string]: IndividualScore | number | GradingCriteria;
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
  grade: GradingLevelsMlcEnum | string | null;
};

type OverallEvaluationSummary = {
  model_id: string;
  overall_grade: GradingLevelsMlcEnum | string;
};

type GradingScale = Record<string, number[]>;

type GradingColors = Record<GradingLevelsMlcEnum | string, string>;

type CookbookCategoryLabels = Record<string, ('Q' | 'C' | 'T')[]>;

export type {
  CookbooksBenchmarkResult,
  CookbookResult,
  RecipeEvaluationResult,
  RecipeResultPromptData,
  RecipePromptData,
  Metric,
  EvaluationSummary,
  GradingScale,
  GradingColors,
  CookbookCategoryLabels,
  IndividualScore,
};
