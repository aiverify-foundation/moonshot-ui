import { Icon, IconName } from '@/app/components/IconSVG';
import tailwindConfig from '@/tailwind.config';
import { SubmenuButton } from '../../shared-components/submenuButton/submenuButton';

const colors = tailwindConfig.theme?.extend?.colors as CustomColors;

type UtilsSubmenuProps = {
  onClick: () => void;
  onBackClick: () => void;
};

function UtilsSubmenu(props: UtilsSubmenuProps) {
  const { onClick, onBackClick } = props;
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
          text="Upload Datasets"
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={onClick}
        />
        <SubmenuButton
          width="40%"
          text="View Prompt Templates"
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={onClick}
        />
        <SubmenuButton
          width="40%"
          text="View Context Strategies"
          btnColor={colors.moongray[950]}
          hoverBtnColor={colors.moongray[800]}
          textColor={colors.white}
          onClick={onClick}
        />
      </section>
    </div>
  );
}

export { UtilsSubmenu };
