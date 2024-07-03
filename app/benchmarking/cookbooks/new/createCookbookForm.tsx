'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import { createCookbook } from '@/actions/createCookbook';
import { redirectRoute } from '@/actions/redirectRoute';
import { SelectedRecipesPills } from '@/app/benchmarking/recipes/selectedRecipesPills';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { TextArea } from '@/app/components/textArea';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/views/shared-components/customColors';
import { Modal } from '@/app/views/shared-components/modal/modal';
export const dynamic = 'force-dynamic';

type CreateCookbookFormProps = {
  recipes: Recipe[];
  showBackBtn?: boolean;
  defaultSelectedRecipes: Recipe[];
  name: string;
  description: string;
  onBackBtnClick?: () => void;
  onSelectRecipesBtnClick: () => void;
  onRecipePillBtnClick: (recipe: Recipe) => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
};

const initialFormValues: FormState<CookbookFormValues> = {
  formStatus: 'initial',
  formErrors: undefined,
  name: '',
  description: undefined,
  recipes: [],
};

function CreateCookbookForm({
  defaultSelectedRecipes = [],
  showBackBtn = false,
  name,
  description,
  onBackBtnClick,
  onSelectRecipesBtnClick,
  onRecipePillBtnClick,
  setName,
  setDescription,
}: CreateCookbookFormProps) {
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [formState, action] = useFormState<
    FormState<CookbookFormValues>,
    FormData
  >(createCookbook, initialFormValues);

  React.useEffect(() => {
    if (formState.formStatus === 'error') {
      setShowErrorModal(true);
      return;
    }
    if (formState.formStatus === 'success') {
      setShowResultModal(true);
      setName('');
      setDescription('');
    }
  }, [formState]);

  return (
    <>
      {showErrorModal ? (
        <Modal
          heading="Errors"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Close"
          enableScreenOverlay
          onCloseIconClick={() => setShowErrorModal(false)}
          onPrimaryBtnClick={() => setShowErrorModal(false)}>
          <div className="flex gap-2 items-start">
            <Icon
              name={IconName.Alert}
              size={40}
              color="red"
            />
            {formState.formErrors ? (
              <ul>
                {Object.entries(formState.formErrors).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value.join(', ')}
                  </li>
                ))}
              </ul>
            ) : (
              'An unknown error occurred'
            )}
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
          }}
          onSecondaryBtnClick={() => {
            setShowResultModal(false);
          }}
          onPrimaryBtnClick={() =>
            redirectRoute('/benchmarking/cookbooks', ['cookbooks-collection'])
          }>
          <div className="flex gap-2 items-start">
            <p>{`Cookbook ${formState.name} was successfully created.`}</p>
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
              id="cbName"
              name="name"
              label="Name"
              labelStyles={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}
              inputStyles={{ height: 38 }}
              placeholder="Give this cookbook a unique name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={formState.formErrors?.name?.[0]}
            />

            <TextArea
              id="cbDesc"
              name="description"
              label="Description (optional)"
              labelStyles={{
                fontSize: '1rem',
                color: colors.moonpurplelight,
              }}
              placeholder="Describe this cookbook"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={formState.formErrors?.description?.[0]}
            />
            <div className="hidden">
              {defaultSelectedRecipes.map((recipe) => (
                <input
                  readOnly
                  checked
                  type="checkbox"
                  name="recipes"
                  value={recipe.id}
                  aria-label={`Hidden selected recipe ${recipe.name}`}
                  key={recipe.id}
                />
              ))}
            </div>
            <section className="relative mt-8">
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
                  width={150}
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
                disabled={defaultSelectedRecipes.length === 0 || !name}
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
