'use client';
import { useSearchParams } from 'next/navigation';
import React, { CSSProperties, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/views/shared-components/customColors';
import { MainSectionSurface } from '@/app/views/shared-components/mainSectionSurface/mainSectionSurface';
import { TextInput } from '@/app/components/textInput';

interface CustomStyle extends CSSProperties {
  webkitLineClamp?: string;
  webkitBoxOrient?: 'vertical';
}
const ellipsisStyle: CustomStyle = {
  display: '-webkit-box',
  webkitLineClamp: '2',
  webkitBoxOrient: 'vertical',
};

function RecipesViewList({ recipes }: { recipes: Recipe[] }) {
  const searchParams = useSearchParams();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(() => {
    const id = searchParams.get('id');
    if (!Boolean(id)) {
      return recipes[0];
    }
    return recipes.find((att) => att.id === id) || recipes[0];
  });

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      minHeight={750}
      bgColor={colors.moongray['950']}>
      <div className="relative h-full">
        <header className="flex gap-5 w-full mb-3 justify-between items-end">
          <h1 className="text-[1.6rem] text-white mt-3">Recipes</h1>
        </header>
        <main
          className="flex gap-5 mb-3"
          style={{ height: 'calc(100% - 90px)' }}>
          <section className="flex flex-col flex-1">
            <TextInput
              name="search"
              placeholder="Search"
              value={''}
              onChange={() => null}
            />
            <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
              {recipes.map((recipe) => {
                const isSelected = recipe.id === selectedRecipe.id;
                return (
                  <li
                    key={recipe.id}
                    className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                    style={{
                      transition: 'background-color 0.2s ease-in-out',
                      ...(isSelected && {
                        backgroundColor: colors.moongray['700'],
                      }),
                    }}
                    onClick={() => setSelectedRecipe(recipe)}>
                    <div className="flex gap-2 mb-2">
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
                        {idx === selectedRecipe.categories.length - 1
                          ? ''
                          : `,`}
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
      </div>
    </MainSectionSurface>
  );
}

export { RecipesViewList };
