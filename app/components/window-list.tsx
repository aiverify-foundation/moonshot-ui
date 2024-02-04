import { PropsWithChildren } from 'react';

function WindowList(props: PropsWithChildren) {
  const { children } = props;
  return (
    <ul
      className="text-sm text-gray-600 divide-dashed
      divide-y scroll-container
      divide-fuchsia-200 dark:divide-slate-300">
      {children}
    </ul>
  );
}

type ListItemProps = {
  id: string;
  displayName: string;
  onClick: (id: string) => void;
};

function ListItem(props: ListItemProps) {
  const { id, displayName, onClick } = props;
  return (
    <li
      className="border-fuchsia-200 cursor-pointer 
        hover:bg-fuchsia-200 dark:hover:bg-slate-200"
      onClick={() => onClick(id)}>
      {displayName}
    </li>
  );
}

WindowList.Item = ListItem;
export { WindowList };
