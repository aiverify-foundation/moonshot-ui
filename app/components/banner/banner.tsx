'use client';
import { PropsWithChildren, ReactNode } from 'react';
import { IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { CustomLink } from '@/app/components/customLink';
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
  } = props;

  return (
    <figure
      className={styles.banner}
      style={{ backgroundColor: bannerColor }}>
      {children}
      <figcaption className={styles.caption_container}>
        <p
          className={styles.caption_text}
          style={{ color: textColor }}>
          {bannerText}
        </p>
        <CustomLink
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
        </CustomLink>
      </figcaption>
    </figure>
  );
}

export { Banner };
