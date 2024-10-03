import { IconName } from '@/app/components/IconSVG';
import BackToHomeButton from '@/app/components/backToHomeButton';
import { CustomLink } from '@/app/components/customLink';
import { SubmenuButton } from '@/app/components/submenuButton/submenuButton';
import { colors } from '@/app/customColors';

export default function UtilitiesHomePage() {
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
          testing history
        </h3>
        <CustomLink
          href="/benchmarking/runs"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Past Runs"
            menuIconName={IconName.CheckList}
            textColor={colors.white}
          />
        </CustomLink>
        <CustomLink
          href="/redteaming/sessions"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Past Sessions"
            menuIconName={IconName.Spacesuit}
            textColor={colors.white}
          />
        </CustomLink>
      </section>
    </>
  );
}
