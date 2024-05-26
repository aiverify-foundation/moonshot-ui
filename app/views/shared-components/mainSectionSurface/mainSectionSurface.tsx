import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import Link from 'next/link';

type MainSectionSurfaceProps = {
  children: React.ReactNode;
  bgColor?: string;
  height?: React.CSSProperties['height'];
  minHeight?: React.CSSProperties['minHeight'];
  onCloseIconClick?: () => void;
  closeLinkUrl: string;
};

function MainSectionSurface(props: MainSectionSurfaceProps) {
  const { height, minHeight, closeLinkUrl, children, bgColor } = props;
  return (
    <div
      className="flex flex-col w-full dark:bg-moongray-950 rounded-2xl p-6"
      style={{ height, minHeight, backgroundColor: bgColor }}>
      <header
        className="flex flex-col shrink-0 relative"
        style={{ height: 32 }}>
        <div className="absolute top-0 right-0">
          <Link href={closeLinkUrl}>
            <Icon
              name={IconName.Close}
              size={32}
            />
          </Link>
        </div>
      </header>
      <section style={{ height: 'calc(100% - 32px)' }}>{children}</section>
    </div>
  );
}

export { MainSectionSurface };
