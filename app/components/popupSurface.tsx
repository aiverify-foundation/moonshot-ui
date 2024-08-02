import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';

type PopupSurfaceProps = {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  padding?: React.CSSProperties['padding'];
  style?: React.CSSProperties;
  onCloseIconClick?: () => void;
};

function PopupSurface(props: PopupSurfaceProps) {
  const {
    height,
    minHeight,
    headerContent,
    onCloseIconClick,
    padding,
    style,
    children,
  } = props;
  return (
    <div
      className="relative flex flex-col w-full bg-moongray-950 rounded-2xl border border-moonpurple"
      style={{ height, minHeight, padding, ...style }}>
      <header className="flex flex-col items-center relative">
        {headerContent}
        {onCloseIconClick && (
          <div
            className="absolute top-4 right-4"
            style={{
              zIndex: 900,
              ...(padding !== undefined && { top: '1rem' }),
            }}>
            <Icon
              name={IconName.Close}
              size={32}
              onClick={onCloseIconClick}
            />
          </div>
        )}
      </header>
      {children}
    </div>
  );
}

export { PopupSurface };
