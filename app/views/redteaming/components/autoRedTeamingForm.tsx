import { ChangeEvent, useState } from 'react';
import { Button, ButtonType } from '@/app/components/button';
import { SelectInput, SelectOption } from '@/app/components/selectInput';
import { TextArea } from '@/app/components/textArea';
import { useGetAllRecipesQuery } from '@/app/services/recipe-api-service';
import tailwindConfig from '@/tailwind.config';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

function AutoRedTeamingForm() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  const { data: recipes, isLoading: recipesIsLoading } =
    useGetAllRecipesQuery(undefined);

  let recipesSelectionOptions: SelectOption[] = [];
  if (recipes && recipes.length) {
    recipesSelectionOptions = recipes.map((rcp) => ({
      value: rcp.id,
      label: rcp.name,
    }));
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (e.target.name === 'recipe') {
      setSelectedRecipe(recipes?.find((rcp) => rcp.id === e.target.value));
    } else if (e.target.name === 'initialPrompt') {
      setInitialPrompt(e.target.value);
    }
  }

  return (
    <div className="relative flex flex-col min-h-[300px]">
      <h3 className="mb-5 text-white">Automated Red Teaming</h3>
      {recipesIsLoading ? (
        <div className="ring">
          Loading
          <span />
        </div>
      ) : (
        <>
          <SelectInput
            label="Select Recipe"
            name="recipe"
            value={selectedRecipe?.id}
            placeholder="Select a recipe"
            options={recipesSelectionOptions}
            onSyntheticChange={handleChange}
          />
          <TextArea
            name="initialPrompt"
            label="Initial Prompt"
            onChange={handleChange}
            value={initialPrompt}
            placeholder="Enter initial prompt here"
          />
          <div className="flex justify-left mt-2">
            <Button
              type="submit"
              mode={ButtonType.PRIMARY}
              text="Start Red Team"
              btnColor={colors.moongray[950]}
              hoverBtnColor={colors.moongray[900]}
              textColor={colors.white}
            />
          </div>
        </>
      )}
    </div>
  );
}

export { AutoRedTeamingForm };
