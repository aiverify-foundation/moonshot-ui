import React from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import styles from './styles/actionCard.module.css';
import { cn } from '@/app/lib/cn';
import { useIsResponsiveBreakpoint } from '@/app/hooks/useIsResponsiveBreakpoint';

type ActionCardProps = {
  title: string;
  titleSize?: number;
  description?: string;
  actionText?: string;
  cardColor?: string;
  textColor?: string;
  descriptionColor?: string;
  iconName: IconName;
  iconColor?: string;
  iconSize?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
};

function ActionCard(props: ActionCardProps) {
  const screenSize = useIsResponsiveBreakpoint();
  const {
    title,
    titleSize,
    description,
    iconName,
    iconSize = screenSize === 'sm' || screenSize === 'md' ? 40 : 50,
    iconColor = '#FFFFFF',
    cardColor = '#000000',
    textColor = '#FFFFFF',
    descriptionColor = '#FFFFFF',
    height,
    actionText,
    style,
    onClick,
    className,
  } = props;

  return (
    <figure
      className={cn(
        styles.card,
        `${screenSize === 'sm' || screenSize === 'md' ? '!h-[260px]' : ''}`,
        className
      )}
      style={{ backgroundColor: cardColor, height, ...style }}
      onClick={onClick}>
      <Icon
        color={iconColor}
        name={iconName}
        size={iconSize}
      />
      <section>
        <h2 style={{ color: textColor, fontSize: titleSize }}>{title}</h2>
        <p style={{ color: descriptionColor || textColor }}>{description}</p>
      </section>
      <figcaption>
        {actionText && (
          <>
            <p style={{ color: textColor }}>{actionText}</p>
            <Icon name={IconName.ArrowRight} />
          </>
        )}
      </figcaption>
    </figure>
  );
}

export { ActionCard };
