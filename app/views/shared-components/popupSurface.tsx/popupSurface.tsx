import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';

type PopupSurfaceProps = {
  children: React.ReactNode;
  headerContent: React.ReactNode;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  onCloseIconClick: () => void;
};

function PopupSurface(props: PopupSurfaceProps) {
  const { height, minHeight, headerContent, onCloseIconClick, children } =
    props;
  return (
    <div
      className="relative flex flex-col w-full dark:bg-moongray-950 rounded-2xl py-6 border border-moonpurple"
      style={{ height, minHeight }}>
      <header className="flex flex-col items-center relative">
        {headerContent}
        <div className="absolute top-0 right-4">
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

export { PopupSurface };
