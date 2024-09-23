import React from 'react';
import LeftNav from '@/app/components/leftNav';
import Notifications from '@/app/components/notifications';
import { MicroLayout } from './components/microLayout';
import { SvgImage } from './components/svgImage';
import { EntryBanners } from './entryBanners';

function HomePageView() {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <LeftNav />
      </nav>
      <header className="flex justify-between items-center px-4 mb-5">
        <SvgImage
          src="/aivmoonshot-logo.svg"
          height={80}
          width={310}
          alt="AIVerify Moonshot Logo"
        />
        <Notifications />
      </header>
      <main className="h-full">
        <EntryBanners />
      </main>
    </MicroLayout>
  );
}

export { HomePageView };
