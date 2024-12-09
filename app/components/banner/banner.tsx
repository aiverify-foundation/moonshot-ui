'use client';
import Link from 'next/link';
import { PropsWithChildren, ReactNode } from 'react';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { useIsResponsiveBreakpoint } from '@/app/hooks/useIsResponsiveBreakpoint';
import { cn } from '@/app/lib/cn';
import styles from './styles/banner.module.css';

type BannerProps = {
  bannerText: string | ReactNode;
  bannerColor?: string;
  textColor?: string;
  buttonText: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonTextColor?: string;
  onBtnClick?: () => void;
  className?: string;
};

function Banner(props: PropsWithChildren<BannerProps>) {
  const {
    bannerText,
    bannerColor = '#FFFFFF',
    textColor = '#000000',
    buttonText,
    buttonColor = '#000000',
    buttonHoverColor = '#EEEEEE',
    buttonTextColor = '#FFFFFF',
    onBtnClick,
    children,
    className,
  } = props;

  const screenSize = useIsResponsiveBreakpoint();

  return (
    <figure
      className={cn(
        styles.banner,
        `${screenSize === 'sm' || screenSize === 'md' ? '!p-10' : ''}`,
        className
      )}
      style={{ backgroundColor: bannerColor }}>
      {children}
      <figcaption className={styles.caption_container}>
        <p
          className={`${styles.caption_text} ${
            screenSize === 'sm' || screenSize === 'md'
              ? '!text-[1.2rem]'
              : undefined
          }`}
          style={{ color: textColor }}>
          {bannerText}
        </p>
        <Link
          href="/benchmarking/session/new"
          onClick={onBtnClick}>
          <Button
            type="button"
            size="lg"
            btnColor={buttonColor}
            hoverBtnColor={buttonHoverColor}
            textColor={buttonTextColor}
            mode={ButtonType.PRIMARY}
            text={buttonText}
            rightIconName={IconName.ArrowRight}
          />
        </Link>
      </figcaption>
    </figure>
  );
}

export { Banner };
