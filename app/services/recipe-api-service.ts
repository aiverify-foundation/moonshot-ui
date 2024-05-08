import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

type inputParams = {
  ids?: string[];
  categories?: string[];
  tags?: string[];
  count?: boolean;
};

type urlQueryParams =
  | {
      ids?: string;
      categories?: string;
      tags?: string;
      count?: string;
    }
  | undefined;

const [host, port] = getHostAndPort();
const path = 'api/v1/recipes';
const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllRecipes: builder.query<Recipe[], inputParams | undefined>({
      query: (params) => {
        const { ids, categories, tags, count } = params || {};
        const stringifiedParams: urlQueryParams = params
          ? {
              ...(ids ? { ids: ids.join(',') } : {}),
              ...(categories ? { categories: categories.join(',') } : {}),
              ...(tags ? { tags: tags.join(',') } : {}),
              ...(count !== undefined
                ? { count: count ? 'true' : 'false' }
                : {}),
            }
          : undefined;
        const urlQueryParams = params
          ? new URLSearchParams(stringifiedParams).toString()
          : undefined;
        return {
          url: urlQueryParams ? `${path}?${urlQueryParams}` : path,
          keepUnusedDataFor: 600,
        };
      },
    }),
    createRecipe: builder.mutation<Recipe, Recipe>({
      query: (recipeInputData) => ({
        url: path,
        method: 'POST',
        body: recipeInputData,
      }),
    }),
  }),
});

const { useGetAllRecipesQuery, useCreateRecipeMutation } = recipeApi;

export { recipeApi, useCreateRecipeMutation, useGetAllRecipesQuery };
