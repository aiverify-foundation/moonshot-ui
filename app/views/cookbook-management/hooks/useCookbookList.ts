import { useGetCookbooksQuery } from '@/app/services/cookbook-api-service';

export default function useCookbookList() {
  const { data, error, isLoading, refetch } = useGetCookbooksQuery(undefined);
  let cookbooks: Cookbook[] = [];
  if (data !== undefined) {
    cookbooks = data;
  }
  return { cookbooks, error, isLoading, refetch };
}
