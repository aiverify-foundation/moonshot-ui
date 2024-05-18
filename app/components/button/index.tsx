import clsx from 'clsx';
import React, { useState } from 'react';
import styles from './styles/button.module.css';
import { Icon, IconName } from '@components/IconSVG';

export enum ButtonType {
  PRIMARY,
  SECONDARY,
  OUTLINE,
  LINK,
  TEXT,
}

type ButtonProps = {
  type?: 'button' | 'submit';
  mode: ButtonType;
  text: string;
  btnColor?: string;
  hoverBtnColor?: string;
  pressedBtnColor?: string;
  textColor?: string;
  textSize?: string;
  textWeight?: string;
  leftIconName?: IconName;
  rightIconName?: IconName;
  iconSize?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  width?: React.CSSProperties['width'];
  alignContent?: 'center' | 'flex-start' | 'flex-end';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function Button(props: ButtonProps) {
  const {
    type = 'button',
    mode,
    btnColor,
    hoverBtnColor,
    pressedBtnColor,
    textColor,
    leftIconName,
    rightIconName,
    iconSize,
    text,
    textSize,
    textWeight,
    disabled = false,
    size = 'md',
    width,
    alignContent,
    onClick = () => null,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  let cssClass = '';

  let btnBgColor = btnColor;
  if (isHovered) {
    btnBgColor = hoverBtnColor;
  }
  if (isPressed) {
    btnBgColor = pressedBtnColor;
  }

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
    case ButtonType.TEXT:
      cssClass = clsx(styles.btn, styles.btn_text, styles[`btn_${size}`]);
      break;
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={cssClass}
      style={{
        background: btnBgColor,
        color: textColor,
        ...(mode == ButtonType.LINK ? { padding: 0 } : {}),
        width,
        justifyContent: alignContent,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}>
      {leftIconName && (
        <Icon
          name={leftIconName || IconName.ArrowLeft}
          size={iconSize}
        />
      )}
      <span style={{ fontSize: textSize, fontWeight: textWeight }}>{text}</span>
      {rightIconName && (
        <Icon
          name={rightIconName || IconName.ArrowRight}
          size={iconSize}
        />
      )}
    </button>
  );
}

export { Button };
