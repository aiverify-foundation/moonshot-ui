'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { object, string, array } from 'yup';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { toErrorWithMessage } from '@/app/lib/error-utils';
import { useCreateCookbookMutation } from '@/app/services/cookbook-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { Modal } from '@/app/views/shared-components/modal/modal';
import { RecipesViewList } from './recipesViewList';
export const dynamic = 'force-dynamic';

const initialFormValues: CookbookFormValues = {
  name: '',
  description: undefined,
  recipes: [],
};

const validationSchema = object().shape({
  name: string().required('Name is required'),
  description: string().nullable(),
  recipes: array().min(1, 'At least one recipe is required'),
});

function CreateCookbookForm({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const [selectedRecipes, setSelectedRecipes] = React.useState<Recipe[]>([]);
  const [showRecipesList, setShowRecipesList] = React.useState(false);
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [creationError, setCreationError] = React.useState<
    string | undefined
  >();
  const [createCookbook] = useCreateCookbookMutation();
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!values.description || values.description === '') {
        delete values.description;
      }
      submitCookbookCreation(values);
    },
  });

  React.useEffect(() => {
    formik.setFieldValue(
      'recipes',
      selectedRecipes.map((recipe) => recipe.id)
    );
  }, [selectedRecipes]);

  async function submitCookbookCreation(values: CookbookFormValues) {
    const result = await createCookbook(values);
    if ('error' in result) {
      const errWithMsg = toErrorWithMessage(result.error);
      console.log(result.error);
      setCreationError(errWithMsg.message);
      return;
    }
    setShowResultModal(true);
  }

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
      {creationError != undefined ? (
        <Modal
          heading="Errors"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Close"
          enableScreenOverlay
          onCloseIconClick={() => setCreationError(undefined)}
          onPrimaryBtnClick={() => setCreationError(undefined)}>
          <div className="flex gap-2 items-start">
            <Icon
              name={IconName.Alert}
              size={40}
              color="red"
            />
            <p>{creationError}</p>
          </div>
        </Modal>
      ) : null}
      {showResultModal ? (
        <Modal
          heading="Cookbook Created"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="View Cookbooks"
          secondaryBtnLabel="Create Another"
          enableScreenOverlay
          onCloseIconClick={() => {
            setShowResultModal(false);
            formik.resetForm();
            setSelectedRecipes([]);
          }}
          onSecondaryBtnClick={() => {
            setShowResultModal(false);
            formik.resetForm();
            setSelectedRecipes([]);
          }}
          onPrimaryBtnClick={() => router.push('/benchmarking/cookbooks')}>
          <div className="flex gap-2 items-start">
            <p>{`Cookbook ${formik.values.name} was successfully created.`}</p>
          </div>
        </Modal>
      ) : null}
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
              mode={ButtonType.OUTLINE}
              size="sm"
              type="button"
              text="Select Recipes"
              textSize="0.85rem"
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
