import React from 'react';
import LeftNav from '@/app/components/leftNav';
import Notifications from '@/app/components/notifications';
import { MicroLayout } from './components/microLayout';
import { EntryBanners } from './entryBanners';
import { Logo } from './logo';

function HomePageView() {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <LeftNav />
      </nav>
      <header className="flex justify-between items-center px-4 mb-5">
        <Logo />
        <Notifications />
      </header>
      <main className="h-full">
        <EntryBanners />
      </main>
    </MicroLayout>
  );
}

export { HomePageView };
