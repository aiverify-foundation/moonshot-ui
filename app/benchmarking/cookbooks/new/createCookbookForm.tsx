'use client';

import { useFormik } from 'formik';
import React from 'react';
import { object, string, array } from 'yup';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/views/shared-components/customColors';
import config from '@/moonshot.config';
import { RecipesViewList } from './recipesViewList';
export const dynamic = 'force-dynamic';

type CreateCookbookFormValues = {
  name: string;
  description: string;
  recipes: string[];
};

const initialFormValues: CreateCookbookFormValues = {
  name: '',
  description: '',
  recipes: [],
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  description: string(),
  recipes: array().min(1, 'At least one recipe is required'),
});

function CreateCookbookForm({ recipes }: { recipes: Recipe[] }) {
  const [selectedRecipes, setSelectedRecipes] = React.useState<Recipe[]>([]);
  const [showRecipesList, setShowRecipesList] = React.useState(false);
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // TODO submission
    },
  });

  function handleAddRecipes(recipes: Recipe[]) {
    setSelectedRecipes(recipes);
  }

  function handleRemoveRecipe(recipe: Recipe) {
    setSelectedRecipes(selectedRecipes.filter((r) => r.id !== recipe.id));
  }

  if (showRecipesList) {
    return (
      <>
        <header className="flex gap-5 w-full">
          <h1 className="text-[1.6rem] text-white">
            Create Cookbook - Select Recipes
          </h1>
        </header>
        <RecipesViewList
          recipes={recipes}
          addedRecipes={selectedRecipes}
          onAddBtnClick={handleAddRecipes}
          onBackBtnClick={() => setShowRecipesList(false)}
        />
      </>
    );
  }

  return (
    <>
      <header className="flex gap-5 w-full justify-center">
        <h1 className="text-[1.6rem] text-white">Create Cookbook</h1>
      </header>
      <main className="flex items-center justify-center min-h-[300px] gap-5 mt-8">
        <div className="flex flex-col w-[50%] gap-2">
          <TextInput
            name="name"
            label="Name"
            onChange={formik.handleChange}
            value={formik.values.name}
            onBlur={formik.handleBlur}
            error={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : undefined
            }
            labelStyles={{
              fontSize: '1rem',
              color: colors.moonpurplelight,
            }}
            inputStyles={{ height: 38 }}
            placeholder="Give this cookbook a unique name"
          />

          <TextArea
            name="description"
            label="Description (optional)"
            labelStyles={{
              fontSize: '1rem',
              color: colors.moonpurplelight,
            }}
            onChange={formik.handleChange}
            value={formik.values.description}
            error={
              formik.touched.description && formik.errors.description
                ? formik.errors.description
                : undefined
            }
            placeholder="Describe this cookbook"
          />
          <section className="flex justify-between items-end">
            <h2
              className="text-[1rem] text-white"
              style={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}>
              Selected Recipes
            </h2>
            <Button
              disabled={!formik.isValid}
              mode={ButtonType.OUTLINE}
              size="md"
              type="button"
              text="Select Recipes"
              leftIconName={IconName.Plus}
              hoverBtnColor={colors.moongray[800]}
              pressedBtnColor={colors.moongray[700]}
              onClick={() => setShowRecipesList(!showRecipesList)}
            />
          </section>
          <section
            className="flex flex-wrap gap-3 w-full border border-white/20
            p-4 pt-2 rounded-lg max-h-[280px] min-h-[100px] overflow-y-auto custom-scrollbar">
            {selectedRecipes.map((recipe) => (
              <Button
                key={recipe.id}
                size="sm"
                leftIconName={IconName.Close}
                mode={ButtonType.OUTLINE}
                text={recipe.name}
                hoverBtnColor={colors.moongray[800]}
                pressedBtnColor={colors.moongray[700]}
                onClick={() => handleRemoveRecipe(recipe)}
              />
            ))}
          </section>

          <div className="flex grow gap-4 justify-center items-end mt-3">
            <Button
              disabled={!formik.isValid || selectedRecipes.length === 0}
              mode={ButtonType.PRIMARY}
              size="lg"
              type="button"
              text="Create Cookbook"
              hoverBtnColor={colors.moongray[1000]}
              pressedBtnColor={colors.moongray[900]}
              onClick={() => formik.handleSubmit()}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export { CreateCookbookForm };
