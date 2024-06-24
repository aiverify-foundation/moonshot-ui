'use client';
import React, { CSSProperties, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';

interface CustomStyle extends CSSProperties {
  webkitLineClamp?: string;
  webkitBoxOrient?: 'vertical';
}
const ellipsisStyle: CustomStyle = {
  display: '-webkit-box',
  webkitLineClamp: '2',
  webkitBoxOrient: 'vertical',
};

type RecipesViewListProps = {
  recipes: Recipe[];
  addedRecipes: Recipe[];
  onAddBtnClick: (recipes: Recipe[]) => void;
  onBackBtnClick: () => void;
};

function RecipesViewList({
  recipes = [],
  addedRecipes = [],
  onAddBtnClick,
  onBackBtnClick,
}: RecipesViewListProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(
    () => recipes[0]
  );
  const [checkedRecipes, setCheckedRecipes] = useState<Recipe[]>(
    () => addedRecipes
  );

  function handleCheck(recipe: Recipe) {
    setCheckedRecipes((prev) => {
      if (prev.includes(recipe)) {
        return prev.filter((r) => r.id !== recipe.id);
      }
      return [...prev, recipe];
    });
  }

  function handleRecipeClick(recipe: Recipe) {
    return (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      setSelectedRecipe(recipe);
    };
  }

  function handleAddBtnClick() {
    onAddBtnClick(checkedRecipes);
    onBackBtnClick();
  }

  return (
    <div
      className="flex flex-col mt-2"
      style={{ height: 'calc(100% - 125px)' }}>
      <main className="grid grid-cols-2 gap-5 mb-3 h-full">
        <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
          {recipes.map((recipe) => {
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
                onClick={handleRecipeClick(recipe)}>
                <input
                  type="checkbox"
                  className="w-2 h-2 shrink-0"
                  checked={checkedRecipes.includes(recipe)}
                  onChange={() => handleCheck(recipe)}
                />
                <div>
                  <div className="flex gap-2 mb-2">
                    <Icon name={IconName.File} />
                    <h4 className="text-[1rem] font-semibold">{recipe.name}</h4>
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
        <section
          className="text-white border border-moonwine-500 p-4 rounded-md 
        overflow-y-auto custom-scrollbar bg-moongray-800">
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
        <Button
          width={120}
          mode={ButtonType.OUTLINE}
          text="Back"
          size="lg"
          hoverBtnColor={colors.moongray[800]}
          pressedBtnColor={colors.moongray[700]}
          onClick={onBackBtnClick}
        />
        <Button
          disabled={checkedRecipes.length === 0}
          mode={ButtonType.PRIMARY}
          text="Add to Cookbook"
          size="lg"
          hoverBtnColor={colors.moongray[1000]}
          pressedBtnColor={colors.moongray[900]}
          onClick={handleAddBtnClick}
        />
      </footer>
    </div>
  );
}

export { RecipesViewList };
