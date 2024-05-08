import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getHostAndPort } from './host';

const [host, port] = getHostAndPort();
const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllRecipes: builder.query<Recipe[], void>({
      query: () => 'api/v1/recipes',
      keepUnusedDataFor: 0,
    }),
    getRecipesByIds: builder.query<Recipe[], number[]>({
      query: (ids) => ({
        url: `api/v1/recipes`,
        params: { ids: ids.join(',') },
      }),
    }),
    createRecipe: builder.mutation<Recipe, Recipe>({
      query: (recipeInputData) => ({
        url: 'api/v1/recipes',
        method: 'POST',
        body: recipeInputData,
      }),
    }),
  }),
});

const { useGetAllRecipesQuery, useCreateRecipeMutation } = recipeApi;

export { recipeApi, useCreateRecipeMutation, useGetAllRecipesQuery };
