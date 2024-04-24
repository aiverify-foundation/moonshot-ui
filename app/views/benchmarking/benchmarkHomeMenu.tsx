import { IconName } from '@/app/components/IconSVG';
import { SubmenuButton } from '@/app/views/shared-components/submenuButton/submenuButton';
import tailwindConfig from '@/tailwind.config';
import { BenchmarkHomeViews } from './enums';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type Props = {
  changeView: (view: BenchmarkHomeViews) => void;
};

function BenchmarkHomeMenu({ changeView }: Props) {
  return (
    <section className="flex flex-col items-center gap-2.5">
      <h3 className="text-logocolor tracking-widest text-[1.4rem]">
        benchmark with moonshot
      </h3>
      <SubmenuButton
        width="40%"
        text="Start New Session"
        menuIconName={IconName.CheckList}
        btnColor={colors.moongray[950]}
        hoverBtnColor={colors.moongray[800]}
        textColor={colors.white}
        onClick={() => changeView(BenchmarkHomeViews.NEW_SESSION)}
      />
      <SubmenuButton
        width="40%"
        text="View Past Sessions"
        menuIconName={IconName.HistoryClock}
        btnColor={colors.moongray[950]}
        hoverBtnColor={colors.moongray[800]}
        textColor={colors.white}
        onClick={() => changeView(BenchmarkHomeViews.HOME)}
      />
      <SubmenuButton
        width="40%"
        text="View Cookbooks"
        menuIconName={IconName.Book}
        btnColor={colors.moongray[950]}
        hoverBtnColor={colors.moongray[800]}
        textColor={colors.white}
        onClick={() => changeView(BenchmarkHomeViews.HOME)}
      />
      <SubmenuButton
        width="40%"
        text="View Recipes"
        menuIconName={IconName.File}
        btnColor={colors.moongray[950]}
        hoverBtnColor={colors.moongray[800]}
        textColor={colors.white}
        onClick={() => changeView(BenchmarkHomeViews.HOME)}
      />
    </section>
  );
}

export { BenchmarkHomeMenu };
