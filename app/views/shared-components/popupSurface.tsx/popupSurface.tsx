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
      className="flex flex-col w-full dark:bg-moongray-950 rounded-2xl p-6"
      style={{ height, minHeight }}>
      <header className="flex flex-col items-center relative h-8">
        {headerContent}
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

export { PopupSurface };
