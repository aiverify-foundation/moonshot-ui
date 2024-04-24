import React, { useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import styles from './styles/submenuButton.module.css';

type SubmenuButtonProps = {
  text: string;
  menuIconName?: IconName;
  btnColor: string;
  hoverBtnColor: string;
  textColor: string;
  width: string;
  onClick: () => void;
};

function SubmenuButton(props: SubmenuButtonProps) {
  const {
    text,
    menuIconName,
    btnColor,
    hoverBtnColor,
    textColor,
    width,
    onClick,
  } = props;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={`flex justify-between items-center rounded-xl ${styles.submenuButton}`}
      onClick={onClick}
      style={{
        backgroundColor: isHovered ? hoverBtnColor : btnColor,
        color: textColor,
        padding: '1.5rem',
        width,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="flex gap-2.5">
        {menuIconName ? (
          <Icon
            name={menuIconName}
            size={27}
          />
        ) : null}
        <span className="text-[1.2rem]">{text}</span>
      </div>
      <Icon name={IconName.ArrowRight} />
    </button>
  );
}

export { SubmenuButton };
