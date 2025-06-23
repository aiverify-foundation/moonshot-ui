'use client';
import Link from 'next/link';
import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { ActionCard } from '@/app/components/actionCard/actionCard';
import { Banner } from '@/app/components/banner/banner';
import { ImdaStarterKitLink } from '@/app/components/link-constants';
import { Modal } from '@/app/components/modal';
import { colors } from '@/app/customColors';
import { useIsResponsiveBreakpoint } from '@/app/hooks/useIsResponsiveBreakpoint';
import { useOrientation } from '@/app/hooks/useOrientation';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';

function EntryBanners() {
  const dispatch = useAppDispatch();
  const screenSize = useIsResponsiveBreakpoint();
  const orientation = useOrientation();
  function handleStartNewRunClick() {
    dispatch(resetBenchmarkCookbooks());
    dispatch(resetBenchmarkModels());
  }
  return (
    <>
      {orientation === 'portrait' && (
        <Modal
          heading="Change Orientation"
          bgColor={colors.moongray['800']}
          textColor="#FFFFFF"
          primaryBtnLabel="Ok"
          enableScreenOverlay
          hideCloseIcon>
          <div className="flex gap-2 items-start">
            <Icon
              name={IconName.Alert}
              size={30}
              color={colors.moongray[400]}
              style={{ marginTop: '8px' }}
            />
            <p className="text-[1.1rem] pt-3">
              Change to landscape mode for better user experience.
            </p>
          </div>
        </Modal>
      )}
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
                {"Run benchmark tests recommended in IMDA's "}<ImdaStarterKitLink />{","}<br />
                {"for safety testing of LLM-based applications"}
              </span>
            }
            buttonText="Get Started"
            onBtnClick={handleStartNewRunClick}>
            <div style={{ paddingLeft: '0.5rem' }}>
              <Icon
                name={IconName.Asterisk}
                size={screenSize === 'sm' || screenSize === 'md' ? 45 : 50}
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
    </>
  );
}

export { EntryBanners };
