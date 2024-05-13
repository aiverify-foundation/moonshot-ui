type Session = {
  session_id: string;
  name: string;
  description: string;
  created_epoch: number;
  created_datetime: string;
  chat_ids: string[];
  endpoints: string[];
  metadata_file: string;
  prompt_template: string;
  context_strategy: number;
  filename: string;
  chat_history: Record<string, DialoguePairInfo[]>;
};

type DialoguePairInfo = {
  chat_id: number;
  connection_id: string;
  context_strategy: number;
  prompt_template: string;
  prompt: string;
  prepared_prompt: string;
  predicted_result: string;
  duration: string;
};

//[x, y, w, h, scrollTop]
type WindowData = [number, number, number, number, number];

type ChatHistory = Record<string, DialoguePairInfo[]>;

type PromptTemplate = {
  name: string;
  description: string;
  template: string;
};

type LLMEndpoint = {
  id: string;
  connector_type: string;
  name: string;
  uri: string;
  token: string;
  max_calls_per_second: number;
  max_concurrency: number;
  params?: Record<string, string | number>;
};

type LLMEndpointFormValues = {
  connector_type: string;
  name: string;
  uri: string;
  token: string;
  max_calls_per_second: string;
  max_concurrency: string;
  params?: string;
};

type Cookbook = {
  id: string;
  name: string;
  description: string;
  recipes: string[];
  total_prompt_in_cookbook: number;
};

type CookbookFormValues = {
  name: string;
  description: string;
  recipes: string[];
};

type Recipe = {
  attack_modules: any[];
  categories: string[];
  datasets: string[];
  description: string;
  grading_scale: Record<string, any>;
  id: string;
  metrics: string[];
  name: string;
  prompt_templates: string[];
  stats: {
    num_of_tags: number;
    num_of_datasets: number;
    num_of_datasets_prompts: Record<string, number>;
  };
  tags: string[];
  total_prompt_in_recipe: number;
};

type RecipeFormValues = {
  name: string;
  description: string;
  tags: string[];
  datasets: string[];
  prompt_templates: string[];
  metrics: string[];
  attack_modules: string[];
} & Recipe;

type Dataset = {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  examples: string[];
};

type BenchmarkRunFormValues = {
  run_name: string;
  description: string;
  num_of_prompts: string;
  system_prompt: string;
  runner_processing_module: 'benchmarking';
  inputs: string[];
  endpoints: string[];
  random_seed: string;
};

type PushEvent = {
  type: string;
  data: Record<string, string | number>;
};

type TestStatus = {
  current_runner_id: string;
  current_runner_type: string;
  current_duration: number;
  current_status: string;
  current_cookbook_index: number;
  current_cookbook_name: string;
  current_cookbook_total: number;
  current_recipe_index: number;
  current_recipe_name: string;
  current_recipe_total: number;
  current_progress: number;
  current_error_messages: string[];
};

type TestStatuses = Record<string, TestStatus>;

// Reserved z-indexes
type ZIndex = {
  Base: 1;
  Level_1: 100;
  Level_2: 200;
  FocusedWindow: 998;
  Top: 999;
};

/*
 * Result format specific type below
 */
type ResultMetricBreakdown = Record<string, number | Record<string | number>>;

type ResultMetric = Record<string, number | ResultMetricBreakdown>;

type ResultPromptTemplate = {
  id: string;
  metrics: ResultMetric[];
};

type ResultDataset = {
  id: string;
  prompt_templates: ResultPromptTemplate[];
};

type ResultModel = {
  id: string;
  datasets: ResultDataset[];
};

type ResultRecipe = {
  id: string;
  models: ResultModel[];
};

type ResultCookbook = {
  id: string;
  recipes: ResultRecipe[];
};

type ResultMetadata = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  duration: number;
  recipes: string[];
  cookbooks: string[];
  endpoints: string[];
  num_of_prompts: number;
  status: string;
};

type Results = {
  cookbooks: ResultCookbook[];
};

type BenchmarkResultsFormat = {
  metadata: ResultMetadata;
  results: Results;
};

type CustomColors = {
  moongray: Record<string, string>;
  moonwine: Record<string, string>;
  imdalight: Record<string, string>;
  white: string;
  black: string;
  moonpurplelight: string;
};

type BenchmarkTopic = {
  id: string;
  name: string;
};

type CookbookMetadata = {
  totalPrompts: number;
  estTotalPromptResponseTime: number;
};

type Runner = {
  id: string;
  run_id?: number;
  runner_id?: string;
  name: string;
  database_file: string;
  endpoints: string[];
  description: string;
  runner_args?: {
    cookbooks: string[];
    num_of_prompts: number;
    random_seed: number;
    system_prompt: string;
    runner_processing_module: string;
    result_processing_module: string;
  };
  start_time?: number;
};

declare module 'next/dist/compiled/react-dom/cjs/react-dom-server-legacy.browser.development' {
  import ReactDOMServer from 'react-dom/server';
  export = ReactDOMServer;
}
