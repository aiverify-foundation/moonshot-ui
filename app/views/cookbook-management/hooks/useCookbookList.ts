import { useGetAllCookbooksQuery } from '@/app/services/cookbook-api-service';

export default function useCookbookList() {
  const { data, error, isLoading, refetch } = useGetAllCookbooksQuery(undefined);
  let cookbooks: Cookbook[] = [];
  if (data !== undefined) {
    cookbooks = data;
  }
  return { cookbooks, error, isLoading, refetch };
}
