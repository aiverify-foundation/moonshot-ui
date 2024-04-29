import { useState } from 'react';

type TabItem = {
  id: string;
  label: string;
};

type TabsMenuProps = {
  tabItems: TabItem[];
  activeTabId: string;
  barColor: string;
  textColor: string;
  tabHoverColor: string;
  selectedTabColor: string;
  onTabClick: (id: string) => void;
};

function TabsMenu(props: TabsMenuProps) {
  const {
    tabItems,
    barColor,
    activeTabId,
    selectedTabColor,
    tabHoverColor,
    textColor,
    onTabClick,
  } = props;
  const [hoveredTabId, setHoveredTabId] = useState<string | undefined>();

  return (
    <ul
      className="flex items-center justify-center gap-5 py-1 px-6 rounded"
      style={{
        backgroundColor: barColor,
      }}>
      {tabItems.map((tabItem) => {
        const isActive = activeTabId === tabItem.id;
        const isHovered = hoveredTabId === tabItem.id;
        let tabColor = '';
        if (isActive) {
          tabColor = selectedTabColor || '';
        } else if (isHovered) {
          tabColor = tabHoverColor;
        }
        return (
          <li
            key={tabItem.id}
            className="rounded px-5 py-1 transition-all duration-300"
            onMouseEnter={() => setHoveredTabId(tabItem.id)}
            onMouseLeave={() => setHoveredTabId(undefined)}
            style={{
              color: textColor,
              backgroundColor: tabColor,
            }}>
            <button onClick={() => onTabClick(tabItem.id)}>
              {tabItem.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export { TabsMenu };
export type { TabItem };
