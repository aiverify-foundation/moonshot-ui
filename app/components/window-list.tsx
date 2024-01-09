import { PropsWithChildren } from 'react';

type WindowListProps = {
  styles?: React.CSSProperties;
};

function WindowList(props: PropsWithChildren<WindowListProps>) {
  const { styles, children } = props;
  return (
    <div style={{ ...styles }}>
      <ul style={{ color: '#494848', padding: 15 }}>{children}</ul>
    </div>
  );
}

type ListItemProps = {
  id: string;
  displayName: string;
  onClick: (id: string) => void;
  styles?: React.CSSProperties;
};

function ListItem(props: ListItemProps) {
  const { id, displayName, onClick, styles } = props;
  return (
    <li
      onClick={() => onClick(id)}
      style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer', ...styles }}>
      {displayName}
    </li>
  );
}

WindowList.Item = ListItem;
export { WindowList };
