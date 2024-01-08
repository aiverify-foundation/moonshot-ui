type WindowListItem = {
  id: string;
  displayName: string;
};

type WindowListProps = {
  items: WindowListItem[];
  styles?: React.CSSProperties;
};

function WindowList(props: WindowListProps) {
  const { items, styles } = props;
  return (
    <div style={{ ...styles }}>
      <ul style={{ color: '#494848', padding: 15 }}>
        {items.map((item) => (
          <li key={item.id}
            style={{ borderBottom: '1px solid #dbdada', cursor: 'pointer' }}>{item.displayName}</li>
        ))}
      </ul>
    </div>
  );
}

export { WindowList }
export type { WindowListItem }
