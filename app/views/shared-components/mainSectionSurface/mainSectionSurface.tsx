import { Icon, IconName } from '@/app/components/IconSVG';

type MainSectionSurfaceProps = {
  children: React.ReactNode;
  onCloseIconClick: () => void;
};

function MainSectionSurface(props: MainSectionSurfaceProps) {
  const { onCloseIconClick, children } = props;
  return (
    <div className="flex flex-col w-full mb-6 dark:bg-moongray-950 rounded-2xl p-6">
      <header className="flex flex-col relative h-8">
        <div className="absolute top-0 right-0">
          <Icon
            name={IconName.Close}
            size={32}
            onClick={onCloseIconClick}
          />
        </div>
      </header>
      {children}
    </div>
  );
}

export { MainSectionSurface };
