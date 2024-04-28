import { colors } from '@/app/views/shared-components/customColors';
import { PopupSurface } from '@/app/views/shared-components/popupSurface.tsx/popupSurface';
import { TabsBar, TabItem } from '@/app/views/shared-components/tabsBar';

const tabItems: TabItem[] = [
  { id: 'quality', label: 'Quality' },
  { id: 'capability', label: 'Capability' },
  { id: 'trustsafety', label: 'Trust & Safety' },
  { id: 'others', label: 'Others' },
];

type Props = {
  onClose: () => void;
};

function CookbooksSelection(props: Props) {
  const { onClose } = props;

  function handleTabClick(id: string) {
    console.log(id);
  }

  return (
    <div className="flex flex-col pt-4 w-full h-full">
      <PopupSurface
        height="100%"
        onCloseIconClick={onClose}
        headerContent={
          <section className="flex items-center justify-flex-start gap-5">
            <TabsBar
              tabItems={tabItems}
              barColor={colors.moongray['800']}
              selectedTabColor={colors.moonpurple}
              activeTabId="quality"
              onTabClick={handleTabClick}
            />
          </section>
        }>
        <h2>Cookbooks</h2>
      </PopupSurface>
    </div>
  );
}

export { CookbooksSelection };
