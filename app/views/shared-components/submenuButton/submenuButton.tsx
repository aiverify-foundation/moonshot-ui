import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import styles from './styles/submenuButton.module.css';

type SubmenuButtonProps = {
  text: string;
  menuIconName?: IconName;
  textColor: string;
  width?: string;
  onClick?: () => void;
};

function SubmenuButton(props: SubmenuButtonProps) {
  const { text, menuIconName, textColor, width, onClick } = props;
  return (
    <button
      className={`flex justify-between items-center rounded-[25px]
        bg-moongray-950 hover:bg-moongray-1000 active:bg-moongray-800 ${styles.submenuButton}
        shadow-none`}
      onClick={onClick}
      style={{
        color: textColor,
        padding: '1.5rem',
        width,
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
      }}>
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
