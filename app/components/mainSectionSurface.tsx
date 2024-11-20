import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import clsx from 'clsx';

type MainSectionSurfaceProps = {
  children: React.ReactNode;
  bgColor?: string;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  contentHeight?: React.CSSProperties['height'];
  headerContent?: React.ReactNode;
  onCloseIconClick?: () => void;
  closeLinkUrl?: string;
  className?: string;
};

function MainSectionSurface(props: MainSectionSurfaceProps) {
  const {
    height,
    minHeight,
    closeLinkUrl,
    onCloseIconClick,
    contentHeight = 'calc(100% - 32px)',
    headerContent,
    children,
    bgColor,
    className,
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
        'flex flex-col w-full dark:bg-moongray-950 rounded-2xl p-6',
        className
      )}
      style={{ height, minHeight, backgroundColor: bgColor }}>
      <header className="flex flex-col shrink-0 relative h-[32px] justify-center items-center">
        <div className="absolute top-0 right-0">{CloseIcon}</div>
        {headerContent}
      </header>
      <section style={{ height: contentHeight }}>{children}</section>
    </div>
  );
}

export { MainSectionSurface };
