import React from 'react';
import { Icon, IconName } from './IconSVG';

type ActionCardProps = {
  title: string;
  description: string;
  iconName: IconName;
  style: React.CSSProperties;
};

function ActionCard(props: ActionCardProps) {
  const { title, description, iconName, style } = props;
  return (
    <div style={style}>
      <div>
        <Icon
          name={iconName}
          size={24}
        />
        <div>{title}</div>
        <div>{description}</div>
      </div>
    </div>
  );
}

export { ActionCard };
