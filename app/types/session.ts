export type Session = {
  session_id: string;
  name: string;
  description: string;
  created_epoch: number;
  created_datetime: string;
  chats: string[];
  endpoints: string[];
  metadata_file: string;
  prompt_template: string;
  context_strategy: number;
  filename: string;
};
