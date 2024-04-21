import React from 'react';
import styles from './styles/actionCard.module.css';
import { Icon, IconName } from '@components/IconSVG';

type ActionCardProps = {
  title: string;
  description: string;
  actionText: string;
  cardColor?: string;
  textColor?: string;
  descriptionColor?: string;
  iconName: IconName;
  iconColor?: string;
  iconSize?: number;
  height?: number;
  onClick?: () => void;
};

function ActionCard(props: ActionCardProps) {
  const {
    title,
    description,
    iconName,
    iconSize = 50,
    iconColor = '#FFFFFF',
    cardColor = '#000000',
    textColor = '#FFFFFF',
    descriptionColor = '#FFFFFF',
    height,
    actionText,
    onClick,
  } = props;
  return (
    <figure
      className={styles.card}
      style={{ backgroundColor: cardColor, height }}
      onClick={onClick}>
      <Icon
        darkModeColor={iconColor}
        lightModeColor={iconColor}
        name={iconName}
        size={iconSize}
      />
      <section>
        <h2 style={{ color: textColor }}>{title}</h2>
        <p style={{ color: descriptionColor || textColor }}>{description}</p>
      </section>
      <figcaption>
        <p style={{ color: textColor }}>{actionText}</p>
        <Icon name={IconName.ArrowRight} />
      </figcaption>
    </figure>
  );
}

export { ActionCard };
