import { Icon, IconName } from '@/app/components/IconSVG';
import { MainSectionViews } from '@/app/views/quickstart-home/enums';
import tailwindConfig from '@/tailwind.config';
import { SubmenuButton } from './submenuButton';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type BenchmarkSubmenuProps = {
  changeView: (view: MainSectionViews) => void;
  onBackClick: () => void;
};

function BenchmarkSubmenu(props: BenchmarkSubmenuProps) {
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
        <h3 className="text-logocolor tracking-widest text-[1.2rem]">
          benchmark with moonshot
        </h3>
        <SubmenuButton
          width="40%"
          text="Start New Session"
          menuIconName={IconName.CheckList}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={() =>
            changeView(MainSectionViews.BENCHMARKING_PRIMARY_USE_CASE)
          }
        />
        <SubmenuButton
          width="40%"
          text="View Past Sessions"
          menuIconName={IconName.HistoryClock}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={() =>
            changeView(MainSectionViews.BENCHMARKING_PRIMARY_USE_CASE)
          }
        />
        <SubmenuButton
          width="40%"
          text="View Cookbooks"
          menuIconName={IconName.Book}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={() =>
            changeView(MainSectionViews.BENCHMARKING_PRIMARY_USE_CASE)
          }
        />
        <SubmenuButton
          width="40%"
          text="View Recipes"
          menuIconName={IconName.File}
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={() =>
            changeView(MainSectionViews.BENCHMARKING_PRIMARY_USE_CASE)
          }
        />
      </section>
    </div>
  );
}

export { BenchmarkSubmenu };
