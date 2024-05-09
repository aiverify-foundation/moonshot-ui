import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import LeftNav from '@/app/components/leftNav';
import tailwindConfig from '@/tailwind.config';
import { EntryBanners } from './components/entryBanners';
import { MicroLayout } from './components/microLayout';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

function HomePageView() {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <LeftNav />
      </nav>
      <header className="flex justify-between items-center px-4">
        <h1
          className="text-moonpurplelight tracking-[0.7rem] font-extralight text-[2.7rem] cursor-pointer"
          style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.5)' }}>
          moonshot.
        </h1>
        <Icon
          darkModeColor={colors.moongray[300]}
          name={IconName.Bell}
          size={30}
        />
      </header>
      <main className="h-full">
        <EntryBanners />
      </main>
    </MicroLayout>
  );
}

export { HomePageView };
