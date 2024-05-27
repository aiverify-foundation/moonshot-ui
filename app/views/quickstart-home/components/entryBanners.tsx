'use client';
import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { ActionCard } from '@/app/components/actionCard/actionCard';
import { Banner } from '@/app/components/banner/banner';
import { colors } from '@/app/views/shared-components/customColors';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';

function EntryBanners() {
  const dispatch = useAppDispatch();
  function handleStartNewRunClick() {
    dispatch(resetBenchmarkCookbooks());
    dispatch(resetBenchmarkModels());
  }
  return (
    <div className="grid grid-cols-1 grid-rows-[1rem, 1fr] gap-2">
      <section className="mb-[1%]">
        <Banner
          bannerColor={colors.moongray[700]}
          textColor={colors.white}
          buttonColor={colors.moongray[950]}
          buttonHoverColor={colors.moongray[900]}
          buttonTextColor={colors.white}
          bannerText={
            <span>
              Focus on what&apos;s important, <br /> Run only the best and most
              relevant tests.
            </span>
          }
          buttonText="Get Started"
          onBtnClick={handleStartNewRunClick}>
          <div style={{ paddingLeft: '0.5rem' }}>
            <Icon
              name={IconName.Asterisk}
              size={50}
            />
          </div>
        </Banner>
      </section>
      <section>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-3 grid grid-cols-3 gap-[1.7%]">
            <Link
              href="/redteaming/sessions/new"
              onClick={handleStartNewRunClick}>
              <ActionCard
                title="Discover"
                description="new vulnerabilities"
                descriptionColor={colors.moongray[300]}
                cardColor={colors.moongray[950]}
                iconName={IconName.Spacesuit}
                actionText="Start Red Teaming"
              />
            </Link>
            <Link
              href="/benchmarking/session/new"
              onClick={handleStartNewRunClick}>
              <ActionCard
                title="Evaluate"
                description="against standard tests"
                descriptionColor={colors.moongray[300]}
                cardColor={colors.moongray[950]}
                iconName={IconName.CheckList}
                actionText="Run Benchmarks"
              />
            </Link>
            <Link href="/benchmarking/cookbooks/new">
              <ActionCard
                title="Create"
                description="cookbooks"
                descriptionColor={colors.moongray[300]}
                cardColor={colors.moongray[950]}
                iconName={IconName.Book}
                actionText="Select Recipes"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export { EntryBanners };
