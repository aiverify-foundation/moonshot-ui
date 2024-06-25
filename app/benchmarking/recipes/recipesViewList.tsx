'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/views/shared-components/customColors';
import { Modal } from '@/app/views/shared-components/modal/modal';

interface CustomStyle extends React.CSSProperties {
  WebkitLineClamp?: string;
  WebkitBoxOrient?: 'vertical';
}
const ellipsisStyle: CustomStyle = {
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
};

function RecipesViewList({
  recipes,
  cookbooks,
}: {
  recipes: Recipe[];
  cookbooks: Cookbook[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe>(() => {
    const id = searchParams.get('id');
    if (!Boolean(id)) {
      return recipes[0];
    }
    return recipes.find((att) => att.id === id) || recipes[0];
  });
  const [selectedCookbook, setSelectedCookbook] = React.useState<Cookbook>(
    () => cookbooks[0]
  );

  const [searchQuery, setSearchQuery] = React.useState('');
  const [checkedRecipes, setCheckedRecipes] = React.useState<Recipe[]>([]);
  const [formStep, setFormStep] = React.useState<'view' | 'add'>('view');
  const [showResultModal, setShowResultModal] = React.useState(false);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleCheck(recipe: Recipe) {
    setCheckedRecipes((prev) => {
      if (prev.includes(recipe)) {
        return prev.filter((r) => r.id !== recipe.id);
      }
      return [...prev, recipe];
    });
  }

  function handleRemoveRecipe(recipe: Recipe) {
    setCheckedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
  }

  const title = formStep === 'view' ? 'Recipes' : 'Add Recipes to Cookbook';

  const viewRecipes = (
    <>
      <main
        className="flex gap-5 mb-3"
        style={{
          height:
            checkedRecipes.length > 0
              ? 'calc(100% - 125px)'
              : 'calc(100% - 90px)',
        }}>
        <section className="flex flex-col flex-1">
          <TextInput
            name="search"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearch}
          />
          <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
            {filteredRecipes.map((recipe) => {
              const isSelected = recipe.id === selectedRecipe.id;
              return (
                <li
                  key={recipe.id}
                  className="flex gap-4 p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                  style={{
                    transition: 'background-color 0.2s ease-in-out',
                    ...(isSelected && {
                      backgroundColor: colors.moongray['700'],
                    }),
                  }}
                  onClick={() => setSelectedRecipe(recipe)}>
                  <input
                    type="checkbox"
                    name={recipe.id}
                    aria-label={`Select ${recipe.name}`}
                    className="w-2 h-2 shrink-0"
                    checked={checkedRecipes.some((rc) => rc.id === recipe.id)}
                    onChange={() => handleCheck(recipe)}
                  />
                  <div>
                    <div className="flex gap-1 mb-2 items-start">
                      <Icon name={IconName.File} />
                      <h4 className="text-[1rem] font-semibold">
                        {recipe.name}
                      </h4>
                    </div>
                    <p
                      className="text-[0.8rem] h-[40px] overflow-hidden text-moongray-400"
                      style={ellipsisStyle}>
                      {recipe.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        <section
          className="text-white border border-moonwine-500 p-4 rounded-md 
            overflow-y-auto custom-scrollbar bg-moongray-800 flex-1">
          <div className="flex gap-2 mb-4">
            <Icon
              name={IconName.File}
              size={24}
            />
            <h3 className="text-[1.2rem] font-semibold">
              {selectedRecipe.name}
            </h3>
          </div>
          <p className="text-[0.95rem] mb-4">{selectedRecipe.description}</p>
          <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
            Categories
          </h4>
          <p className="text-[0.95rem] mb-4 text-moongray-300">
            {selectedRecipe.categories.length === 0
              ? 'None'
              : selectedRecipe.categories.map((category, idx) => {
                  return (
                    <span key={category}>
                      {category}
                      {idx === selectedRecipe.categories.length - 1 ? '' : `,`}
                      &nbsp;
                    </span>
                  );
                })}
          </p>
          <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">Tags</h4>
          <p className="text-[0.95rem] mb-4 text-moongray-300">
            {selectedRecipe.tags.length === 0
              ? 'None'
              : selectedRecipe.tags.map((tag, idx) => {
                  return (
                    <span key={tag}>
                      {tag}
                      {idx === selectedRecipe.tags.length - 1 ? '' : `,`}
                      &nbsp;
                    </span>
                  );
                })}
          </p>
          <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">Prompts</h4>
          <p className="text-[0.95rem] mb-4 text-moongray-300">
            {selectedRecipe.total_prompt_in_recipe}
          </p>
          <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">Metrics</h4>
          <p className="text-[0.95rem] mb-4 text-moongray-300">
            {selectedRecipe.metrics.length === 0
              ? 'None'
              : selectedRecipe.metrics.map((metric, idx) => {
                  return (
                    <span key={metric}>
                      {metric}
                      {idx === selectedRecipe.metrics.length - 1 ? '' : `,`}
                      &nbsp;
                    </span>
                  );
                })}
          </p>
        </section>
      </main>
      <footer className="flex justify-end gap-2 mt-2">
        {checkedRecipes.length > 0 && (
          <Button
            disabled={checkedRecipes.length === 0}
            mode={ButtonType.PRIMARY}
            text="Add to Cookbook"
            size="lg"
            hoverBtnColor={colors.moongray[1000]}
            pressedBtnColor={colors.moongray[900]}
            onClick={() => setFormStep('add')}
          />
        )}
      </footer>
    </>
  );

  const addRecipes = (
    <>
      <main
        className="flex flex-col gap-5 mb-3"
        style={{
          height:
            checkedRecipes.length > 0 || formStep === 'add'
              ? 'calc(100% - 125px)'
              : 'calc(100% - 90px)',
        }}>
        <div className="flex flex-col gap-2">
          <h2
            className="text-[1rem] text-white"
            style={{
              fontSize: '1rem',
              color: colors.moonpurplelight,
            }}>
            Selected Recipes
          </h2>
          <section
            className="flex flex-wrap gap-3 w-full border border-white/20
            p-4 rounded-lg max-h-[150px] min-h-[100px] overflow-y-auto custom-scrollbar">
            {!checkedRecipes.length ? (
              <Button
                width={200}
                mode={ButtonType.OUTLINE}
                text="Back to select Recipes"
                size="md"
                hoverBtnColor={colors.moongray[800]}
                pressedBtnColor={colors.moongray[700]}
                onClick={() => setFormStep('view')}
              />
            ) : (
              checkedRecipes.map((recipe) => (
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
              ))
            )}
          </section>
        </div>
        <div className="flex flex-col gap-2 max-h-[450px]">
          <h2
            className="text-[1rem] text-white"
            style={{
              fontSize: '1rem',
              color: colors.moonpurplelight,
            }}>
            Select a Cookbook
          </h2>
          <section
            className="grid grid-cols-2 gap-5"
            style={{ height: 'calc(100% - 70px)' }}>
            <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
              {cookbooks.map((cookbook) => {
                const isSelected = cookbook.id === selectedCookbook.id;
                return (
                  <li
                    key={cookbook.id}
                    className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                    style={{
                      transition: 'background-color 0.2s ease-in-out',
                      ...(isSelected && {
                        backgroundColor: colors.moongray['700'],
                      }),
                    }}
                    onClick={() => setSelectedCookbook(cookbook)}>
                    <div className="flex gap-2 mb-2">
                      <Icon name={IconName.Book} />
                      <h4 className="text-[1rem] font-semibold">
                        {cookbook.name}
                      </h4>
                    </div>
                    <p
                      className="text-[0.8rem] h-[40px] overflow-hidden text-ellipsis text-moongray-400"
                      style={ellipsisStyle}>
                      {cookbook.description}
                    </p>
                  </li>
                );
              })}
            </ul>
            <section className="text-white border border-moonwine-500 p-4 rounded-md overflow-y-auto custom-scrollbar bg-moongray-800">
              <div className="flex gap-2 mb-4">
                <Icon
                  name={IconName.Book}
                  size={24}
                />
                <h3 className="text-[1.2rem] font-semibold">
                  {selectedCookbook.name}
                </h3>
              </div>
              <p className="text-[0.95rem] text-moongray-300">
                {selectedCookbook.description}
              </p>
              <h4 className="text-[1.15rem] font-semibold mt-10 mb-1">
                Recipes
              </h4>
              <p className="text-[0.95rem] text-moongray-300">
                {selectedCookbook.recipes.map((recipe, idx) => {
                  return (
                    <span key={recipe}>
                      {recipe}
                      {idx === selectedCookbook.recipes.length - 1 ? '' : `,`}
                      &nbsp;
                    </span>
                  );
                })}
              </p>
            </section>
          </section>
        </div>
      </main>
      <footer className="flex justify-end gap-2 mt-2">
        <Button
          width={120}
          mode={ButtonType.OUTLINE}
          text="Back"
          size="lg"
          hoverBtnColor={colors.moongray[800]}
          pressedBtnColor={colors.moongray[700]}
          onClick={() => setFormStep('view')}
        />
        <Button
          disabled={
            checkedRecipes.length === 0 && selectedCookbook !== undefined
          }
          mode={ButtonType.PRIMARY}
          text="Add"
          size="lg"
          hoverBtnColor={colors.moongray[1000]}
          pressedBtnColor={colors.moongray[900]}
          onClick={() => setShowResultModal(true)}
        />
      </footer>
    </>
  );

  const resultModal = (
    <Modal
      heading="Recipes Added to Cookbook"
      bgColor={colors.moongray['800']}
      textColor="#FFFFFF"
      primaryBtnLabel="View Cookbooks"
      secondaryBtnLabel="View Recipes"
      enableScreenOverlay
      onCloseIconClick={() => {
        setShowResultModal(false);
      }}
      onSecondaryBtnClick={() => {
        setCheckedRecipes([]);
        setSelectedCookbook(cookbooks[0]);
        setFormStep('view');
        setShowResultModal(false);
      }}
      onPrimaryBtnClick={() => router.push('/benchmarking/cookbooks')}>
      <div className="flex gap-2 items-start">
        <p>{`Cookbook ${selectedCookbook.name} was successfully updated with the selected recipes.`}</p>
      </div>
    </Modal>
  );

  return (
    <div className="relative h-full">
      {showResultModal ? resultModal : null}
      <header className="flex gap-5 w-full mb-3 justify-between items-end">
        <h1 className="text-[1.6rem] text-white mt-3">{title}</h1>
      </header>
      {formStep === 'view' ? viewRecipes : addRecipes}
    </div>
  );
}

export { RecipesViewList };
