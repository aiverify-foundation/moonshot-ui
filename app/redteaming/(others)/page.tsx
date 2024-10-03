import { IconName } from '@/app/components/IconSVG';
import BackToHomeButton from '@/app/components/backToHomeButton';
import { CustomLink } from '@/app/components/customLink';
import { SubmenuButton } from '@/app/components/submenuButton/submenuButton';
import { colors } from '@/app/customColors';

export default function RedteamingHomePage() {
  return (
    <>
      <header className="relative h-[50px]">
        <CustomLink
          href="/"
          style={{ position: 'absolute', top: 10, left: 15 }}>
          <BackToHomeButton colors={colors} />
        </CustomLink>
      </header>
      <section className="flex flex-col items-center gap-2.5">
        <h3 className="text-moonpurplelight tracking-widest text-[1.4rem]">
          red team with moonshot
        </h3>
        <CustomLink
          href="/redteaming/sessions/new"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="Start New Session"
            menuIconName={IconName.Spacesuit}
            textColor={colors.white}
          />
        </CustomLink>
        <CustomLink
          href="/redteaming/sessions"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Past Sessions"
            menuIconName={IconName.HistoryClock}
            textColor={colors.white}
          />
        </CustomLink>
        <CustomLink
          href="/redteaming/attackmodules"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Attack Modules"
            menuIconName={IconName.MoonAttackStrategy}
            textColor={colors.white}
          />
        </CustomLink>
        <CustomLink
          href="/redteaming/bookmarks"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Bookmarks"
            menuIconName={IconName.Ribbon}
            textColor={colors.white}
          />
        </CustomLink>
      </section>
    </>
  );
}
