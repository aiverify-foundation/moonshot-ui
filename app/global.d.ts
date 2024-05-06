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

type CookbookWithRecipe = {
  id: string;
  name: string;
  description: string;
  recipes: Recipe[];
};

type CookbookFormValues = {
  name: string;
  description: string;
  recipes: string[];
};

type Recipe = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  datasets: string[];
  prompt_templates: string[];
  metrics: string[];
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
  exec_id: string;
  exec_name: string;
  exec_type: string;
  curr_duration: number;
  curr_status: string;
  curr_cookbook_index: number;
  curr_cookbook_name: string;
  curr_cookbook_total: number;
  curr_recipe_index: number;
  curr_recipe_name: string;
  curr_recipe_total: number;
  curr_progress: number;
  curr_error_messages: string[];
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

/*
 * End of Result format specific types
 */
