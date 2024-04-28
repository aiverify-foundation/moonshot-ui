type TabItem = {
  id: string;
  label: string;
};

type Props = {
  tabItems: TabItem[];
  activeTabId: string;
  barColor?: string;
  textColor?: string;
  tabHoverColor?: string;
  selectedTabColor?: string;
  onTabClick: (id: string) => void;
};

function TabsBar(props: Props) {
  const {
    tabItems,
    barColor,
    activeTabId,
    selectedTabColor,
    tabHoverColor,
    textColor = '#FFFFFF',
    onTabClick,
  } = props;
  return (
    <ul
      className="flex items-center justify-center gap-10 py-1 px-6 rounded"
      style={{
        backgroundColor: barColor,
      }}>
      {tabItems.map((tabItem) => (
        <li
          key={tabItem.id}
          className="rounded px-5 py-1"
          style={{
            color: textColor,
            backgroundColor: activeTabId === tabItem.id ? selectedTabColor : '',
          }}>
          <button onClick={() => onTabClick(tabItem.id)}>
            {tabItem.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export { TabsBar };
export type { TabItem };
