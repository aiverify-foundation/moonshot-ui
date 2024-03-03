import React from 'react';
import { Icon, IconName } from './IconSVG';

type TagLabelProps = {
  text: string;
  iconName: IconName;
  iconSize?: number;
  className?: string;
};

const TagLabel: React.FC<TagLabelProps> = ({
  text,
  className,
  iconName,
  iconSize = 13,
}) => {
  return (
    <div
      className={`flex items-center gap-2 py-0 text-xs text-white rounded-md px-2 divide-x divide-slate-100/50 ${className}`}>
      {text !== undefined ? (
        <div className="mb-[2px] text-white">{text}</div>
      ) : null}
      <div className="pl-2">
        <Icon
          name={iconName}
          lightModeColor="#FFFFFF"
          size={iconSize}
        />
      </div>
    </div>
  );
};

export { TagLabel };
