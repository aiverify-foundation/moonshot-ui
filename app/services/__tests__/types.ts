
export interface Cookbook {
  id: string;
  title: string;
  description?: string;
  categories: string[];
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CookbookFormValues {
  title: string;
  description?: string;
  categories: string[];
  tags: string[];
}