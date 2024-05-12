import React from 'react';
import { Icon, IconName } from './IconSVG';

type TagLabelProps = {
  text: string;
  iconName: IconName;
  iconSize?: number;
  className?: string;
  onIconClick?: () => void;
};

const TagLabel: React.FC<TagLabelProps> = ({
  text,
  className,
  iconName,
  iconSize = 13,
  onIconClick,
}) => {
  return (
    <div
      className={`flex items-center py-0 text-xs text-white divide-x 
        divide-slate-100/50 h-fit shadow-md rounded ${className}`}>
      {text !== undefined ? (
        <div className="h-full text-white px-2">{text}</div>
      ) : null}
      <div
        className="hover:bg-fuchsia-400 bg-fuchsia-300 
        dark:bg-sky-700 dark:hover:bg-sky-800 
        rounded-r-[4px] p-1 cursor-pointer"
        onClick={onIconClick}>
        <Icon
          name={iconName}
          color="#111827"
          size={iconSize}
        />
      </div>
    </div>
  );
};

export { TagLabel };
