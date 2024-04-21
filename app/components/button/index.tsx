import clsx from 'clsx';
import styles from './styles/button.module.css';
import { Icon, IconName } from '@components/IconSVG';

enum ButtonType {
  PRIMARY,
  SECONDARY,
  OUTLINE,
  LINK,
}

type ButtonProps = {
  type: ButtonType;
  text: string;
  btnColor?: string;
  textColor?: string;
  iconName?: IconName;
};

function Button(props: ButtonProps) {
  const { type, btnColor, textColor, iconName, text } = props;
  let cssClass = '';

  switch (type) {
    case ButtonType.PRIMARY:
      cssClass = clsx(styles.btn, styles.btn_primary);
      break;
    case ButtonType.SECONDARY:
      cssClass = clsx(styles.btn, styles.btn_secondary);
      break;
    case ButtonType.OUTLINE:
      cssClass = clsx(styles.btn, styles.btn_outline);
      break;
    case ButtonType.LINK:
      cssClass = clsx(styles.btn, styles.btn_link);
      break;
  }

  return (
    <button
      className={cssClass}
      style={{ backgroundColor: btnColor, color: textColor }}>
      <span>{text}</span>
      <Icon name={iconName || IconName.ArrowRight} />
    </button>
  );
}

export { Button, ButtonType };
