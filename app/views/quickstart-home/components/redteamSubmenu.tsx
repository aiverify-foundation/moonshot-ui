import { IconName } from '@/app/components/IconSVG';
import { MainSectionViews } from '@/app/views/quickstart-home/enums';
import BackToHomeButton from '@/app/views/shared-components/backToHomeButton/backToHomeButton';
import { SubmenuButton } from '@/app/views/shared-components/submenuButton/submenuButton';
import tailwindConfig from '@/tailwind.config';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type BenchmarkSubmenuProps = {
  changeView: (view: MainSectionViews) => void;
  onBackClick: () => void;
};

function RedteamSubmenu(props: BenchmarkSubmenuProps) {
  const { changeView, onBackClick } = props;

  return (
    <div className="flex flex-col p-8 gap-6">
      <header>
        <BackToHomeButton
          onBackClick={onBackClick}
          colors={colors}
        />
      </header>
      <section className="flex flex-col items-center gap-2.5">
        <h3 className="text-logocolor tracking-widest text-[1.4rem]">
          moonshot utilities
        </h3>
        <SubmenuButton
          width="40%"
          text="Start New Session"
          menuIconName={IconName.CheckList}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={() => changeView(MainSectionViews.REDTEAMING)}
        />
        <SubmenuButton
          width="40%"
          text="View Past Sessions"
          menuIconName={IconName.HistoryClock}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={() => null}
        />
        <SubmenuButton
          width="40%"
          text="View Auto Red Teaming"
          menuIconName={IconName.Book}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={() => null}
        />
      </section>
    </div>
  );
}

export { RedteamSubmenu };
