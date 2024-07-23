import React from 'react';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';

type SelectedRecipesPillsProps = {
  maxHeight?: React.CSSProperties['maxHeight'];
  checkedRecipes: Recipe[];
  onPillButtonClick: (recipe: Recipe) => void;
};

function SelectedRecipesPills({
  maxHeight,
  checkedRecipes,
  onPillButtonClick,
}: SelectedRecipesPillsProps) {
  return (
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
        p-4 rounded-lg max-h-[150px] min-h-[100px] overflow-y-auto custom-scrollbar"
        style={{ maxHeight }}>
        {!checkedRecipes.length ? (
          <p className="text-white">No recipes selected</p>
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
              onClick={() => onPillButtonClick(recipe)}
            />
          ))
        )}
      </section>
    </div>
  );
}

export { SelectedRecipesPills };
