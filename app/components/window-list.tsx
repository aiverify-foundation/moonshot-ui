import React, { PropsWithChildren } from 'react';
import { Icon, IconName } from './IconSVG';

type WindowListProps = {
  disableMouseInteraction?: boolean;
  styles?: React.CSSProperties;
};
function WindowList(props: PropsWithChildren<WindowListProps>) {
  const { children, styles, disableMouseInteraction = false } = props;
  return (
    <div
      className="h-full overflow-x-hidden overflow-y-auto
      custom-scrollbar mr-[2px]"
      style={styles}>
      <ul
        className={`text-sm text-gray-600 divide-y divide-solid
        divide-gray-200 dark:divide-slate-300 ${disableMouseInteraction ? 'pointer-events-none' : ''}`}>
        {children}
      </ul>
    </div>
  );
}

type ListItemProps = {
  id: string;
  displayName?: string;
  selected?: boolean;
  enableCheckbox?: boolean;
  checked?: boolean;
  onClick?: (id: string) => void;
  onCloseIconClick?: (id: string) => void;
  onHover?: (id: string) => void;
  onCheckboxChange?: (id: string, checked: boolean) => void;
};

function ListItem(props: PropsWithChildren<ListItemProps>) {
  const {
    id,
    displayName,
    selected,
    enableCheckbox = false,
    checked = false,
    onCheckboxChange,
    onClick,
    onCloseIconClick,
    onHover,
    children,
  } = props;

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onCheckboxChange) onCheckboxChange?.(id, e.target.checked);
  }

  function itemClickHandler(id: string) {
    return () => (onClick ? onClick(id) : undefined);
  }

  function itemHoverHandler(id: string) {
    return () => (onHover ? onHover(id) : undefined);
  }

  function handleCloseIconClick(id: string) {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onCloseIconClick) onCloseIconClick(id);
    };
  }

  return (
    <li
      className={`flex items-center justify-between border-fuchsia-200
        transition-colors duration-100 ease-in-out px-3 py-2
        hover:bg-gray-100 dark:hover:bg-slate-100 
        ${selected ? 'bg-gray-200 dark:bg-slate-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onMouseOver={itemHoverHandler(id)}
      onClick={itemClickHandler(id)}>
      {enableCheckbox && (
        <input
          type="checkbox"
          className="w-4 h-4 mr-5 ml-2 shrink-0"
          checked={checked}
          onChange={handleCheckboxChange}
        />
      )}
      {displayName}
      <div>{children}</div>
      {onCloseIconClick ? (
        <Icon
          name={IconName.Close}
          onClick={handleCloseIconClick(id)}
        />
      ) : null}
    </li>
  );
}

WindowList.Item = ListItem;
export { WindowList };
