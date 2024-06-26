import { Icon, IconName } from './IconSVG';

type IconButtonProps = {
  iconName: IconName;
  iconSize?: number;
  label?: string;
  labelSize?: number;
  disabled?: boolean;
  className?: string;
  activeColor?: string;
  rounded?: boolean;
  onClick?: () => void;
};

function IconButton(props: IconButtonProps) {
  const {
    iconName,
    label,
    labelSize,
    disabled,
    activeColor,
    className,
    iconSize = 11,
    rounded = true,
    onClick,
  } = props;
  return (
    <button
      disabled={disabled}
      className={`h-6 py-0 px-[7px] text-xs text-white
      disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-fuchsia-900/30 disabled:text-white/70
      bg-fuchsia-900/80 hover:bg-fuchsia-900/50 active:bg-fuchsia-900 dark:bg-sky-700 dark:hover:bg-sky-800 
      dark:active:bg-sky-600 btn-small flex items-center gap-2 ${rounded ? 'rounded' : 'rounded-none'} ${className}`}
      type="button"
      style={{
        backgroundColor: activeColor,
      }}
      onClick={onClick}>
      <Icon
        name={iconName}
        color="#FFFFFF"
        size={iconSize}
      />
      {label !== undefined ? (
        <div
          className="mb-[2px]"
          style={{ fontSize: labelSize }}>
          {label}
        </div>
      ) : null}
    </button>
  );
}

export { IconButton };
