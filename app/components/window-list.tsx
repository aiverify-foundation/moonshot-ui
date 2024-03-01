import { PropsWithChildren } from 'react';

function WindowList(props: PropsWithChildren) {
  const { children } = props;
  return (
    <div
      className="h-full overflow-x-hidden overflow-y-auto
      custom-scrollbar mr-[2px]">
      <ul
        className="text-sm text-gray-600 divide-y divide-solid
        divide-gray-200 dark:divide-slate-300">
        {children}
      </ul>
    </div>
  );
}

type ListItemProps = {
  id: string;
  displayName?: string;
  selected?: boolean;
  onClick: (id: string) => void;
};

function ListItem(props: PropsWithChildren<ListItemProps>) {
  const { id, displayName, selected, onClick, children } = props;
  return (
    <li
      className={`border-fuchsia-200 cursor-pointer
        transition-colors duration-100 ease-in-out px-3 py-2
        hover:bg-gray-100 dark:hover:bg-slate-100 
        ${selected ? 'bg-gray-200 dark:bg-slate-200' : ''}
      `}
      onClick={() => onClick(id)}>
      {displayName}
      <div>{children}</div>
    </li>
  );
}

WindowList.Item = ListItem;
export { WindowList };
