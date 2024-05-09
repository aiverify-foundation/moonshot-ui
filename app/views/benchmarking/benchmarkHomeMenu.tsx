import Link from 'next/link';
import { IconName } from '@/app/components/IconSVG';
import { colors } from '@/app/views/shared-components/customColors';
import { SubmenuButton } from '@/app/views/shared-components/submenuButton/submenuButton';

function BenchmarkHomeMenu() {
  return (
    <section className="flex flex-col items-center gap-2.5">
      <h3 className="text-moonpurplelight tracking-widest text-[1.4rem]">
        benchmark with moonshot
      </h3>
      <Link
        href="/benchmarking/session/new"
        style={{ width: '40%' }}>
        <SubmenuButton
          width="100%"
          text="Start New Session"
          menuIconName={IconName.CheckList}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
        />
      </Link>
      <SubmenuButton
        width="40%"
        text="View Past Sessions"
        menuIconName={IconName.HistoryClock}
        btnColor={colors.moongray[950]}
        hoverBtnColor={colors.moongray[800]}
        textColor={colors.white}
      />
      <SubmenuButton
        width="40%"
        text="View Cookbooks"
        menuIconName={IconName.Book}
        btnColor={colors.moongray[950]}
        hoverBtnColor={colors.moongray[800]}
        textColor={colors.white}
      />
      <SubmenuButton
        width="40%"
        text="View Recipes"
        menuIconName={IconName.File}
        btnColor={colors.moongray[950]}
        hoverBtnColor={colors.moongray[800]}
        textColor={colors.white}
      />
    </section>
  );
}

export { BenchmarkHomeMenu };
