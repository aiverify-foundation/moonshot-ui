'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useFormState } from 'react-dom';
import { object, string, array } from 'yup';
import { SelectedRecipesPills } from '@/app/benchmarking/recipes/selectedRecipesPills';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { toErrorWithMessage } from '@/app/lib/error-utils';
// import { useCreateCookbookMutation } from '@/app/services/cookbook-api-service';
import { colors } from '@/app/views/shared-components/customColors';
import { Modal } from '@/app/views/shared-components/modal/modal';
import { createCookbook } from '@/actions/createCookbook';
export const dynamic = 'force-dynamic';

type CreateCookbookFormProps = {
  recipes: Recipe[];
  showBackBtn?: boolean;
  onBackBtnClick?: () => void;
  onSelectRecipesBtnClick: () => void;
  onRecipePillBtnClick: (recipe: Recipe) => void;
  defaultSelectedRecipes: Recipe[];
};

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

function CreateCookbookForm({
  defaultSelectedRecipes = [],
  showBackBtn = false,
  onBackBtnClick,
  onSelectRecipesBtnClick,
  onRecipePillBtnClick,
}: CreateCookbookFormProps) {
  const router = useRouter();
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [creationError, setCreationError] = React.useState<
    string | undefined
  >();
  // const [createCookbook] = useCreateCookbookMutation();
  const [formState, action] = useFormState<{ msg: string }>(
    createCookbook,
    initialFormValues
  );
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
      defaultSelectedRecipes.map((recipe) => recipe.id)
    );
  }, [defaultSelectedRecipes]);

  async function submitCookbookCreation(values: CookbookFormValues) {
    // const result = await createCookbook(values);
    // if ('error' in result) {
    //   const errWithMsg = toErrorWithMessage(result.error);
    //   console.log(result.error);
    //   setCreationError(errWithMsg.message);
    //   return;
    // }
    // setShowResultModal(true);
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
          }}
          onSecondaryBtnClick={() => {
            setShowResultModal(false);
            formik.resetForm();
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
          <form action={action}>
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
            <input
              type="hidden"
              name="recipes"
              value={defaultSelectedRecipes
                .map((recipe) => recipe.id)
                .join(',')}
            />
            <section className="relative">
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 0,
                }}>
                <Button
                  mode={ButtonType.OUTLINE}
                  size="sm"
                  type="button"
                  text="Select Recipes"
                  textSize="0.85rem"
                  leftIconName={IconName.Plus}
                  hoverBtnColor={colors.moongray[800]}
                  pressedBtnColor={colors.moongray[700]}
                  onClick={onSelectRecipesBtnClick}
                />
              </div>
              <SelectedRecipesPills
                checkedRecipes={defaultSelectedRecipes}
                onPillButtonClick={onRecipePillBtnClick}
              />
            </section>
            <div className="flex grow gap-4 justify-center items-end mt-3">
              {showBackBtn ? (
                <Button
                  mode={ButtonType.OUTLINE}
                  size="lg"
                  type="button"
                  text="Back"
                  hoverBtnColor={colors.moongray[800]}
                  pressedBtnColor={colors.moongray[700]}
                  onClick={onBackBtnClick}
                />
              ) : null}
              <Button
                disabled={
                  !formik.isValid || defaultSelectedRecipes.length === 0
                }
                mode={ButtonType.PRIMARY}
                size="lg"
                type="submit"
                text="Create Cookbook"
                hoverBtnColor={colors.moongray[1000]}
                pressedBtnColor={colors.moongray[900]}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export { CreateCookbookForm };
