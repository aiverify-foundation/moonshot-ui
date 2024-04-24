import { Icon, IconName } from '@/app/components/IconSVG';
import { MainSectionViews } from '@/app/views/quickstart-home/enums';
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
        <button onClick={onBackClick}>
          <div className="flex gap-3">
            <Icon
              name={IconName.ArrowLeft}
              darkModeColor={colors.moongray[300]}
            />
            <p className="dark:text-moongray-300">Back to Home</p>
          </div>
        </button>
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
