import clsx from 'clsx';
import styles from './styles/button.module.css';
import { Icon, IconName } from '@components/IconSVG';
import { useState } from 'react';

enum ButtonType {
  PRIMARY,
  SECONDARY,
  OUTLINE,
  LINK,
}

type ButtonProps = {
  type: 'button' | 'submit';
  mode: ButtonType;
  text: string;
  btnColor?: string;
  hoverBtnColor?: string;
  textColor?: string;
  iconName?: IconName;
  iconSize?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
};

function Button(props: ButtonProps) {
  const {
    mode,
    btnColor,
    hoverBtnColor,
    textColor,
    iconName,
    iconSize,
    text,
    disabled = false,
    size = 'md',
    onClick = () => null,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  let cssClass = '';

  switch (mode) {
    case ButtonType.PRIMARY:
      cssClass = clsx(styles.btn, styles.btn_primary, styles[`btn_${size}`]);
      break;
    case ButtonType.SECONDARY:
      cssClass = clsx(styles.btn, styles.btn_secondary, styles[`btn_${size}`]);
      break;
    case ButtonType.OUTLINE:
      cssClass = clsx(styles.btn, styles.btn_outline, styles[`btn_${size}`]);
      break;
    case ButtonType.LINK:
      cssClass = clsx(styles.btn, styles.btn_link, styles[`btn_${size}`]);
      break;
  }

  return (
    <button
      disabled={disabled}
      className={cssClass}
      style={{
        background: isHovered ? hoverBtnColor : btnColor,
        color: textColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}>
      <span>{text}</span>
      <Icon
        name={iconName || IconName.ArrowRight}
        size={iconSize}
      />
    </button>
  );
}

export { Button, ButtonType };
