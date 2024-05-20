import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import Image from 'next/image'
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
      <header className="flex justify-between items-center px-4 mb-5">
        <Image
          src="/aivmoonshot-logo.svg"
          height={80}
          width={250}
          alt="AIVerify Moonshot Logo"
        />
        {/* <Icon
          color={colors.moongray[300]}
          name={IconName.Bell}
          size={30}
        /> */}
      </header>
      <main className="h-full">
        <EntryBanners />
      </main>
    </MicroLayout>
  );
}

export { HomePageView };
