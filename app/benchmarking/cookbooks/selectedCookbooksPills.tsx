import React from 'react';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';

type SelectedCookbooksPillsProps = {
  maxHeight?: React.CSSProperties['maxHeight'];
  checkedCookbooks: Cookbook[];
  onPillButtonClick: (cookbook: Cookbook) => void;
};

function SelectedCookbooksPills({
  maxHeight,
  checkedCookbooks,
  onPillButtonClick,
}: SelectedCookbooksPillsProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2
        className="text-[1rem] text-white"
        style={{
          fontSize: '1rem',
          color: colors.moonpurplelight,
        }}>
        Selected Cookbooks
        {checkedCookbooks.length ? (
          <span
            className="ml-2"
            style={{
              fontSize: '1rem',
              color: colors.moonpurplelight,
            }}>
            : &nbsp;{checkedCookbooks.length}
          </span>
        ) : null}
      </h2>
      <section
        className="flex flex-wrap gap-3 w-full border border-white/20
        p-4 rounded-lg max-h-[150px] min-h-[100px] overflow-y-auto custom-scrollbar"
        style={{ maxHeight }}>
        {!checkedCookbooks.length ? (
          <p className="text-white">No cookbooks selected</p>
        ) : (
          checkedCookbooks.map((cookbook) => (
            <Button
              key={cookbook.id}
              size="sm"
              leftIconName={IconName.Close}
              mode={ButtonType.OUTLINE}
              text={cookbook.name}
              hoverBtnColor={colors.moongray[800]}
              pressedBtnColor={colors.moongray[700]}
              onClick={() => onPillButtonClick(cookbook)}
            />
          ))
        )}
      </section>
    </div>
  );
}

export { SelectedCookbooksPills };
