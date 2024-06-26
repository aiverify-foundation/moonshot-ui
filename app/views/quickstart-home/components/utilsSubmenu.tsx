import { Icon, IconName } from '@/app/components/IconSVG';
import { SubmenuButton } from '@/app/views/shared-components/submenuButton/submenuButton';
import tailwindConfig from '@/tailwind.config';

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
              color={colors.moongray[300]}
            />
            <p className="dark:text-moongray-300">Back to Home</p>
          </div>
        </button>
      </header>
      <section className="flex flex-col items-center gap-2.5">
        <h3 className="text-moonpurplelight tracking-widest text-[1.2rem]">
          red team with moonshot
        </h3>
        <SubmenuButton
          width="40%"
          text="Upload Datasets"
          textColor={colors.white}
          onClick={onClick}
        />
        <SubmenuButton
          width="40%"
          text="View Prompt Templates"
          textColor={colors.white}
          onClick={onClick}
        />
        <SubmenuButton
          width="40%"
          text="View Context Strategies"
          textColor={colors.white}
          onClick={onClick}
        />
      </section>
    </div>
  );
}

export { UtilsSubmenu };
