import Link from 'next/link';
import { IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/views/shared-components/customColors';
import { SubmenuButton } from '@/app/views/shared-components/submenuButton/submenuButton';
import BackToHomeButton from '@/app/views/shared-components/backToHomeButton/backToHomeButton';

export default function RedteamingHomePage() {
  return (
    <>
      <header>
        <Link href="/">
          <BackToHomeButton colors={colors} />
        </Link>
      </header>
      <section className="flex flex-col items-center gap-2.5">
        <h3 className="text-moonpurplelight tracking-widest text-[1.4rem]">
          benchmark with moonshot
        </h3>
        <Link
          href="/redteaming/sessions/new"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="Start New Session"
            menuIconName={IconName.Spacesuit}
            btnColor={colors.moongray[950]}
            hoverBtnColor={colors.moongray[800]}
            textColor={colors.white}
          />
        </Link>
        <Link
          href="/redteaming/sessions"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Past Sessions"
            menuIconName={IconName.HistoryClock}
            btnColor={colors.moongray[950]}
            hoverBtnColor={colors.moongray[800]}
            textColor={colors.white}
          />
        </Link>
        <Link
          href="/redteaming/attackmodules"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Attack Modules"
            menuIconName={IconName.MoonAttackStrategy}
            btnColor={colors.moongray[950]}
            hoverBtnColor={colors.moongray[800]}
            textColor={colors.white}
          />
        </Link>
      </section>
    </>
  );
}
