import { Icon, IconName } from '@/app/components/IconSVG';

type Props = {
  onBackClick?: () => void;
  colors: CustomColors;
};

function BackToHomeButton({ onBackClick, colors }: Props) {
  return (
    <button onClick={onBackClick}>
      <div className="flex gap-3">
        <Icon
          name={IconName.ArrowLeft}
          color={colors.moongray[200]}
          onClick={onBackClick}
        />
        <p className="text-moongray-200 hover:font-bold">Back to Home</p>
      </div>
    </button>
  );
}

export default BackToHomeButton;
