import { useEffect, useRef } from 'react';

type ListItem = {
  id: string;
  displayName: string;
};

type SelectListProps = {
  id: string;
  data: ListItem[];
  styles?: React.CSSProperties;
  highlight?: string;
  onHighlighted?: (item: ListItem) => void;
  onUnHighlighted?: () => void;
  onItemClick?: (item: ListItem) => void;
  onItemMouseOver?: (item: ListItem) => void;
  onItemMouseOut?: (item: ListItem) => void;
};

function SelectList(props: SelectListProps) {
  const {
    id,
    data,
    styles,
    highlight,
    onHighlighted,
    onUnHighlighted,
    onItemClick,
    onItemMouseOver,
    onItemMouseOut,
  } = props;
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  function handleItemClick(item: ListItem) {
    if (onItemClick) {
      onItemClick(item);
    }
  }

  function handleItemMouseOver(item: ListItem) {
    if (onItemMouseOver) {
      onItemMouseOver(item);
    }
  }

  function handleItemMouseOut(item: ListItem) {
    if (onItemMouseOut) {
      onItemMouseOut(item);
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && highlight) {
      const index = data.findIndex((item) =>
        item.displayName.startsWith(highlight)
      );
      if (index !== -1) {
        handleItemClick(data[index]);
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [highlight, data, handleItemClick]);

  useEffect(() => {
    if (!highlight) {
      if (onUnHighlighted) {
        onUnHighlighted();
      }
      return;
    }
    const index = data.findIndex((item) =>
      item.displayName.startsWith(highlight)
    );
    if (index !== -1 && itemRefs.current[index]) {
      itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
      if (onHighlighted) {
        onHighlighted(data[index]);
      }
    } else if (index === -1) {
      if (onUnHighlighted) {
        onUnHighlighted();
      }
    }
  }, [highlight, data]);

  return (
    <div
      id={id}
      className="custom-scrollbar"
      style={{
        borderRadius: 4,
        background: 'white',
        color: 'black',
        maxHeight: 200,
        overflowY: 'auto',
        boxShadow: '0px 10px 10px #00000047',
        fontSize: 13,
        ...styles,
      }}>
      {data.map((item, index) => {
        const firstMatchIndex = data.findIndex(
          (item) =>
            highlight &&
            item.displayName.toLowerCase().startsWith(highlight.toLowerCase())
        );
        const isHighlighted = index === firstMatchIndex;
        return (
          <div
            ref={(el) => (itemRefs.current[index] = el)}
            key={item.id}
            className={`p-2 cursor-pointer border-b border-lightGray ${
              isHighlighted ? 'bg-e7e7e7' : 'bg-white'
            } hover:bg-e7e7e7`}
            onClick={() => handleItemClick(item)}
            onMouseOver={() => handleItemMouseOver(item)}
            onMouseOut={() => handleItemMouseOut(item)}>
            {isHighlighted ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: item.displayName.replace(
                    new RegExp(`^(${highlight})`, 'gi'),
                    '<mark><b>$1</b></mark>'
                  ),
                }}
              />
            ) : (
              item.displayName
            )}
          </div>
        );
      })}
    </div>
  );
}

export { SelectList };
export type { ListItem };
