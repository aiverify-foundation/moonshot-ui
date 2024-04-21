'use client';

import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Banner } from '@/app/components/banner/banner';
import { MicroLayout } from './components/microLayout';

export default function QuickstartHome() {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <ul className="flex flex-col gap-10">
          <li>
            <Icon
              name={IconName.OutlineBox}
              size={50}
            />
          </li>
          <li>
            <Icon
              name={IconName.CheckList}
              size={50}
            />
          </li>
          <li>
            <Icon
              name={IconName.Spacesuit}
              size={50}
            />
          </li>
          <li>
            <Icon
              name={IconName.HistoryClock}
              size={50}
            />
          </li>
          <li>
            <Icon
              name={IconName.Tools}
              size={50}
            />
          </li>
        </ul>
      </nav>
      <header className="flex justify-between items-center px-4">
        <h1 className="text-logocolor tracking-[0.7rem] font-extralight text-[2.7rem]">
          moonshot.
        </h1>
        <Icon
          name={IconName.Bell}
          size={30}
        />
      </header>
      <main>
        <section className="mb-[10px]">
          <Banner
            bannerColor="#504F59"
            textColor="#FFFFFF"
            buttonColor="#000000"
            buttonTextColor="#FFFFFF"
            bannerText={
              <span>
                Focus on what&apos;s important, <br /> Run only the best and
                most relevant tests.
              </span>
            }
            buttonText="Get Started">
            <div style={{ paddingLeft: '0.5rem' }}>
              <Icon
                name={IconName.Asterisk}
                size={65}
              />
            </div>
          </Banner>
        </section>
        <section>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 border border-yellow-500 grid grid-cols-3 gap-[0.5%]">
              <div className="border border-green-500 h-[100px]">col 1</div>
              <div className="border border-green-500 h-[100px]">col 2</div>
              <div className="border border-green-500 h-[100px]">col 2</div>
            </div>
          </div>
        </section>
      </main>
    </MicroLayout>
  );
}
