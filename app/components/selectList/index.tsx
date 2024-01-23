type ListItem = {
  id: string;
  displayName: string;
};

type SelectListProps = {
  id: string;
  data: ListItem[];
  styles?: React.CSSProperties;
  onItemClick?: (item: ListItem) => void;
};

function SelectList(props: SelectListProps) {
  const { id, data, styles, onItemClick } = props;

  function handleItemClick(item: ListItem) {
    if (onItemClick) {
      onItemClick(item);
    }
  }

  return (
    <div
      id={id}
      className="custom-scrollbar"
      style={{
        border: '1px solid lightGray',
        borderRadius: 2,
        background: 'white',
        color: 'black',
        maxHeight: 200,
        overflowY: 'auto',
        boxShadow: '0px 10px 10px #00000047',
        fontSize: 13,
        ...styles,
      }}>
      {data.map((item) => (
        <div
          key={item.id}
          style={{
            padding: '10px',
            cursor: 'pointer',
            borderBottom: '1px solid lightGray',
          }}
          onClick={() => handleItemClick(item)}>
          {item.displayName}
        </div>
      ))}
    </div>
  );
}

export { SelectList };
export type { ListItem };
