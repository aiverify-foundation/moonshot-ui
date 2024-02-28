import { PropsWithChildren, ReactElement } from 'react';

function WindowList(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ul className="p-1 text-sm text-gray-600 divide-y divide-dashed scroll-container divide-fuchsia-200 dark:divide-slate-300">
      {children}
    </ul>
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
      className={`border-fuchsia-200 cursor-pointer py-1
        hover:bg-fuchsia-100 dark:hover:bg-slate-100 
        ${selected ? 'bg-fuchsia-200 dark:bg-slate-200' : ''}
      `}
      onClick={() => onClick(id)}>
      {displayName}
      <div>
        {children}
      </div>
    </li>
  );
}

WindowList.Item = ListItem;
export { WindowList };
