'use client';

import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { ActionCard } from '@/app/components/actionCard/actionCard';
import { Banner } from '@/app/components/banner/banner';
import tailwindConfig from '@/tailwind.config';
import { MicroLayout } from './components/microLayout';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

export default function QuickstartHome() {
  return (
    <MicroLayout>
      <nav className="pt-[5rem]">
        <ul className="flex flex-col gap-10">
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.OutlineBox}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.CheckList}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.Spacesuit}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
              name={IconName.HistoryClock}
              size={50}
            />
          </li>
          <li>
            <Icon
              darkModeColor={colors.moongray[300]}
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
          darkModeColor={colors.moongray[300]}
          name={IconName.Bell}
          size={30}
        />
      </header>
      <main>
        <section className="mb-[1%]">
          <Banner
            bannerColor={colors.moongray[700]}
            textColor={colors.white}
            buttonColor={colors.moongray[950]}
            buttonTextColor={colors.white}
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
            <div className="col-span-3 grid grid-cols-3 gap-[1%]">
              <ActionCard
                title="Discover"
                description="new vulnerabilities"
                descriptionColor={colors.moongray[300]}
                cardColor={colors.moongray[950]}
                iconName={IconName.Spacesuit}
                actionText="Start Red Teaming"
                onClick={() => {
                  console.log('clicked');
                }}
              />
              <ActionCard
                title="Evaluate"
                description="against standard tests"
                descriptionColor={colors.moongray[300]}
                cardColor={colors.moongray[950]}
                iconName={IconName.CheckList}
                actionText="Run Benchmarks"
                onClick={() => {
                  console.log('clicked');
                }}
              />
              <ActionCard
                title="Create"
                description="custom tests"
                descriptionColor={colors.moongray[300]}
                cardColor={colors.moongray[950]}
                iconName={IconName.Lightning}
                actionText="Start Red Teaming"
                onClick={() => {
                  console.log('clicked');
                }}
              />
            </div>
          </div>
        </section>
      </main>
    </MicroLayout>
  );
}
