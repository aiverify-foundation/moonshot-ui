import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';

type MainSectionSurfaceProps = {
  children: React.ReactNode;
  bgColor?: string;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  contentHeight?: React.CSSProperties['height'];
  headerHeight?: React.CSSProperties['height'];
  headerContent?: React.ReactNode;
  onCloseIconClick?: () => void;
  closeLinkUrl?: string;
  className?: string;
  showHeaderDivider?: boolean;
};

function MainSectionSurface(props: MainSectionSurfaceProps) {
  const {
    height,
    minHeight,
    closeLinkUrl,
    onCloseIconClick,
    contentHeight = 'calc(100% - 32px)',
    headerHeight = 30,
    headerContent,
    children,
    bgColor,
    className,
    showHeaderDivider = false,
  } = props;

  const CloseIcon = closeLinkUrl ? (
    <Link
      href={closeLinkUrl}
      className="hover:opacity-50 active:opacity-25">
      <Icon
        name={IconName.Close}
        size={32}
      />
    </Link>
  ) : onCloseIconClick ? (
    <Icon
      name={IconName.Close}
      size={32}
      onClick={onCloseIconClick}
    />
  ) : null;

  return (
    <div
      className={clsx(
        'flex flex-col w-full dark:bg-moongray-950 rounded-2xl',
        className
      )}
      style={{ height, minHeight, backgroundColor: bgColor }}>
      <header
        className={`flex flex-col shrink-0 relative justify-center items-center ${showHeaderDivider ? 'shadow-md' : undefined}`}
        style={{ height: headerHeight }}>
        <div className="absolute top-[15px] right-[15px]">{CloseIcon}</div>
        {headerContent}
      </header>
      <section
        style={{ height: contentHeight }}
        className="p-6">
        {children}
      </section>
    </div>
  );
}

export { MainSectionSurface };
