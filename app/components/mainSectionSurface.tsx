import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { CustomLink } from '@/app/components/customLink';

type MainSectionSurfaceProps = {
  children: React.ReactNode;
  bgColor?: string;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  onCloseIconClick?: () => void;
  closeLinkUrl?: string;
};

function MainSectionSurface(props: MainSectionSurfaceProps) {
  const {
    height,
    minHeight,
    closeLinkUrl,
    onCloseIconClick,
    children,
    bgColor,
  } = props;
  return (
    <div
      className="flex flex-col w-full dark:bg-moongray-950 rounded-2xl p-6"
      style={{ height, minHeight, backgroundColor: bgColor }}>
      <header
        className="flex flex-col shrink-0 relative"
        style={{ height: 32 }}>
        <div className="absolute top-0 right-0">
          {closeLinkUrl ? (
            <CustomLink
              href={closeLinkUrl}
              className="hover:opacity-50 active:opacity-25">
              <Icon
                name={IconName.Close}
                size={32}
              />
            </CustomLink>
          ) : onCloseIconClick ? (
            <Icon
              name={IconName.Close}
              size={32}
              onClick={onCloseIconClick}
            />
          ) : null}
        </div>
      </header>
      <section style={{ height: 'calc(100% - 32px)' }}>{children}</section>
    </div>
  );
}

export { MainSectionSurface };
