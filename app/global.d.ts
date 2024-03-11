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
  type: string;
  name: string;
  uri: string;
  token: string;
  max_calls_per_second: number;
  max_concurrency: number;
  params?: Record<string, string | number>;
};

type Cookbook = {
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

// Reserved z-indexes
type ZIndex = {
  Base: 1;
  Level_1: 100;
  Level_2: 200;
  FocusedWindow: 998;
  Top: 999;
};
