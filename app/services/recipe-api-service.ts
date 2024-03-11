import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${host}:${port}` }),
  endpoints: (builder) => ({
    getAllRecipes: builder.query<Recipe[], void>({
      query: () => 'api/v1/recipes',
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
