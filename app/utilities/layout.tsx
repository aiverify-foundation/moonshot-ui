import React from 'react';
import { CustomLink } from '@/app/components/customLink';
import LeftNav from '@/app/components/leftNav';
import { MicroLayout } from '@/app/components/microLayout';
import Notifications from '@/app/components/notifications';
import { SvgImage } from '@/app/components/svgImage';

export default function BenchmarkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <LeftNav activeItem="utils" />
      </nav>
      <header className="flex justify-between items-center px-4 mb-5">
        <CustomLink href="/">
          <SvgImage
            src="/aivmoonshot-logo.svg"
            height={80}
            width={310}
            alt="AIVerify Moonshot Logo"
          />
        </CustomLink>
        <Notifications />
      </header>
      <main className="h-full">
        <div className="flex flex-col h-full">{children}</div>
      </main>
    </MicroLayout>
  );
}
