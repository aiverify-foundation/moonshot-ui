import Link from 'next/link';
import { IconName } from '@/app/components/IconSVG';
import BackToHomeButton from '@/app/views/shared-components/backToHomeButton/backToHomeButton';
import { colors } from '@/app/views/shared-components/customColors';
import { SubmenuButton } from '@/app/views/shared-components/submenuButton/submenuButton';

export default function UtilitiesHomePage() {
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
          moonshot utilities
        </h3>
        <Link
          href="/utilities/prompt-templates"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Prompt Templates"
            menuIconName={IconName.MoonPromptTemplate}
            textColor={colors.white}
          />
        </Link>
        <Link
          href="/utilities/context-strategies"
          style={{ width: '40%' }}>
          <SubmenuButton
            width="100%"
            text="View Context Strategies"
            menuIconName={IconName.MoonContextStrategy}
            textColor={colors.white}
          />
        </Link>
      </section>
    </>
  );
}
