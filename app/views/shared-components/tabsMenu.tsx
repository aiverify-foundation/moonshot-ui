import { useState } from 'react';

type TabItem<T> = {
  id: string;
  label: string;
  data?: T;
};

type TabsMenuProps = {
  tabItems: TabItem<string[]>[];
  activeTabId: string;
  barColor: string;
  textColor: string;
  tabHoverColor: string;
  selectedTabColor: string;
  onTabClick: (tab: TabItem<string[]>) => void;
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
      {tabItems.map((tab) => {
        const isActive = activeTabId === tab.id;
        const isHovered = hoveredTabId === tab.id;
        let tabColor = '';
        if (isActive) {
          tabColor = selectedTabColor || '';
        } else if (isHovered) {
          tabColor = tabHoverColor;
        }
        return (
          <li
            key={tab.id}
            className="rounded px-5 py-1 transition-all duration-300"
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => setHoveredTabId(undefined)}
            style={{
              color: textColor,
              backgroundColor: tabColor,
            }}>
            <button onClick={() => onTabClick(tab)}>{tab.label}</button>
          </li>
        );
      })}
    </ul>
  );
}

export { TabsMenu };
export type { TabItem };
