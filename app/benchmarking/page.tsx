'use client';
import Link from 'next/link';
import { IconName } from '@/app/components/IconSVG';
import BackToHomeButton from '@/app/components/backToHomeButton';
import { SubmenuButton } from '@/app/components/submenuButton/submenuButton';
import { colors } from '@/app/customColors';
import {
  resetBenchmarkCookbooks,
  resetBenchmarkModels,
  useAppDispatch,
} from '@/lib/redux';

export default function BenchmarkingHomePage() {
  const dispatch = useAppDispatch();
  function handleStartNewRunClick() {
    dispatch(resetBenchmarkCookbooks());
    dispatch(resetBenchmarkModels());
  }

  return (
    <>
      <header className="relative h-[50px]">
        <Link
          href="/"
          style={{ position: 'absolute', top: 10, left: 15 }}>
          <BackToHomeButton colors={colors} />
        </Link>
      </header>
      <section className="flex flex-col items-center gap-2.5">
        <h3 className="text-moonpurplelight tracking-widest text-[1.4rem]">
          benchmark with moonshot
        </h3>
        <Link
          href="/benchmarking/session/new?skip_topics=true"
          style={{ width: '40%' }}
          onClick={handleStartNewRunClick}>
          <SubmenuButton
            width="100%"
            text="Start New Run"
            menuIconName={IconName.CheckList}
            textColor={colors.white}
          />
        </Link>
        <Link
          href="/benchmarking/runs"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Past Runs"
            menuIconName={IconName.HistoryClock}
            textColor={colors.white}
          />
        </Link>
        <Link
          href="/benchmarking/cookbooks"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Cookbooks"
            menuIconName={IconName.Book}
            textColor={colors.white}
          />
        </Link>
        <Link
          href="/benchmarking/recipes"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Recipes"
            menuIconName={IconName.File}
            textColor={colors.white}
          />
        </Link>
      </section>
    </>
  );
}
