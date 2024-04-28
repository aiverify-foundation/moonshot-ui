import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';

type MainSectionSurfaceProps = {
  children: React.ReactNode;
  bgColor?: string;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  onCloseIconClick: () => void;
};

function MainSectionSurface(props: MainSectionSurfaceProps) {
  const { height, minHeight, onCloseIconClick, children, bgColor } = props;
  return (
    <div
      className="flex flex-col w-full dark:bg-moongray-950 rounded-2xl p-6"
      style={{ height, minHeight, backgroundColor: bgColor }}>
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
