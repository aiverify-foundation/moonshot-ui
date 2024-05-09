import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import LeftNav from '@/app/components/leftNav';
import { MicroLayout } from '@/app/views/quickstart-home/components/microLayout';
import BackToHomeButton from '@/app/views/shared-components/backToHomeButton/backToHomeButton';
import { colors } from '@/app/views/shared-components/customColors';
import { BenchmarkHomeMenu } from './benchmarkHomeMenu';

function BenchmarkHome() {
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
        <div className="flex flex-col h-full">
          <header>
            <Link href="/">
              <BackToHomeButton colors={colors} />
            </Link>
          </header>
          <BenchmarkHomeMenu />
        </div>
      </main>
    </MicroLayout>
  );
}

export { BenchmarkHome };
